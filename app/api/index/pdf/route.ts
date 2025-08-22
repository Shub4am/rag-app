import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { saveToQdrant, splitDocs } from '@/lib/utils';

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData();
        const file: File | null = data.get('pdf') as unknown as File;
        const collection = data.get('collection') as string || 'pdf-collection';

        if (!file) {
            return NextResponse.json(
                { error: 'No PDF file uploaded' },
                { status: 400 }
            );
        }
        if (file.size > 1048576) {
            return NextResponse.json(
                { error: 'PDF file size exceeds 1MB limit' },
                { status: 400 }
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const blobName = `pdf-${Date.now()}-${Math.round(Math.random() * 1e9)}.pdf`;
        const blob = await put(blobName, buffer, { access: 'public' });
        const blobRes = await fetch(blob.url);
        const blobArrayBuffer = await blobRes.arrayBuffer();
        const pdfBlob = new Blob([blobArrayBuffer], { type: 'application/pdf' });
        const loader = new PDFLoader(pdfBlob, { splitPages: true });
        const docs = await loader.load();
        const splitDocsResult = await splitDocs(docs, {
            filename: file.name,
            uploadDate: new Date().toISOString(),
        });
        const result = await saveToQdrant(splitDocsResult, collection);

        return NextResponse.json({
            success: true,
            message: `PDF indexed successfully! ${result.count} chunks added to ${collection}`,
            collection,
            documentsCount: result.count,
            created: result.created || false,
            blobUrl: blob.url,
        });
    } catch (error) {
        console.error('Error indexing PDF:', error);
        return NextResponse.json(
            {
                error: 'Failed to index PDF',
                details: typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : String(error),
            },
            { status: 500 }
        );
    }
}