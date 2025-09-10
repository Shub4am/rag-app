import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { CSVLoader } from '@langchain/community/document_loaders/fs/csv';
import { saveToQdrant, splitDocs } from '@/lib/dbUtils';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.formData();
        const file: File | null = data.get('csv') as unknown as File;
        const collection = data.get('collection') as string || 'csv-collection';

        if (!file) {
            return NextResponse.json(
                { error: 'No CSV file uploaded' },
                { status: 400 }
            );
        }
        if (file.size > 1048576) {
            return NextResponse.json(
                { error: 'CSV file size exceeds 1MB limit' },
                { status: 400 }
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const blobName = `csv-${Date.now()}-${Math.round(Math.random() * 1e9)}.csv`;
        const blob = await put(blobName, buffer, { access: 'public' });
        const blobRes = await fetch(blob.url);
        const blobArrayBuffer = await blobRes.arrayBuffer();
        const csvBlob = new Blob([blobArrayBuffer], { type: 'text/csv' });

        const loader = new CSVLoader(csvBlob);
        const docs = await loader.load();
        const withMetadata = docs.map((doc, i) => ({
            ...doc,
            metadata: {
                ...doc.metadata,
                row: i + 1,
                file: file.name,
                uploadDate: new Date().toISOString(),
            },
        }));
        const splitDocsResult = await splitDocs(withMetadata);
        const result = await saveToQdrant(splitDocsResult, collection, userId);

        return NextResponse.json({
            success: true,
            message: `CSV indexed successfully! ${result.count} chunks added to ${collection}`,
            collection,
            documentsCount: result.count,
            rowsProcessed: docs.length,
            created: result.created || false,
            blobUrl: blob.url,
        });
    } catch (error) {
        console.error('Error indexing CSV:', error);
        return NextResponse.json(
            {
                error: 'Failed to index CSV',
                details:
                    typeof error === 'object' && error !== null && 'message' in error
                        ? (error as { message: string }).message
                        : String(error),
            },
            { status: 500 }
        );
    }
}