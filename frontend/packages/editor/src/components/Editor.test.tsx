import { render, screen } from '@testing-library/react';
import { Editor } from './Editor';

// Mock @monaco-editor/react
jest.mock('@monaco-editor/react', () => ({
  __esModule: true,
  Editor: ({
    language,
    value,
    options,
  }: {
    language?: string;
    value?: string;
    options?: Record<string, unknown>;
  }) => (
    <div data-testid="monaco-editor" data-language={language} data-value={value}>
      {JSON.stringify(options)}
    </div>
  ),
  OnChange: jest.fn(),
  OnMount: jest.fn(),
}));

describe('Editor', () => {
  it('renders with default props', () => {
    render(<Editor />);
    const editorElement = screen.getByTestId('monaco-editor');
    expect(editorElement).toBeInTheDocument();
  });

  it('passes correct props to Monaco Editor', () => {
    const props = {
      language: 'typescript',
      value: 'test code',
      fontSize: 16,
      readOnly: true,
    };

    render(<Editor {...props} />);
    const editorElement = screen.getByTestId('monaco-editor');

    expect(editorElement).toHaveAttribute('data-language', 'typescript');
    expect(editorElement).toHaveAttribute('data-value', 'test code');
    expect(editorElement).toHaveTextContent(/"fontSize":16/);
    expect(editorElement).toHaveTextContent(/"readOnly":true/);
  });
});
