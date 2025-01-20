import { useEditorStore } from '@/stores/editorStore';
import { Editor } from '@codewave/editor';
import type { editor } from 'monaco-editor';
import { useCallback } from 'react';

interface CodeEditorProps {
  defaultValue?: string;
  height?: string | number;
}

export function CodeEditor({ defaultValue = '', height = '100%' }: CodeEditorProps) {
  const { language, code, setCode, setPosition, setSelection } = useEditorStore();

  const handleEditorMount = useCallback(
    (editor: editor.IStandaloneCodeEditor) => {
      editor.focus();

      editor.onDidChangeCursorPosition((e) => {
        setPosition({
          line: e.position.lineNumber,
          column: e.position.column,
        });
      });

      editor.onDidChangeCursorSelection((e) => {
        setSelection({
          start: {
            line: e.selection.startLineNumber,
            column: e.selection.startColumn,
          },
          end: {
            line: e.selection.endLineNumber,
            column: e.selection.endColumn,
          },
        });
      });
    },
    [setPosition, setSelection]
  );

  const handleChange = useCallback(
    (value: string | undefined) => {
      if (value !== undefined) {
        setCode(value);
      }
    },
    [setCode]
  );

  return (
    <Editor
      height={height}
      language={language}
      value={code || defaultValue}
      theme="vs-dark"
      minimap={{ enabled: false }}
      fontSize={14}
      lineNumbers="on"
      wordWrap="on"
      tabSize={2}
      automaticLayout={true}
      onMount={handleEditorMount}
      onChange={handleChange}
    />
  );
}
