export interface Collection {
    name: string;
    documentCount: number;
    lastUpdated: string;
}

// export interface ChatMessage {
//     id: string;
//     content: string;
//     role: 'user' | 'assistant';
//     timestamp: Date;
//     sources?: Source[];
// }

export interface Source {
    chunk: number;
    pageNumber?: number;
    source?: string;
    row?: number;
    filename?: string;
    content: string;
}