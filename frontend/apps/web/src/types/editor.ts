export interface Position {
  line: number;
  column: number;
}

export interface Selection {
  start: Position;
  end: Position;
}

export interface EditorState {
  language: string;
  code: string;
  position?: Position;
  selection?: Selection;
}

export type SupportedLanguage = 'cpp' | 'python' | 'javascript' | 'typescript' | 'java';
