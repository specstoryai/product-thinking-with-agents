'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { EditorView, keymap } from '@codemirror/view';
import { automergeSyncPlugin } from '@automerge/automerge-codemirror';
import { useRepo } from '@automerge/automerge-repo-react-hooks';
import type { MarkdownDocument } from '@/lib/automerge/types';
import type { AutomergeUrl, DocHandle } from '@automerge/automerge-repo';
import { commentsField, commentDecorations, commentTheme, updateComments, updateActiveComment } from '@/lib/codemirror/comments-extension';
import { Comment } from '@/lib/types/comment';

export interface CollaborativeEditorProps {
  documentUrl: string;
  readOnly?: boolean;
  placeholder?: string;
  onConnectionChange?: (connected: boolean) => void;
  onContentChange?: (content: string) => void;
  onAddComment?: (selection: { from: number; to: number; text: string }) => void;
  comments?: Comment[];
  activeCommentId?: string | null;
  showComments?: boolean;
  onCommentClick?: (position: number) => void;
  editorRef?: React.MutableRefObject<EditorView | null>;
}

export function CollaborativeEditor({ 
  documentUrl, 
  readOnly = false, 
  placeholder,
  onConnectionChange,
  onContentChange,
  onAddComment,
  comments = [],
  activeCommentId,
  showComments = true,
  onCommentClick,
  editorRef
}: CollaborativeEditorProps) {
  const repo = useRepo();
  const [handle, setHandle] = useState<DocHandle<MarkdownDocument> | null>(null);
  const [initialContent, setInitialContent] = useState<string>('');
  const [isReady, setIsReady] = useState(false);
  const editorViewRef = useRef<EditorView | null>(null);

  // Get handle from repo
  useEffect(() => {
    if (!repo || !documentUrl) return;

    const loadDocument = async () => {
      try {
        console.log('Finding document with URL:', documentUrl);
        // repo.find() returns a Promise<DocHandle>
        const docHandle = await repo.find<MarkdownDocument>(documentUrl as AutomergeUrl);
        console.log('Got handle:', docHandle);
        
        setHandle(docHandle);

        // Wait for the handle to be ready
        const waitForReady = () => {
          try {
            // Check if handle has the isReady method and if it's ready
            if (docHandle.isReady && !docHandle.isReady()) {
              console.log('Handle not ready yet, waiting...');
              setTimeout(waitForReady, 100);
              return;
            }

            // Now we can safely call doc()
            const currentDoc = docHandle.doc();
            console.log('Got document:', currentDoc);
            
            if (currentDoc) {
              // Initialize content if needed
              if (currentDoc.content === undefined) {
                docHandle.change((d) => {
                  d.content = '';
                });
              }
              
              // Get the document again after potential change
              const doc = docHandle.doc();
              setInitialContent(doc?.content || '');
              setIsReady(true);
              onConnectionChange?.(true);
            }
          } catch (err) {
            console.error('Error loading document:', err);
            onConnectionChange?.(false);
          }
        };

        waitForReady();
      } catch (err) {
        console.error('Error finding document:', err);
        onConnectionChange?.(false);
      }
    };

    loadDocument();

  }, [repo, documentUrl, onConnectionChange]);

  // Listen for changes on the handle
  useEffect(() => {
    if (!handle || !isReady) return;

    const handleChange = () => {
      try {
        const currentDoc = handle.doc();
        if (currentDoc) {
          onContentChange?.(currentDoc.content || '');
        }
      } catch (err) {
        console.error('Error handling change:', err);
      }
    };

    handle.on('change', handleChange);

    return () => {
      handle.off('change', handleChange);
    };
  }, [handle, isReady, onContentChange]);

  // Update comments in editor when they change or visibility changes
  useEffect(() => {
    if (editorViewRef.current) {
      // Pass empty array if comments should be hidden
      updateComments(editorViewRef.current, showComments ? comments : []);
    }
  }, [comments, showComments]);

  // Update active comment in editor
  useEffect(() => {
    if (editorViewRef.current) {
      updateActiveComment(editorViewRef.current, activeCommentId || null);
    }
  }, [activeCommentId]);

  // Handle comment keyboard shortcut
  const handleAddComment = useCallback(() => {
    if (!editorViewRef.current || !onAddComment) return false;
    
    const state = editorViewRef.current.state;
    const selection = state.selection.main;
    
    if (selection.from === selection.to) {
      // No selection
      return false;
    }
    
    const selectedText = state.doc.sliceString(selection.from, selection.to);
    onAddComment({
      from: selection.from,
      to: selection.to,
      text: selectedText
    });
    
    return true;
  }, [onAddComment]);

  // Handle click on commented text
  const handleCommentClick = useCallback((event: MouseEvent) => {
    if (!editorViewRef.current || !onCommentClick) return;
    
    const pos = editorViewRef.current.posAtCoords({ x: event.clientX, y: event.clientY });
    if (pos !== null) {
      // Check if click is on a comment
      const target = event.target as HTMLElement;
      if (target.classList.contains('cm-comment-highlight')) {
        onCommentClick(pos);
      }
    }
  }, [onCommentClick]);

  if (!handle || !isReady) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500 dark:text-gray-400">Connecting to document...</div>
      </div>
    );
  }

  const syncPlugin = automergeSyncPlugin({
    handle,
    path: ['content'],
  });

  const extensions = [
    markdown(),
    syncPlugin,
    commentsField,
    commentDecorations,
    commentTheme,
    keymap.of([
      {
        key: 'Mod-k',
        run: handleAddComment,
      }
    ]),
    EditorView.domEventHandlers({
      click: handleCommentClick,
    }),
    EditorView.theme({
      '&': {
        fontSize: '14px',
        height: '100%',
      },
      '.cm-scroller': {
        overflow: 'auto',
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
      },
      '.cm-content': {
        padding: '16px',
        minHeight: '100%',
      },
      '.cm-focused .cm-cursor': {
        borderLeftColor: '#3b82f6',
      },
      '.cm-line': {
        padding: '0 2px 0 4px',
      },
    }),
    EditorView.lineWrapping,
  ];

  if (readOnly) {
    extensions.push(EditorView.editable.of(false));
  }

  // Provide initial value to CodeMirror
  return (
    <CodeMirror
      value={initialContent}
      extensions={extensions}
      placeholder={placeholder}
      theme={undefined} // Uses system theme
      editable={!readOnly}
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        dropCursor: !readOnly,
        allowMultipleSelections: !readOnly,
        indentOnInput: !readOnly,
        bracketMatching: true,
        closeBrackets: !readOnly,
        autocompletion: !readOnly,
        rectangularSelection: !readOnly,
        highlightSelectionMatches: true,
        searchKeymap: true,
      }}
      style={{ height: '100%' }}
      onCreateEditor={(view) => {
        editorViewRef.current = view;
        if (editorRef) {
          editorRef.current = view;
        }
      }}
    />
  );
}