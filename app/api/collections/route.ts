
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const collections = [
            'pdfs-collection',
            'website-collection'
        ];

        return NextResponse.json({ success: true, collections });
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