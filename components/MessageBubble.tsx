'use client';

import { UIMessage } from 'ai';
import { BotIcon, UserIcon } from 'lucide-react';

interface MessageBubbleProps {
    message: UIMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === 'user';

    return (
        <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
            {!isUser && (
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <BotIcon className="w-5 h-5 text-blue-600" />
                </div>
            )}

            <div className={`flex-1 max-w-3xl ${isUser ? 'text-right' : ''}`}>
                <div
                    className={`inline-block p-4 rounded-lg backdrop-blur-2xl ${isUser
                        ? 'bg-blue-600/80 text-white'
                        : 'bg-black/50 text-gray-200'
                        }`}
                >
                    <div className="whitespace-pre-wrap">
                        {message.parts?.map((part, index) => {
                            switch (part.type) {
                                case 'text':
                                    return (
                                        <span key={index}>{part.text}</span>
                                    );
                                case 'file':
                                    return (
                                        <div key={index} className="mt-2">
                                            {part.mediaType?.startsWith('image/') ? (
                                                <img
                                                    src={part.url}
                                                    alt="Uploaded image"
                                                    className="max-w-xs rounded"
                                                />
                                            ) : (
                                                <div className="text-sm opacity-75">
                                                    📎 File: {part.mediaType}
                                                </div>
                                            )}
                                        </div>
                                    );
                                default:
                                    return null;
                            }
                        })}
                    </div>
                </div>
            </div>

            {isUser && (
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-gray-600" />
                </div>
            )}
        </div>
    );
}