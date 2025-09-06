'use client';

import { useState } from 'react';
import { Collection } from '@/types';
import { FolderIcon, PlusIcon, RefreshCcwIcon, SidebarIcon } from 'lucide-react';

interface SidebarProps {
    collections: Collection[];
    selectedCollection: string;
    onCollectionSelect: (collection: string) => void;
    onRefresh: () => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

export default function Sidebar({
    collections,
    selectedCollection,
    onCollectionSelect,
    onRefresh,
    isCollapsed,
    onToggleCollapse
}: SidebarProps) {
    const [textToStore, setTextToStore] = useState('');
    const [storeStatus, setStoreStatus] = useState<string | null>(null);
    const [storeLoading, setStoreLoading] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');
    const [showNewCollection, setShowNewCollection] = useState(false);

    const handleStoreText = async () => {
        setStoreStatus(null);
        if (!selectedCollection) {
            setStoreStatus('Please select a collection first.');
            return;
        }
        if (!textToStore.trim()) {
            setStoreStatus('Please enter some text.');
            return;
        }
        setStoreLoading(true);
        const res = await fetch('/api/collections/store', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ collection: selectedCollection, text: textToStore.trim() }),
        });
        if (res.ok) {
            setStoreStatus('Text stored successfully!');
            setTextToStore('');
            onRefresh();
        } else {
            const data = await res.json();
            setStoreStatus(data.error || 'Failed to store text.');
        }
        setStoreLoading(false);
        console.log("stored test:", textToStore)
    };

    const handleCreateCollection = async () => {
        const name = newCollectionName.trim();
        if (!name) return;
        const res = await fetch('/api/collections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
        if (res.ok) {
            onCollectionSelect(name);
            setNewCollectionName('');
            setShowNewCollection(false);
            onRefresh();
        }
    };

    if (isCollapsed) {
        return (
            <div className="w-16 bg-transparent border-r border-gray-200 flex flex-col items-center py-4">
                <button
                    onClick={onToggleCollapse}
                    className="p-3 hover:bg-blue-600 rounded-lg transition-colors cursor-pointer mb-4 backdrop-blur-2xl"
                    title="Expand sidebar"
                >
                    <SidebarIcon className="w-4 h-4 text-white" />
                </button>

                <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
                    {collections.map((collection) => (
                        <button
                            key={collection.name}
                            onClick={() => onCollectionSelect(collection.name)}
                            className={`p-3 rounded-lg transition-colors ${selectedCollection === collection.name
                                ? 'bg-blue-600 border border-blue-200'
                                : 'hover:bg-blue-500 backdrop-blur-2xl'
                                }`}
                            title={collection.name}
                        >
                            <FolderIcon className="w-4 h-4 text-white" />
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-80 bg-transparent border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-300">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-semibold text-white">Root LM</h1>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onRefresh}
                            className="p-2 hover:bg-blue-600 rounded-lg transition-colors cursor-pointer"
                        >
                            <RefreshCcwIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onToggleCollapse}
                            className="p-2 hover:bg-blue-600 rounded-lg transition-colors cursor-pointer"
                            title="Collapse sidebar"
                        >
                            <SidebarIcon className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>

                <button
                    onClick={() => setShowNewCollection(!showNewCollection)}
                    className="w-full flex items-center gap-2 p-3 hover:bg-blue-500 border border-blue-200 rounded-lg transition-colors backdrop-blur-2xl cursor-pointer"
                >
                    <PlusIcon className="w-4 h-4 text-white" />
                    <span className="text-white font-medium">New Source</span>
                </button>

                {showNewCollection && (
                    <div className="mt-2 flex flex-col gap-2">
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
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-500 cursor-pointer"
                        >
                            Create
                        </button>
                    </div>
                )}
            </div>
            <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                    <h2 className="text-sm font-medium text-white mb-3">Your Sources</h2>
                    <div className="space-y-2">
                        {collections.map((collection) => (
                            <button
                                key={collection.name}
                                onClick={() => onCollectionSelect(collection.name)}
                                className={`w-full text-left p-3 rounded-lg transition-colors ${selectedCollection === collection.name
                                    ? 'bg-blue-600 border border-blue-200'
                                    : 'hover:bg-blue-500 backdrop-blur-2xl'
                                    }`}
                            >
                                <div className="flex items-start gap-3 cursor-pointer">
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
            <div className="flex flex-col p-4 items-center justify-center">
                <label className="block text-white font-medium mb-2 text-center">Data Store</label>
                <textarea
                    value={textToStore}
                    onChange={e => setTextToStore(e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2  text-white backdrop-blur-2xl placeholder-gray-300"
                    placeholder="Select a source and upload text to store..."
                    disabled={storeLoading || !selectedCollection}
                />
                <button
                    onClick={handleStoreText}
                    disabled={!textToStore.trim() || storeLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 cursor-pointer disabled:cursor-not-allowed"
                >
                    {storeLoading ? 'Storing...' : 'Submit'}
                </button>
                {storeStatus && (
                    <div className={`mt-2 text-sm ${storeStatus.includes('success') ? 'text-green-500' : 'text-red-500'}`}>{storeStatus}</div>
                )}
            </div>
        </div>
    );
}