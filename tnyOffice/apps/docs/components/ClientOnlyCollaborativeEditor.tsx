'use client';

import dynamic from 'next/dynamic';
import { CollaborativeEditorProps } from './CollaborativeEditor';

// Dynamically import CollaborativeEditor with no SSR
const CollaborativeEditor = dynamic<CollaborativeEditorProps>(
  () => import('./CollaborativeEditor').then(mod => mod.CollaborativeEditor),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500 dark:text-gray-400">Loading collaborative editor...</div>
      </div>
    )
  }
);

export { CollaborativeEditor };