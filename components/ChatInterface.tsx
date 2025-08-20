'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types';
import { SendIcon, BotIcon } from 'lucide-react';
import MessageBubble from './MessageBubble';


interface ChatInterfaceProps {
    messages: ChatMessage[];
    onSendMessage: (message: string) => void;
    loading: boolean;
    selectedCollection: string;
}

export default function ChatInterface({
    messages,
    onSendMessage,
    loading,
    selectedCollection
}: ChatInterfaceProps) {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !loading) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    const suggestedQuestions = [
        "What is the main topic of the documents?",
        "Summarize the key points from the pdf or uploaded url",
    ];

    return (
        <div className="flex flex-col h-full">
            <div className="bg-zinc-900 border-b border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-white">
                    Chat with {selectedCollection}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                    Ask questions about your documents
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-900">
                {messages.length === 0 ? (
                    <div className="text-center py-12">
                        <BotIcon className="w-12 h-12 text-white mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-200 mb-2">
                            Start a conversation
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Ask questions about your documents to get started
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                            {suggestedQuestions.map((question, index) => (
                                <button
                                    key={index}
                                    onClick={() => onSendMessage(question)}
                                    className="p-3 text-left bg-zinc-800 hover:bg-zinc-900 rounded-lg border border-gray-200 transition-colors"
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

                {loading && (
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <BotIcon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <div className="bg-gray-100 rounded-lg p-4">
                                <div className="flex space-x-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="bg-zinc-900 border-t border-gray-200 p-4">
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question about your documents..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <SendIcon className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
}