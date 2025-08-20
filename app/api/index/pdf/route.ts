import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import fetch from 'node-fetch';
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

        // Upload to Vercel Blob
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const blobName = `pdf-${Date.now()}-${Math.round(Math.random() * 1e9)}.pdf`;
        const blob = await put(blobName, buffer, { access: 'public' });


        // Download the file from Blob to process it (PDFLoader expects a Blob or file path)
        const blobRes = await fetch(blob.url);
        const blobArrayBuffer = await blobRes.arrayBuffer();
        const pdfBlob = new Blob([blobArrayBuffer], { type: 'application/pdf' });

        // Use PDFLoader with Blob
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