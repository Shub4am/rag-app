import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { CSVLoader } from '@langchain/community/document_loaders/fs/csv';
import { saveToQdrant, splitDocs } from '@/lib/utils';

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData();
        const file: File | null = data.get('csv') as unknown as File;
        const collection = data.get('collection') as string || 'csv-collection';

        if (!file) {
            return NextResponse.json(
                { error: 'No CSV file uploaded' },
                { status: 400 }
            );
        }

        // Create uploads directory if it doesn't exist
        const uploadsDir = './uploads';
        if (!existsSync(uploadsDir)) {
            await mkdir(uploadsDir, { recursive: true });
        }

        // Save file temporarily
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filename = `csv-${uniqueSuffix}.csv`;
        const filepath = path.join(uploadsDir, filename);

        await writeFile(filepath, buffer);

        try {
            const loader = new CSVLoader(filepath);
            const docs = await loader.load();

            // Add row + filename metadata
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
            const result = await saveToQdrant(splitDocsResult, collection);

            // Clean up uploaded file
            await unlink(filepath);

            return NextResponse.json({
                success: true,
                message: `CSV indexed successfully! ${result.count} chunks added to ${collection}`,
                collection,
                documentsCount: result.count,
                rowsProcessed: docs.length,
                created: result.created || false,
            });
        } catch (error: any) {
            // Clean up file if it exists
            if (existsSync(filepath)) {
                await unlink(filepath);
            }
            throw error;
        }
    } catch (error: any) {
        console.error('Error indexing CSV:', error);
        return NextResponse.json(
            {
                error: 'Failed to index CSV',
                details: error.message,
            },
            { status: 500 }
        );
    }
}