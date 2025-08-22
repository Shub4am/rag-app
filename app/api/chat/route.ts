import { NextRequest, NextResponse } from 'next/server';
import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from '@langchain/qdrant';
import OpenAI from 'openai';

const client = new OpenAI();

export async function POST(request: NextRequest) {
    try {
        const { message, collection } = await request.json();
        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }
        if (!collection) {
            return NextResponse.json(
                { error: 'Collection is required' },
                { status: 400 }
            );
        }

        const embeddings = new OpenAIEmbeddings({
            model: 'text-embedding-3-small',
        });

        const vectorStore = await QdrantVectorStore.fromExistingCollection(
            embeddings,
            {
                url: process.env.QDRANT_URL || 'http://localhost:6333',
                collectionName: collection,
            },
        );

        const retriever = vectorStore.asRetriever({ k: 5, searchType: 'mmr' });
        const relevantChunks = await retriever.invoke(message);

        if (relevantChunks.length === 0) {
            return NextResponse.json({
                success: true,
                response:
                    "I don't have any relevant information in the selected collection to answer your question.",
                sources: [],
            });
        }
        const contextText = relevantChunks
            .map((doc, i) => {
                const pageInfo = doc.metadata.pageNumber
                    ? `(Page ${doc.metadata.pageNumber})`
                    : '';
                const sourceInfo = doc.metadata.source
                    ? `(Source: ${doc.metadata.source})`
                    : '';
                const rowInfo = doc.metadata.row
                    ? `(Row: ${doc.metadata.row}, File: ${doc.metadata.file})`
                    : '';
                const fileInfo = doc.metadata.filename
                    ? `(File: ${doc.metadata.filename})`
                    : '';

                return `Chunk ${i + 1
                    } ${pageInfo} ${sourceInfo} ${rowInfo} ${fileInfo}:\n${doc.pageContent
                    }`;
            })
            .join('\n\n');

        const SYSTEM_PROMPT = `
      You are an AI assistant who answers queries based ONLY on the given context. 
      - Greet the user positively ONLY on the very first reply.
      - DO NOT repeat the greeting in any later responses and try to divert conversation to the file upload or website url upload.
      Always cite the source:
      - For PDFs → include the page number and filename if available.
      - For web docs → include the source URL.
      - For CSVs → include row number and filename.

      If the answer is not in the context, reply:
      "Unsure about answer"

      Context:
      ${contextText}
      `;

        const completion = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: message },
            ],
        });

        const response = completion.choices[0].message.content;
        let sources = relevantChunks.map((doc, i) => ({
            chunk: i + 1,
            pageNumber: doc.metadata.pageNumber,
            source: doc.metadata.source,
            row: doc.metadata.row,
            filename: doc.metadata.filename || doc.metadata.file,
            content: doc.pageContent.substring(0, 200) + '...',
        }));
        if (response && response.trim() === 'Unsure about answer' || "Hello! How can I assist you today?") {
            sources = [];
        }
        return NextResponse.json({
            success: true,
            response,
            sources,
            collection,
        });
    } catch (error) {
        console.error('Error in chat:', error);
        return NextResponse.json(
            {
                error: 'Failed to process chat request',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}