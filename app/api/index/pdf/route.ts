import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from '@langchain/qdrant';

// Helper functions
async function splitDocs(docs: any[], extraMetadata = {}) {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    const splitDocs = await splitter.splitDocuments(docs);
    return splitDocs.map((d) => ({
        ...d,
        metadata: { ...d.metadata, ...extraMetadata },
    }));
}

async function saveToQdrant(docs: any[], collectionName: string) {
    if (!docs || docs.length === 0) {
        throw new Error(`No documents to index for ${collectionName}`);
    }

    const embeddings = new OpenAIEmbeddings({ model: 'text-embedding-3-large' });

    try {
        const vectorStore = await QdrantVectorStore.fromExistingCollection(
            embeddings,
            {
                url: process.env.QDRANT_URL || 'http://localhost:6333',
                apiKey: process.env.QDRANT_API_KEY,
                collectionName,
            },
        );

        await vectorStore.addDocuments(docs);
        return { success: true, count: docs.length };
    } catch (error) {
        if (
            typeof error === 'object' &&
            error !== null &&
            'message' in error &&
            typeof (error).message === 'string' &&
            (
                (error).message.includes('not found') ||
                (error).message.includes('does not exist')
            )
        ) {
            const vectorStore = await QdrantVectorStore.fromDocuments(
                docs,
                embeddings,
                {
                    url: process.env.QDRANT_URL || 'http://localhost:6333',
                    collectionName,
                },
            );
            console.log(vectorStore)
            return { success: true, count: docs.length, created: true };
        }
        throw error;
    }
}

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
        const uploadsDir = './uploads';
        if (!existsSync(uploadsDir)) {
            await mkdir(uploadsDir, { recursive: true });
        }
        const collectionsFile = path.join(uploadsDir, 'collections.json');
        let collections: string[] = [];
        try {
            const data = await import('fs/promises').then(fs => fs.readFile(collectionsFile, 'utf-8'));
            collections = JSON.parse(data);
        } catch (err) {
            collections = [];
        }
        if (!collections.includes(collection)) {
            collections.push(collection);
            await import('fs/promises').then(fs => fs.writeFile(collectionsFile, JSON.stringify(collections, null, 2), 'utf-8'));
        }
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filename = `pdf-${uniqueSuffix}.pdf`;
        const filepath = path.join(uploadsDir, filename);

        await writeFile(filepath, buffer);

        try {
            const loader = new PDFLoader(filepath, { splitPages: true });
            const docs = await loader.load();

            const splitDocsResult = await splitDocs(docs, {
                filename: file.name,
                uploadDate: new Date().toISOString(),
            });

            const result = await saveToQdrant(splitDocsResult, collection);
            await unlink(filepath);

            return NextResponse.json({
                success: true,
                message: `PDF indexed successfully! ${result.count} chunks added to ${collection}`,
                collection,
                documentsCount: result.count,
                created: result.created || false,
            });
        } catch (error) {
            if (existsSync(filepath)) {
                await unlink(filepath);
            }
            throw error;
        }
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