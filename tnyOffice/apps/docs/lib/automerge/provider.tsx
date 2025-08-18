'use client';

import { useEffect, useState } from 'react';
import { RepoContext } from '@automerge/automerge-repo-react-hooks';
import type { Repo } from '@automerge/automerge-repo';
import { getAuthenticatedWebSocketUrl } from '../api/client';

interface AutomergeProviderProps {
  children: React.ReactNode;
}

export function AutomergeProvider({ children }: AutomergeProviderProps) {
  const [repo, setRepo] = useState<Repo | null>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    const initRepo = async () => {
      const { Repo } = await import('@automerge/automerge-repo');
      const { BrowserWebSocketClientAdapter } = await import('@automerge/automerge-repo-network-websocket');
      
      // Get authenticated WebSocket URL
      const wsUrl = getAuthenticatedWebSocketUrl('/automerge-sync');
      
      const newRepo = new Repo({
        network: [
          new BrowserWebSocketClientAdapter(wsUrl)
        ],
        // For now, we'll rely on the server for persistence
        storage: undefined,
      });

      setRepo(newRepo);
    };

    initRepo();
  }, []);

  if (!repo) {
    return <>{children}</>;
  }

  return (
    <RepoContext.Provider value={repo}>
      {children}
    </RepoContext.Provider>
  );
}