
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { QdrantClient } from '@qdrant/js-client-rest';

export async function GET() {
    try {
        const collectionsFile = path.join(process.cwd(), 'uploads', 'collections.json');
        let collections: string[] = [];
        try {
            const data = await fs.readFile(collectionsFile, 'utf-8');
            collections = JSON.parse(data);
        } catch (err) {
            collections = [];
        }
        const qdrant = new QdrantClient({
            url: process.env.QDRANT_URL || 'http://localhost:6333',
            apiKey: process.env.QDRANT_API_KEY,
        });
        const collectionsWithCounts = await Promise.all(
            collections.map(async (name) => {
                let documentCount = 0;
                try {
                    const info = await qdrant.getCollection(name);
                    documentCount = info.points_count || 0;
                } catch (err) {
                    documentCount = 0;
                }
                return {
                    name,
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
                details: typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : String(error),
            },
            { status: 500 }
        );
    }
}