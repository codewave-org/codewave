import { EventPriority, EventType } from '../types/event';

export interface Position {
  line: number;
  column: number;
}

export interface Selection {
  start: Position;
  end: Position;
}

export interface EditorState {
  id: string;
  file: string;
  content: string;
  position: Position;
  selection?: Selection;
  language?: string;
  version: number;
}

export interface EditorStateChanges {
  position?: Position;
  selection?: Selection;
  content?: string;
  language?: string;
}

export interface IEditorEvent {
  type: EventType;
  timestamp: number;
  priority: EventPriority;
  editor: {
    id: string;
    file: string;
    state: EditorState;
    changes?: EditorStateChanges;
  };
}

export enum EditorEventType {
  FILE_CHANGE = 'editor.file.change',
  CONTENT_CHANGE = 'editor.content.change',
  CURSOR_MOVE = 'editor.cursor.move',
  SELECTION_CHANGE = 'editor.selection.change',
  LANGUAGE_CHANGE = 'editor.language.change',
  ERROR = 'editor.error',
}

export interface IEditorIntegration {
  // 编辑器事件处理
  handleFileChange(file: string): void;
  handleContentChange(content: string, version: number): void;
  handleCursorMove(position: Position): void;
  handleSelectionChange(selection: Selection): void;
  handleLanguageChange(language: string): void;

  // 状态同步
  syncEditorState(): EditorState;
  restoreEditorState(state: EditorState): void;

  // 错误处理
  handleError(error: Error): void;
}
