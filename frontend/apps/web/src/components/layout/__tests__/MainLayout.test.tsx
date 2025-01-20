import { usePanels } from '@/hooks/usePanels';
import { fireEvent, render, screen } from '@testing-library/react';
import Split from 'split.js';
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MainLayout } from '../MainLayout';

vi.mock('split.js');
vi.mock('@/hooks/usePanels');

const mockDestroy = vi.fn();
const mockSplit = vi.fn(() => ({
  destroy: mockDestroy,
}));

(Split as unknown as Mock).mockImplementation(mockSplit);

describe('MainLayout', () => {
  const mockTogglePanel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (usePanels as unknown as Mock).mockReturnValue({
      activePanel: { left: null, right: null },
      togglePanel: mockTogglePanel,
    });
  });

  it('renders without crashing', () => {
    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );
    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
  });

  it('renders sidebar buttons', () => {
    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );

    // 检查左侧按钮
    expect(screen.getByText('Q')).toBeInTheDocument();
    expect(screen.getByText('H')).toBeInTheDocument();
    expect(screen.getByText('T')).toBeInTheDocument();

    // 检查右侧按钮
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('P')).toBeInTheDocument();
    expect(screen.getByText('W')).toBeInTheDocument();
  });

  it('calls togglePanel when sidebar buttons are clicked', () => {
    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );

    // 测试左侧按钮点击
    fireEvent.click(screen.getByText('Q'));
    expect(mockTogglePanel).toHaveBeenCalledWith('left', 'questions');

    fireEvent.click(screen.getByText('H'));
    expect(mockTogglePanel).toHaveBeenCalledWith('left', 'hints');

    // 测试右侧按钮点击
    fireEvent.click(screen.getByText('C'));
    expect(mockTogglePanel).toHaveBeenCalledWith('right', 'chat');

    fireEvent.click(screen.getByText('P'));
    expect(mockTogglePanel).toHaveBeenCalledWith('right', 'progress');
  });

  it('shows left panel when active', () => {
    (usePanels as unknown as Mock).mockReturnValue({
      activePanel: { left: 'questions', right: null },
      togglePanel: mockTogglePanel,
    });

    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );

    const leftPanel = screen.getByTestId('left-panel');
    expect(leftPanel).not.toHaveClass('hidden');
    expect(mockSplit).toHaveBeenCalled();
  });

  it('shows right panel when active', () => {
    (usePanels as unknown as Mock).mockReturnValue({
      activePanel: { left: null, right: 'chat' },
      togglePanel: mockTogglePanel,
    });

    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );

    const rightPanel = screen.getByTestId('right-panel');
    expect(rightPanel).not.toHaveClass('hidden');
    expect(mockSplit).toHaveBeenCalled();
  });

  it('handles panel visibility correctly', () => {
    (usePanels as unknown as Mock).mockReturnValue({
      activePanel: { left: 'questions', right: null },
      togglePanel: mockTogglePanel,
    });

    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );

    const leftPanel = screen.getByTestId('left-panel');
    const rightPanel = screen.getByTestId('right-panel');
    expect(leftPanel).not.toHaveClass('hidden');
    expect(rightPanel).toHaveClass('hidden');
  });

  it('initializes Split.js with correct configuration when panels are opened', () => {
    (usePanels as unknown as Mock).mockReturnValue({
      activePanel: { left: 'questions', right: null },
      togglePanel: mockTogglePanel,
    });

    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );

    expect(mockSplit).toHaveBeenCalledWith(
      expect.any(Array),
      expect.objectContaining({
        sizes: [25, 75],
        minSize: [200, 400],
        gutterSize: 4,
        direction: 'horizontal',
      })
    );
  });

  it('cleans up Split.js instance on unmount', () => {
    (usePanels as unknown as Mock).mockReturnValue({
      activePanel: { left: 'questions', right: null },
      togglePanel: mockTogglePanel,
    });

    const { unmount } = render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );

    expect(mockSplit).toHaveBeenCalled();
    unmount();
    expect(mockDestroy).toHaveBeenCalled();
  });
});
