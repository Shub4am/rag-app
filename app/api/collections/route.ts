import { NextRequest, NextResponse } from 'next/server';
import { QdrantClient } from '@qdrant/js-client-rest';

const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL || 'http://localhost:6333',
    apiKey: process.env.QDRANT_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const { name } = await request.json();
        if (!name || typeof name !== 'string' || !name.trim()) {
            return NextResponse.json({ error: 'Collection name is required.' }, { status: 400 });
        }
        let collectionExists = false;
        try {
            await qdrant.getCollection(name);
            collectionExists = true;
        } catch (error) {
        }

        if (!collectionExists) {
            try {
                await qdrant.createCollection(name, {
                    vectors: {
                        size: 1536,
                        distance: 'Cosine'
                    }
                });
                console.log(`Successfully created collection: ${name}`);
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
        try {
            const collectionsResponse = await qdrant.getCollections();
            const collections = collectionsResponse.collections.map(c => c.name);
            return NextResponse.json({ success: true, collections });
        } catch (error) {
            console.error('Failed to fetch collections:', error);
            return NextResponse.json(
                {
                    error: 'Collection may have been created but failed to fetch updated list',
                    details: error instanceof Error ? error.message : String(error),
                },
                { status: 500 }
            );
        }

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
        const collectionsResponse = await qdrant.getCollections();
        const collectionsWithCounts = await Promise.all(
            collectionsResponse.collections.map(async (collection) => {
                let documentCount = 0;
                try {
                    const info = await qdrant.getCollection(collection.name);
                    documentCount = info.points_count || 0;
                } catch (err) {
                    documentCount = 0;
                }
                return {
                    name: collection.name,
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