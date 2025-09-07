import { NextRequest, NextResponse } from 'next/server';
import { QdrantClient } from '@qdrant/js-client-rest';

const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL || 'http://localhost:6333',
    apiKey: process.env.QDRANT_API_KEY,
});

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ name: string }> }
) {
    try {
        const { name } = await params;

        if (!name) {
            return NextResponse.json({ error: 'Collection name is required.' }, { status: 400 });
        }

        await qdrant.deleteCollection(name);

        return NextResponse.json({
            success: true,
            message: `Collection ${name} deleted successfully`
        });
    } catch (error) {
        console.error('Error deleting collection:', error);
        return NextResponse.json(
            {
                error: 'Failed to delete collection',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}