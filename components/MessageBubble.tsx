'use client';

import { ChatMessage } from '@/types';
import { BotIcon, UserIcon, FileTextIcon, GlobeIcon } from 'lucide-react';

interface MessageBubbleProps {
    message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === 'user';

    return (
        <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
            {!isUser && (
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <BotIcon className="w-4 h-4 text-blue-600" />
                </div>
            )}

            <div className={`flex-1 max-w-3xl ${isUser ? 'text-right' : ''}`}>
                <div
                    className={`inline-block p-4 rounded-lg ${isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-800 text-gray-200'
                        }`}
                >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                </div>

                {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 space-y-2">
                        <div className="text-sm text-gray-400 font-medium">Sources:</div>
                        {message.sources.map((source, index) => (
                            <div
                                key={index}
                                className="bg-zinc-900 border border-gray-200 rounded-lg p-3 text-sm"
                            >
                                <div className="flex items-start gap-2">
                                    {source.source ? (
                                        <GlobeIcon className="w-4 h-4 text-gray-200 mt-0.5" />
                                    ) : (
                                        <FileTextIcon className="w-4 h-4 text-gray-200 mt-0.5" />
                                    )}
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">
                                            {source.filename || source.source || `Chunk ${source.chunk}`}
                                            {source.pageNumber && ` (Page ${source.pageNumber})`}
                                            {source.row && ` (Row ${source.row})`}
                                        </div>
                                        <div className="text-gray-400 mt-1">{source.content}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-xs text-gray-300 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                </div>
            </div>

            {isUser && (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-gray-600" />
                </div>
            )}
        </div>
    );
}
