'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatInterface from '@/components/ChatInterface';
import DocumentPanel from '@/components/DocumentPanel';
import { Collection, ChatMessage } from '@/types';
import Silk from '@/components/Silk';

export default function Home() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

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

  const sendMessage = async (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          collection: selectedCollection
        })
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          role: 'assistant',
          timestamp: new Date(),
          sources: data.sources
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
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
          onClearChat={() => setMessages([])}
        />

        <div className="flex-1 flex flex-col">
          <ChatInterface
            messages={messages}
            onSendMessage={sendMessage}
            loading={loading}
            selectedCollection={selectedCollection}
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