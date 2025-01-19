import { v4 as uuidv4 } from 'uuid';
import { EventBus } from '../bus/event-bus';
import { EventPriority, EventType, IPartialEvent } from '../types/event';
import {
  EditorEventType,
  EditorState,
  EditorStateChanges,
  IEditorEvent,
  IEditorIntegration,
  Position,
  Selection,
} from './types';

export class EditorIntegration implements IEditorIntegration {
  private readonly id: string;
  private state: EditorState;
  private readonly eventBus: EventBus;

  constructor(eventBus: EventBus) {
    this.id = uuidv4();
    this.eventBus = eventBus;
    this.state = {
      id: this.id,
      file: '',
      content: '',
      position: { line: 0, column: 0 },
      version: 0,
    };
  }

  private emitEditorEvent(type: EditorEventType, changes?: EditorStateChanges) {
    const editorEvent: IEditorEvent = {
      type: EventType.EDITOR_CHANGE,
      timestamp: Date.now(),
      priority: EventPriority.NORMAL,
      editor: {
        id: this.id,
        file: this.state.file,
        state: { ...this.state },
        changes,
      },
    };

    const event: IPartialEvent<IEditorEvent> = {
      id: uuidv4(),
      type: EventType.EDITOR_CHANGE,
      priority: EventPriority.NORMAL,
      payload: editorEvent,
    };

    this.eventBus.publish(event);
  }

  handleFileChange(file: string): void {
    this.state.file = file;
    this.emitEditorEvent(EditorEventType.FILE_CHANGE);
  }

  handleContentChange(content: string, version: number): void {
    this.state.content = content;
    this.state.version = version;
    this.emitEditorEvent(EditorEventType.CONTENT_CHANGE, { content });
  }

  handleCursorMove(position: Position): void {
    this.state.position = position;
    this.emitEditorEvent(EditorEventType.CURSOR_MOVE, { position });
  }

  handleSelectionChange(selection: Selection): void {
    this.state.selection = selection;
    this.emitEditorEvent(EditorEventType.SELECTION_CHANGE, { selection });
  }

  handleLanguageChange(language: string): void {
    this.state.language = language;
    this.emitEditorEvent(EditorEventType.LANGUAGE_CHANGE, { language });
  }

  syncEditorState(): EditorState {
    return { ...this.state };
  }

  restoreEditorState(state: EditorState): void {
    this.state = { ...state };
  }

  handleError(_error: Error): void {
    this.emitEditorEvent(EditorEventType.ERROR);
    // 可以在这里添加更多错误处理逻辑
  }
}
