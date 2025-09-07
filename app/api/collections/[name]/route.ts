import { NextRequest, NextResponse } from 'next/server';
import { QdrantClient } from '@qdrant/js-client-rest';

const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL || 'http://localhost:6333',
    apiKey: process.env.QDRANT_API_KEY,
});

export async function DELETE(
    request: NextRequest,
    context: { params: { name: string } }
) {
    const { name } = await context.params;
    if (!name) {
        return NextResponse.json({ error: 'Collection name is required.' }, { status: 400 });
    }
    try {
        await qdrant.deleteCollection(name);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            {
                error: 'Failed to delete collection',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}