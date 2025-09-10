'use client';

import { useRef, useEffect } from 'react';
import { UIMessage } from 'ai';
import { BotIcon, SendHorizontal } from 'lucide-react';
import MessageBubble from './MessageBubble';

interface ChatInterfaceProps {
    messages: UIMessage[];
    input: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
    selectedCollection: string;
    error?: Error | null;
    onSendSuggestedMessage: (text: string) => void;
}

export default function ChatInterface({
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    selectedCollection,
    error,
    onSendSuggestedMessage
}: ChatInterfaceProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const suggestedQuestions = [
        "What is the document about?",
        "Summarize the key points from the pdf or uploaded url",
    ];

    return (
        <div className="flex flex-col h-screen">
            <div className="bg-transparent border-b border-gray-200 p-4 text-center">
                <h2 className="text-lg font-semibold text-white uppercase">
                    Chat with {selectedCollection || "A selected source"}
                </h2>
                <p className="text-sm text-gray-300 mt-1">
                    Share your documents to start
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent">
                {messages.length === 0 ? (
                    <div className="text-center py-12">
                        <BotIcon className="w-12 h-12 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">
                            Start a conversation
                        </h3>
                        <p className="text-gray-300 mb-6">
                            Ask questions about your documents to get started
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                            {suggestedQuestions.map((question, index) => (
                                <button
                                    key={index}
                                    onClick={() => onSendSuggestedMessage(question)}
                                    disabled={!selectedCollection || isLoading}
                                    className="p-3 text-left bg-transparent rounded-lg border border-gray-200 transition-colors backdrop-blur-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5"
                                >
                                    <span className="text-sm text-white">{question}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    messages.map((message) => (
                        <MessageBubble key={message.id} message={message} />
                    ))
                )}

                {isLoading && (
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <BotIcon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <div className=" p-4">
                                <div className="flex space-x-2">
                                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="bg-transparent border-t border-gray-200 p-4">
                {error && (
                    <div className="mb-2 text-red-500 text-sm font-medium">
                        Error: {error.message}
                    </div>
                )}
                {!selectedCollection && (
                    <div className="mb-2 text-gray-300 text-2xl font-medium">
                        Please select or create a collection before chatting.
                    </div>
                )}
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Select a source to chat about your documents..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!selectedCollection}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading || !selectedCollection}
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <SendHorizontal className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}