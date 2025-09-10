import { NextRequest, NextResponse } from 'next/server';
import { QdrantClient } from '@qdrant/js-client-rest';
import { auth } from '@clerk/nextjs/server';

const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL || 'http://localhost:6333',
    apiKey: process.env.QDRANT_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const { name } = await request.json();
        if (!name || typeof name !== 'string' || !name.trim()) {
            return NextResponse.json({ error: 'Collection name is required.' }, { status: 400 });
        }
        const userCollectionName = `${userId}_${name}`;
        let collectionExists = false;
        try {
            await qdrant.getCollection(userCollectionName);
            collectionExists = true;
        } catch {
            collectionExists = false;
        }

        if (!collectionExists) {
            try {
                await qdrant.createCollection(userCollectionName, {
                    vectors: {
                        size: 1536,
                        distance: 'Cosine',
                    },
                });
            } catch (createError) {
                console.error('Failed to create collection in Qdrant:', createError);
                return NextResponse.json(
                    {
                        error: 'Failed to create collection in vector database',
                        details: createError instanceof Error ? createError.message : String(createError),
                    },
                    { status: 500 }
                );
            }
        }
        const collectionsResponse = await qdrant.getCollections();
        const userCollections = collectionsResponse.collections
            .map((c) => c.name)
            .filter((n) => n.startsWith(`${userId}_`))
            .map((n) => n.replace(`${userId}_`, ''));

        return NextResponse.json({ success: true, collections: userCollections });
    } catch (error) {
        console.error('Error in POST handler:', error);
        return NextResponse.json(
            {
                error: 'Failed to process request',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const collectionsResponse = await qdrant.getCollections();
        const collectionsWithCounts = await Promise.all(
            collectionsResponse.collections
                .filter((collection) => collection.name.startsWith(`${userId}_`)) // ✅ Only current user's collections
                .map(async (collection) => {
                    let documentCount = 0;
                    try {
                        const info = await qdrant.getCollection(collection.name);
                        documentCount = info.points_count || 0;
                    } catch {
                        documentCount = 0;
                    }
                    return {
                        name: collection.name.replace(`${userId}_`, ''), // ✅ Remove prefix for UI
                        documentCount,
                        lastUpdated: new Date().toISOString(),
                    };
                })
        );
        return NextResponse.json({ success: true, collections: collectionsWithCounts });
    } catch (error) {
        console.error('Error getting collections:', error);
        return NextResponse.json(
            {
                error: 'Failed to get collections',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}