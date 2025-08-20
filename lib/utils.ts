import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from '@langchain/qdrant';

export async function splitDocs(docs: any[], extraMetadata = {}) {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    const splitDocs = await splitter.splitDocuments(docs);
    return splitDocs.map((d) => ({
        ...d,
        metadata: { ...d.metadata, ...extraMetadata },
    }));
}

export async function saveToQdrant(docs: any[], collectionName: string) {
    if (!docs || docs.length === 0) {
        throw new Error(`No documents to index for ${collectionName}`);
    }

    const embeddings = new OpenAIEmbeddings({ model: 'text-embedding-3-large' });

    try {
        const vectorStore = await QdrantVectorStore.fromExistingCollection(
            embeddings,
            {
                url: process.env.QDRANT_URL || 'http://localhost:6333',
                apiKey: process.env.QDRANT_API_KEY,
                collectionName,
            },
        );

        await vectorStore.addDocuments(docs);
        return { success: true, count: docs.length };
    } catch (error) {
        // If collection doesn't exist, create it
        if (
            typeof error === 'object' &&
            error !== null &&
            'message' in error &&
            typeof (error as any).message === 'string' &&
            (
                (error as any).message.includes('not found') ||
                (error as any).message.includes('does not exist')
            )
        ) {
            const vectorStore = await QdrantVectorStore.fromDocuments(
                docs,
                embeddings,
                {
                    url: process.env.QDRANT_URL || 'http://localhost:6333',
                    collectionName,
                },
            );
            console.log(vectorStore)
            return { success: true, count: docs.length, created: true };
        }
        throw error;
    }
}