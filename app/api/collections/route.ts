
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const collections = [
            'pdfs-collection',
            'website-collection'
        ];

        return NextResponse.json({ success: true, collections });
    } catch (error: any) {
        console.error('Error getting collections:', error);
        return NextResponse.json(
            {
                error: 'Failed to get collections',
                details: error.message,
            },
            { status: 500 }
        );
    }
}