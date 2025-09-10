import { NextRequest, NextResponse } from 'next/server';
import { QdrantClient } from '@qdrant/js-client-rest';
import { auth } from '@clerk/nextjs/server';

const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL || 'http://localhost:6333',
    apiKey: process.env.QDRANT_API_KEY,
});

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ name: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const { name } = await params;
        if (!name) {
            return NextResponse.json({ error: 'Collection name is required.' }, { status: 400 });
        }
        const userCollectionName = `${userId}_${name}`;
        try {
            await qdrant.getCollection(userCollectionName);
        } catch {
            return NextResponse.json(
                { error: 'Collection not found or unauthorized' },
                { status: 403 }
            );
        }
        await qdrant.deleteCollection(userCollectionName);
        return NextResponse.json({
            success: true,
            message: `Collection ${name} deleted successfully`,
        });
    } catch (error) {
        console.error('Error deleting collection:', error);
        return NextResponse.json(
            {
                error: 'Failed to delete collection',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
