import { NextRequest, NextResponse } from 'next/server';
import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from '@langchain/qdrant';
import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages } from 'ai';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { messages, collection } = await request.json();
        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
        }
        if (!collection) {
            return NextResponse.json({ error: 'Collection is required' }, { status: 400 });
        }

        const userCollectionName = `${userId}_${collection}`;

        const latestMessage = messages[messages.length - 1];
        if (!latestMessage || latestMessage.role !== 'user') {
            return NextResponse.json({ error: 'Latest message must be from user' }, { status: 400 });
        }

        const userMessageText =
            latestMessage.parts
                ?.filter((part: { type: string }) => part.type === 'text')
                .map((part: { text: string }) => part.text)
                .join(' ') || '';

        if (!userMessageText.trim()) {
            return NextResponse.json({ error: 'User message must contain text' }, { status: 400 });
        }

        const embeddings = new OpenAIEmbeddings({ model: 'text-embedding-3-small' });
        let vectorStore;
        try {
            vectorStore = await QdrantVectorStore.fromExistingCollection(
                embeddings,
                {
                    url: process.env.QDRANT_URL || 'http://localhost:6333',
                    collectionName: userCollectionName,
                }
            );
        } catch (collectionError: any) {
            console.error('Failed to connect to collection:', {
                collection: userCollectionName,
                error: collectionError.message,
                details: collectionError
            });

            const result = streamText({
                model: openai('gpt-4o-mini'),
                messages: convertToModelMessages(messages),
                system: "I'm sorry, but I couldn't find your document collection. Please make sure you have uploaded documents first, or the collection name is correct."
            });

            return result.toUIMessageStreamResponse();
        }
        const retriever = vectorStore.asRetriever({
            k: 5,
            searchType: 'similarity',
        });

        let relevantChunks;
        try {
            relevantChunks = await retriever.invoke(userMessageText);
        } catch (retrieverError) {

            try {
                const alternativeRetriever = vectorStore.asRetriever({
                    k: 3,
                    searchType: 'similarity',
                });
                relevantChunks = await alternativeRetriever.invoke(userMessageText);
            } catch (altError) {
                console.error('Alternative retriever also failed:', altError);

                const result = streamText({
                    model: openai('gpt-4o-mini'),
                    messages: convertToModelMessages(messages),
                    system: "I'm sorry, but there was an error searching your documents. This might be due to an empty collection or a configuration issue. Please try uploading your documents again."
                });

                return result.toUIMessageStreamResponse();
            }
        }

        if (relevantChunks.length === 0) {
            const result = streamText({
                model: openai('gpt-4o-mini'),
                messages: convertToModelMessages(messages),
                system:
                    "I'm sorry, but I couldn't find relevant information in your uploaded documents. Please try uploading more relevant files or change your question."
            });

            return result.toUIMessageStreamResponse();
        }

        const contextText = relevantChunks
            .map((doc, i) => {
                const pageInfo = doc.metadata.pageNumber ? `(Page ${doc.metadata.pageNumber})` : '';
                const sourceInfo = doc.metadata.source ? `(Source: ${doc.metadata.source})` : '';
                const rowInfo = doc.metadata.row ? `(Row: ${doc.metadata.row}, File: ${doc.metadata.file})` : '';
                const fileInfo = doc.metadata.filename ? `(File: ${doc.metadata.filename})` : '';

                return `Chunk ${i + 1} ${pageInfo} ${sourceInfo} ${rowInfo} ${fileInfo}:\n${doc.pageContent}`;
            })
            .join('\n\n');

        const SYSTEM_PROMPT = `
You are an intelligent AI assistant designed to answer user queries **strictly based on the provided context**.
Follow these rules carefully:

### 1. Greetings & Conversation Flow
- Greet the user **positively only in your very first response**.
- Do **not** repeat the greeting in subsequent messages.
- After greeting, **politely guide the user** towards uploading a file or entering a website URL for better results.

### 2. Answering Rules
- Use **only the information available in the provided context**.
- Never make assumptions or fabricate answers.
- If the answer **cannot be found in the context**, reply exactly with:
  **"Unsure about answer"**

### 3. Citation Rules
Always cite the source **clearly** based on the document type:
- **PDFs** → Include the **page number** and **filename** if available.
- **Web documents** → Include the **source URL**.
- **CSVs** → Include the **row number** and **filename**.

### 4. Style & Tone
- Keep responses **concise, accurate, and user-friendly**.
- Do not repeat unnecessary details or over-explain.
- If multiple relevant points exist, summarize them **clearly and logically**.

Context:
${contextText}
`;


        const modelMessages = convertToModelMessages(messages);
        const result = streamText({
            model: openai('gpt-4o-mini'),
            messages: modelMessages,
            system: SYSTEM_PROMPT,
        });

        return result.toUIMessageStreamResponse({
            onError: (error) => {
                console.error('Stream error:', error);
                return 'An error occurred while processing your request';
            },
        });

    } catch (error) {
        return NextResponse.json(
            {
                error: 'Failed to process chat request',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}