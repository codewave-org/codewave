import { Editor as MonacoEditor, OnChange, OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import type { EditorProps, EditorRef } from '../types';

export const Editor = forwardRef<EditorRef, EditorProps>((props, ref) => {
  const {
    language = 'javascript',
    theme = 'vs-dark',
    value = '',
    readOnly = false,
    minimap = { enabled: false },
    fontSize = 14,
    tabSize = 2,
    lineNumbers = 'on',
    wordWrap = 'off',
    automaticLayout = true,
    onChange,
    onMount,
    height = '100%',
    width = '100%',
  } = props;

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  useImperativeHandle(ref, () => ({
    getValue: () => editorRef.current?.getValue() ?? '',
    setValue: (value: string) => editorRef.current?.setValue(value),
    getEditor: () => editorRef.current!,
  }));

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    onMount?.(editor, monaco);
  };

  const handleChange: OnChange = (value) => {
    onChange?.(value ?? '');
  };

  return (
    <MonacoEditor
      height={height}
      width={width}
      language={language}
      theme={theme}
      value={value}
      options={{
        readOnly,
        minimap,
        fontSize,
        tabSize,
        lineNumbers,
        wordWrap,
        automaticLayout,
      }}
      onChange={handleChange}
      onMount={handleEditorDidMount}
    />
  );
});

Editor.displayName = 'Editor';
