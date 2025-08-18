'use client';

import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { EditorView } from '@codemirror/view';

interface EditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}

export function Editor({ value, onChange, readOnly = false, placeholder }: EditorProps) {
  const extensions = [
    markdown(),
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

  return (
    <CodeMirror
      value={value}
      onChange={(val) => onChange?.(val)}
      extensions={extensions}
      placeholder={placeholder}
      theme={undefined} // Uses system theme
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
    />
  );
}