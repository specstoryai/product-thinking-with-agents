'use client';

import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { DocumentList } from '@/components/DocumentList';
import { DocumentViewerWithComments } from '@/components/DocumentViewerWithComments';
import { CreateModal } from '@/components/CreateModal';

export default function Home() {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDocumentCreated = () => {
    // Trigger a refresh of the document list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <>
      <Layout
        sidebar={
          <DocumentList
            selectedId={selectedDocumentId}
            onSelect={setSelectedDocumentId}
            onCreateNew={() => setIsCreateModalOpen(true)}
            refreshTrigger={refreshTrigger}
          />
        }
      >
        <DocumentViewerWithComments documentId={selectedDocumentId} />
      </Layout>

      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={handleDocumentCreated}
      />
    </>
  );
}