import { NextRequest, NextResponse } from 'next/server';
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';
import { saveToQdrant, splitDocs } from '@/lib/dbUtils';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { url, collection = 'url-collection' } = await request.json();

        if (!url) {
            return NextResponse.json(
                { error: 'URL is required' },
                { status: 400 }
            );
        }
        const loader = new CheerioWebBaseLoader(url, {
            selector: 'main#content article, article#wikiArticle, main#content, body',
        });

        const docs = await loader.load();
        const withMetadata = docs.map((doc, i) => ({
            ...doc,
            metadata: {
                ...doc.metadata,
                source: url,
                chunk: i + 1,
                indexDate: new Date().toISOString(),
            },
        }));
        const splitDocsResult = await splitDocs(withMetadata);
        const result = await saveToQdrant(splitDocsResult, collection, userId);

        return NextResponse.json({
            success: true,
            message: `URL indexed successfully! ${result.count} chunks added to ${collection}`,
            collection,
            documentsCount: result.count,
            url,
            created: result.created || false,
        });
    } catch (error) {
        console.error('Error indexing URL:', error);
        return NextResponse.json(
            {
                error: 'Failed to index URL',
                details:
                    typeof error === 'object' && error !== null && 'message' in error
                        ? (error as { message: string }).message
                        : String(error),
            },
            { status: 500 }
        );
    }
}