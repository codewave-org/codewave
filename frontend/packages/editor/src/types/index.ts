import type { OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

export interface EditorConfig {
  language?: string;
  theme?: string;
  value?: string;
  readOnly?: boolean;
  minimap?: {
    enabled?: boolean;
  };
  fontSize?: number;
  tabSize?: number;
  lineNumbers?: 'on' | 'off' | 'relative';
  wordWrap?: 'on' | 'off';
  automaticLayout?: boolean;
}

export interface EditorProps extends EditorConfig {
  onChange?: (value: string | undefined) => void;
  onMount?: OnMount;
  height?: string | number;
  width?: string | number;
}

export interface EditorRef {
  getValue: () => string;
  setValue: (value: string) => void;
  getEditor: () => editor.IStandaloneCodeEditor;
}

export interface EditorTheme {
  name: string;
  data: editor.IStandaloneThemeData;
}

export interface EditorPlugin {
  id: string;
  init: (editor: editor.IStandaloneCodeEditor) => void;
  dispose?: () => void;
}
