import { useEditorStore } from '@/stores/editorStore';
import type { SupportedLanguage } from '@/types/editor';
import Editor from '@monaco-editor/react';
import { useEffect, useRef } from 'react';

interface CodeEditorProps {
  defaultLanguage?: SupportedLanguage;
  defaultValue?: string;
  height?: string | number;
}

export function CodeEditor({
  defaultLanguage = 'cpp',
  defaultValue = '',
  height = '400px',
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);
  const { language, code, setCode, setPosition, setSelection } = useEditorStore();

  useEffect(() => {
    if (defaultValue && !code) {
      setCode(defaultValue);
    }
  }, [defaultValue, code, setCode]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();

    // 监听光标位置变化
    editor.onDidChangeCursorPosition((e: any) => {
      setPosition({
        line: e.position.lineNumber,
        column: e.position.column,
      });
    });

    // 监听选择范围变化
    editor.onDidChangeCursorSelection((e: any) => {
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
  };

  const handleChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  return (
    <Editor
      height={height}
      language={language}
      value={code || defaultValue}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: 'on',
      }}
      onMount={handleEditorDidMount}
      onChange={handleChange}
    />
  );
}
