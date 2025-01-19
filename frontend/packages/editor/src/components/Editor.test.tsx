import { render, screen } from '@testing-library/react';
import type { editor } from 'monaco-editor';
import { Editor } from './Editor';

// Mock Monaco Editor
jest.mock('@monaco-editor/react', () => {
  return function MockMonacoEditor(props: Partial<editor.IStandaloneEditorConstructionOptions>) {
    return <div data-testid="monaco-editor" {...props} />;
  };
});

describe('Editor', () => {
  it('renders with default props', () => {
    render(<Editor />);
    const editorElement = screen.getByTestId('monaco-editor');
    expect(editorElement).toBeInTheDocument();
  });

  it('passes correct props to Monaco Editor', () => {
    const props = {
      language: 'typescript',
      theme: 'vs-light',
      value: 'test code',
      height: '500px',
      width: '800px',
    };

    render(<Editor {...props} />);
    const editorElement = screen.getByTestId('monaco-editor');

    expect(editorElement).toHaveAttribute('language', 'typescript');
    expect(editorElement).toHaveAttribute('theme', 'vs-light');
    expect(editorElement).toHaveAttribute('value', 'test code');
    expect(editorElement).toHaveAttribute('height', '500px');
    expect(editorElement).toHaveAttribute('width', '800px');
  });
});
