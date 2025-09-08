'use client';

import { useState, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

import Sidebar from '@/components/Sidebar';
import ChatInterface from '@/components/ChatInterface';
import DocumentPanel from '@/components/DocumentPanel';
import Silk from '@/components/Silk';

import { Collection } from '@/types';

export default function Home() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [input, setInput] = useState('');
  const {
    messages,
    sendMessage,
    status,
    error,
    setMessages,
  } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      headers: {
        'Content-Type': 'application/json',
      },
    }),
    onError: (error) => {
      console.error('Chat error:', error);
    },
  });


  const handleCollectionSelect = (collectionName: string) => {
    setSelectedCollection(collectionName);
    if (!collections.some((c) => c.name === collectionName)) {
      setCollections([
        ...collections,
        {
          name: collectionName,
          documentCount: 0,
          lastUpdated: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleDocumentAdded = async () => {
    await fetchCollections();
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/collections');
      const data = await response.json();
      if (data.success) {
        setCollections(data.collections);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedCollection || !input.trim()) return;

    const timestamp = new Date().toISOString();

    sendMessage(
      {
        role: 'user',
        parts: [{ type: 'text', text: input }],
      },
      {
        body: {
          collection: selectedCollection,
        },
      }
    );


    setInput('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const sendSuggestedMessage = (text: string) => {
    if (!selectedCollection) return;
    sendMessage(
      {
        role: 'user',
        parts: [{ type: 'text', text }],
      },
      {
        body: {
          collection: selectedCollection,
        },
      }
    );

  };

  return (
    <div className="flex h-screen bg-transparent">
      <div className="flex-1 flex z-20">
        <Sidebar
          collections={collections}
          selectedCollection={selectedCollection}
          onCollectionSelect={handleCollectionSelect}
          onRefresh={fetchCollections}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
          onClearChat={clearChat}
        />

        <div className="flex-1 flex flex-col">
          <ChatInterface
            messages={messages}
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isLoading={status === 'submitted' || status === 'streaming'}
            selectedCollection={selectedCollection}
            error={error}
            onSendSuggestedMessage={sendSuggestedMessage}
          />
        </div>

        <DocumentPanel
          selectedCollection={selectedCollection}
          onDocumentAdded={handleDocumentAdded}
        />
      </div>
      <div className="absolute inset-0 w-full min-h-screen z-0 pointer-events-none">
        <Silk
          speed={10}
          scale={1}
          color="#8035F8"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>
    </div>
  );
}