import { NextRequest, NextResponse } from 'next/server';
import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from '@langchain/qdrant';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { collection, text } = await request.json();
        if (!collection || !text) {
            return NextResponse.json(
                { error: 'Collection and text are required.' },
                { status: 400 }
            );
        }
        const userCollectionName = `${userId}_${collection}`;
        const doc = {
            pageContent: text,
            metadata: {
                source: 'manual',
                uploadDate: new Date().toISOString(),
                userId,
            },
        };

        const embeddings = new OpenAIEmbeddings({ model: 'text-embedding-3-small' });

        let vectorStore;
        try {
            vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
                url: process.env.QDRANT_URL || 'http://localhost:6333',
                collectionName: userCollectionName,
            });
        } catch (error) {
            vectorStore = await QdrantVectorStore.fromDocuments([doc], embeddings, {
                url: process.env.QDRANT_URL || 'http://localhost:6333',
                collectionName: userCollectionName,
            });

            return NextResponse.json({
                success: true,
                message: 'Collection created and text stored.',
            });
        }
        await vectorStore.addDocuments([doc]);

        return NextResponse.json({
            success: true,
            message: 'Text stored in collection.',
        });
    } catch (error) {
        console.error('Error storing text in Qdrant:', error);
        return NextResponse.json(
            {
                error: 'Failed to store text in Qdrant',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
