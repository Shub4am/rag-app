'use client';

import { useState } from 'react';
import { Collection } from '@/types';
import { FolderIcon, PlusIcon, RefreshCcwIcon } from 'lucide-react';

interface SidebarProps {
    collections: Collection[];
    selectedCollection: string;
    onCollectionSelect: (collection: string) => void;
    onRefresh: () => void;
}

export default function Sidebar({
    collections,
    selectedCollection,
    onCollectionSelect,
    onRefresh
}: SidebarProps) {
    const [newCollectionName, setNewCollectionName] = useState('');
    const [showNewCollection, setShowNewCollection] = useState(false);

    const handleCreateCollection = () => {
        if (newCollectionName.trim()) {
            onCollectionSelect(newCollectionName.trim());
            setNewCollectionName('');
            setShowNewCollection(false);
        }
    };

    return (
        <div className="w-80 bg-zinc-900 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-800">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-semibold text-white">Notebook LLM</h1>
                    <button
                        onClick={onRefresh}
                        className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                        <RefreshCcwIcon className="w-4 h-4" />
                    </button>
                </div>

                <button
                    onClick={() => setShowNewCollection(!showNewCollection)}
                    className="w-full flex items-center gap-2 p-3 bg-zinc-800 hover:bg-blue-700 border border-blue-200 rounded-lg transition-colors"
                >
                    <PlusIcon className="w-4 h-4 text-white" />
                    <span className="text-white font-medium">New Notebook</span>
                </button>

                {showNewCollection && (
                    <div className="mt-2 flex gap-2">
                        <input
                            type="text"
                            value={newCollectionName}
                            onChange={(e) => setNewCollectionName(e.target.value)}
                            placeholder="Collection name"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateCollection()}
                        />
                        <button
                            onClick={handleCreateCollection}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                        >
                            Create
                        </button>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                    <h2 className="text-sm font-medium text-white mb-3">Your Notebooks</h2>
                    <div className="space-y-2">
                        {collections.map((collection) => (
                            <button
                                key={collection.name}
                                onClick={() => onCollectionSelect(collection.name)}
                                className={`w-full text-left p-3 rounded-lg transition-colors ${selectedCollection === collection.name
                                    ? 'bg-blue-500 border border-blue-200'
                                    : 'hover:bg-blue-500'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <FolderIcon className="w-5 h-5 text-white mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-white truncate">
                                            {collection.name}
                                        </div>
                                        <div className="text-xs text-gray-200 mt-1">
                                            {collection.documentCount} documents
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}