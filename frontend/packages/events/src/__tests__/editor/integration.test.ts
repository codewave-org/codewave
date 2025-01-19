import { EventBus } from '../../bus/event-bus';
import { EditorIntegration } from '../../editor/integration';
import { Position, Selection } from '../../editor/types';
import { EventType } from '../../types/event';

describe('EditorIntegration', () => {
  let eventBus: EventBus;
  let integration: EditorIntegration;

  beforeEach(() => {
    eventBus = new EventBus();
    integration = new EditorIntegration(eventBus);
  });

  it('should handle file change events', () => {
    const mockPublish = jest.spyOn(eventBus, 'publish');
    const file = 'test.ts';
    
    integration.handleFileChange(file);
    
    expect(mockPublish).toHaveBeenCalledWith(
      expect.objectContaining({
        type: EventType.EDITOR_CHANGE,
        payload: expect.objectContaining({
          type: EventType.EDITOR_CHANGE,
          editor: expect.objectContaining({
            file
          })
        })
      })
    );
  });

  it('should handle content change events', () => {
    const mockPublish = jest.spyOn(eventBus, 'publish');
    const content = 'test content';
    const version = 1;
    
    integration.handleContentChange(content, version);
    
    expect(mockPublish).toHaveBeenCalledWith(
      expect.objectContaining({
        type: EventType.EDITOR_CHANGE,
        payload: expect.objectContaining({
          type: EventType.EDITOR_CHANGE,
          editor: expect.objectContaining({
            state: expect.objectContaining({
              content,
              version
            })
          })
        })
      })
    );
  });

  it('should handle cursor move events', () => {
    const mockPublish = jest.spyOn(eventBus, 'publish');
    const position: Position = { line: 1, column: 1 };
    
    integration.handleCursorMove(position);
    
    expect(mockPublish).toHaveBeenCalledWith(
      expect.objectContaining({
        type: EventType.EDITOR_CHANGE,
        payload: expect.objectContaining({
          type: EventType.EDITOR_CHANGE,
          editor: expect.objectContaining({
            state: expect.objectContaining({
              position
            })
          })
        })
      })
    );
  });

  it('should handle selection change events', () => {
    const mockPublish = jest.spyOn(eventBus, 'publish');
    const selection: Selection = {
      start: { line: 1, column: 1 },
      end: { line: 2, column: 1 }
    };
    
    integration.handleSelectionChange(selection);
    
    expect(mockPublish).toHaveBeenCalledWith(
      expect.objectContaining({
        type: EventType.EDITOR_CHANGE,
        payload: expect.objectContaining({
          type: EventType.EDITOR_CHANGE,
          editor: expect.objectContaining({
            state: expect.objectContaining({
              selection
            })
          })
        })
      })
    );
  });

  it('should handle language change events', () => {
    const mockPublish = jest.spyOn(eventBus, 'publish');
    const language = 'typescript';
    
    integration.handleLanguageChange(language);
    
    expect(mockPublish).toHaveBeenCalledWith(
      expect.objectContaining({
        type: EventType.EDITOR_CHANGE,
        payload: expect.objectContaining({
          type: EventType.EDITOR_CHANGE,
          editor: expect.objectContaining({
            state: expect.objectContaining({
              language
            })
          })
        })
      })
    );
  });

  it('should sync and restore editor state', () => {
    const content = 'test content';
    const version = 1;
    const position: Position = { line: 1, column: 1 };
    
    integration.handleContentChange(content, version);
    integration.handleCursorMove(position);
    
    const state = integration.syncEditorState();
    expect(state).toEqual(
      expect.objectContaining({
        content,
        version,
        position
      })
    );
    
    const newState = {
      ...state,
      content: 'new content',
      version: 2
    };
    
    integration.restoreEditorState(newState);
    const restoredState = integration.syncEditorState();
    expect(restoredState).toEqual(newState);
  });

  it('should handle errors', () => {
    const mockPublish = jest.spyOn(eventBus, 'publish');
    const error = new Error('Test error');
    
    integration.handleError(error);
    
    expect(mockPublish).toHaveBeenCalledWith(
      expect.objectContaining({
        type: EventType.EDITOR_CHANGE,
        payload: expect.objectContaining({
          type: EventType.EDITOR_CHANGE
        })
      })
    );
  });
}); 