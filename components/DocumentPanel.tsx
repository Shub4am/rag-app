'use client';

import { useState } from 'react';
import { UploadIcon, LinkIcon, FileTextIcon, GlobeIcon } from 'lucide-react';

interface DocumentPanelProps {
    selectedCollection: string;
    onDocumentAdded: () => void;
}

export default function DocumentPanel({
    selectedCollection,
    onDocumentAdded
}: DocumentPanelProps) {
    const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
    const [uploading, setUploading] = useState(false);
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState('');

    const handleFileUpload = async (file: File) => {
        setUploading(true);
        setStatus('');

        const formData = new FormData();
        formData.append('collection', selectedCollection);

        try {
            let endpoint = '';
            if (file.type === 'application/pdf') {
                formData.append('pdf', file);
                endpoint = '/api/index/pdf';
            } else if (file.type === 'text/csv') {
                formData.append('csv', file);
                endpoint = '/api/index/csv';
            } else {
                setStatus('Unsupported file type. Please upload PDF or CSV files.');
                return;
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setStatus(`✅ ${data.message}`);
                onDocumentAdded();
            } else {
                setStatus(`❌ ${data.error}`);
            }
        } catch (error) {
            setStatus(`❌ Upload failed: ${(error as Error).message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleUrlIndex = async () => {
        if (!url.trim()) return;

        setUploading(true);
        setStatus('');

        try {
            const response = await fetch('/api/index/url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: url.trim(),
                    collection: selectedCollection
                })
            });

            const data = await response.json();

            if (data.success) {
                setStatus(`✅ ${data.message}`);
                setUrl('');
                onDocumentAdded();
            } else {
                setStatus(`❌ ${data.error}`);
            }
        } catch (error) {
            setStatus(`❌ Failed to index URL: ${(error as Error).message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files[0]) {
            handleFileUpload(files[0]);
        }
    };

    return (
        <div className="w-80 bg-zinc-900 border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Add Sources
                </h3>

                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'upload'
                            ? 'bg-zinc-900 text-white shadow-sm'
                            : 'text-gray-600 hover:text-blue-600'
                            }`}
                    >
                        <UploadIcon className="w-4 h-4" />
                        Upload
                    </button>
                    <button
                        onClick={() => setActiveTab('url')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'url'
                            ? 'bg-zinc-900 text-white shadow-sm'
                            : 'text-gray-600 hover:text-blue-600'
                            }`}
                    >
                        <LinkIcon className="w-4 h-4" />
                        URL
                    </button>
                </div>
            </div>

            <div className="flex-1 p-4">
                {activeTab === 'upload' && (
                    <div>
                        <div
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                            onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = '.pdf,.csv';
                                input.onchange = (e) => {
                                    const file = (e.target as HTMLInputElement).files?.[0];
                                    if (file) handleFileUpload(file);
                                };
                                input.click();
                            }}
                        >
                            <FileTextIcon className="w-12 h-12 text-white mx-auto mb-4" />
                            <p className="text-white mb-2">
                                Drop files here or click to upload
                            </p>
                            <p className="text-xs text-gray-500">
                                PDF and CSV files supported
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === 'url' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Website URL
                            </label>
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={handleUrlIndex}
                            disabled={!url.trim() || uploading}
                            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:cursor-not-allowed"
                        >
                            <GlobeIcon className="w-4 h-4" />
                            {uploading ? 'Indexing...' : 'Index URL'}
                        </button>
                    </div>
                )}

                {status && (
                    <div className={`mt-4 p-3 rounded-lg text-sm ${status.startsWith('✅')
                        ? 'bg-green-50 text-green-800'
                        : 'bg-red-50 text-red-800'
                        }`}>
                        {status}
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                    Collection: <span className="font-medium">{selectedCollection}</span>
                </div>
            </div>
        </div>
    );
}