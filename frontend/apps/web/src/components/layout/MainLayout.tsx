'use client';

import { Hints } from '@/components/panels/LeftPanels/Hints';
import { Questions } from '@/components/panels/LeftPanels/Questions';
import { TestRun } from '@/components/panels/LeftPanels/TestRun';
import { Chat } from '@/components/panels/RightPanels/Chat';
import { Progress } from '@/components/panels/RightPanels/Progress';
import { Warnings } from '@/components/panels/RightPanels/Warnings';
import { useHotkeys } from '@/hooks/useHotkeys';
import { usePanelSize } from '@/hooks/usePanelSize';
import { usePanels } from '@/hooks/usePanels';
import { useResponsive } from '@/hooks/useResponsive';
import { useSplitPanel } from '@/hooks/useSplitPanel';
import { ReactNode, useCallback, useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { activePanel, togglePanel, closePanel } = usePanels();
  const containerRef = useRef<HTMLDivElement>(null);
  const { updateLeftPanelSize, updateRightPanelSize } = usePanelSize();
  const { isMobile, getPanelConfig } = useResponsive();

  // 处理左侧面板大小变化
  const handleLeftPanelDragEnd = useCallback(
    (newSizes: number[]) => {
      updateLeftPanelSize(newSizes);
    },
    [updateLeftPanelSize]
  );

  // 处理右侧面板大小变化
  const handleRightPanelDragEnd = useCallback(
    (newSizes: number[]) => {
      updateRightPanelSize(newSizes);
    },
    [updateRightPanelSize]
  );

  // 获取左侧面板配置
  const leftPanelConfig = getPanelConfig('left');
  const rightPanelConfig = getPanelConfig('right');

  // 初始化左侧分割面板
  const { reinitialize: reinitializeLeft } = useSplitPanel(containerRef, {
    sizes: leftPanelConfig.sizes,
    minSizes: leftPanelConfig.minSizes,
    gutterSize: 4,
    snapOffset: 0,
    direction: 'horizontal',
    cursor: 'col-resize',
    onDragEnd: handleLeftPanelDragEnd,
  });

  // 初始化右侧分割面板
  const { reinitialize: reinitializeRight } = useSplitPanel(containerRef, {
    sizes: rightPanelConfig.sizes,
    minSizes: rightPanelConfig.minSizes,
    gutterSize: 4,
    snapOffset: 0,
    direction: 'horizontal',
    cursor: 'col-resize',
    onDragEnd: handleRightPanelDragEnd,
  });

  // 当面板状态变化时重新初始化
  useEffect(() => {
    reinitializeLeft();
    reinitializeRight();
  }, [activePanel.left, activePanel.right, reinitializeLeft, reinitializeRight]);

  // 注册快捷键
  const { shortcuts } = useHotkeys({
    onTogglePanel: togglePanel,
    onClosePanel: closePanel,
  });

  return (
    <div className="flex h-screen bg-gray-900" data-testid="main-layout">
      {/* Left Sidebar */}
      <div
        className={twMerge(
          'flex-none bg-gray-800 flex flex-col space-y-4 p-2',
          isMobile ? 'w-full fixed bottom-0 h-12 flex-row space-y-0 space-x-4 z-50' : 'w-12'
        )}
      >
        <button
          onClick={() => togglePanel('left', 'questions')}
          className={`p-2 rounded ${
            activePanel.left === 'questions' ? 'bg-blue-500' : 'hover:bg-gray-700'
          }`}
          aria-label="Toggle Questions"
          title={`问题面板 (${shortcuts.find((s) => s.description === '切换问题面板')?.key})`}
        >
          Q
        </button>
        <button
          onClick={() => togglePanel('left', 'hints')}
          className={`p-2 rounded ${
            activePanel.left === 'hints' ? 'bg-blue-500' : 'hover:bg-gray-700'
          }`}
          aria-label="Toggle Hints"
          title={`提示面板 (${shortcuts.find((s) => s.description === '切换提示面板')?.key})`}
        >
          H
        </button>
        <button
          onClick={() => togglePanel('left', 'testrun')}
          className={`p-2 rounded ${
            activePanel.left === 'testrun' ? 'bg-blue-500' : 'hover:bg-gray-700'
          }`}
          aria-label="Toggle TestRun"
          title={`测试面板 (${shortcuts.find((s) => s.description === '切换测试面板')?.key})`}
        >
          T
        </button>
      </div>

      {/* Main Container */}
      <div ref={containerRef} className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div
          className={twMerge(
            'split-panel bg-gray-900 overflow-auto',
            !activePanel.left && 'hidden',
            isMobile &&
              activePanel.left &&
              'fixed inset-0 z-40 w-full h-[calc(100vh-3rem)] transition-transform duration-300 ease-in-out'
          )}
          data-testid="left-panel"
        >
          {activePanel.left === 'questions' && <Questions isOpen={true} />}
          {activePanel.left === 'hints' && <Hints isOpen={true} />}
          {activePanel.left === 'testrun' && <TestRun isOpen={true} />}
        </div>

        {/* Main Content */}
        <div
          className={twMerge(
            'split-panel bg-gray-900 overflow-auto flex-1',
            isMobile ? 'min-w-full' : 'min-w-[400px]'
          )}
          data-testid="main-content"
        >
          <div className="h-full w-full">{children}</div>
        </div>

        {/* Right Panel */}
        <div
          className={twMerge(
            'split-panel bg-gray-900 overflow-auto',
            !activePanel.right && 'hidden',
            isMobile &&
              activePanel.right &&
              'fixed inset-0 z-40 w-full h-[calc(100vh-3rem)] transition-transform duration-300 ease-in-out'
          )}
          data-testid="right-panel"
        >
          {activePanel.right === 'chat' && <Chat isOpen={true} />}
          {activePanel.right === 'progress' && <Progress isOpen={true} />}
          {activePanel.right === 'warnings' && <Warnings isOpen={true} />}
        </div>
      </div>

      {/* Right Sidebar */}
      <div
        className={twMerge(
          'flex-none bg-gray-800 flex flex-col space-y-4 p-2',
          isMobile ? 'w-full fixed bottom-0 h-12 flex-row space-y-0 space-x-4 z-50' : 'w-12'
        )}
      >
        <button
          onClick={() => togglePanel('right', 'chat')}
          className={`p-2 rounded ${
            activePanel.right === 'chat' ? 'bg-blue-500' : 'hover:bg-gray-700'
          }`}
          aria-label="Toggle Chat"
          title={`聊天面板 (${shortcuts.find((s) => s.description === '切换聊天面板')?.key})`}
        >
          C
        </button>
        <button
          onClick={() => togglePanel('right', 'progress')}
          className={`p-2 rounded ${
            activePanel.right === 'progress' ? 'bg-blue-500' : 'hover:bg-gray-700'
          }`}
          aria-label="Toggle Progress"
          title={`进度面板 (${shortcuts.find((s) => s.description === '切换进度面板')?.key})`}
        >
          P
        </button>
        <button
          onClick={() => togglePanel('right', 'warnings')}
          className={`p-2 rounded ${
            activePanel.right === 'warnings' ? 'bg-blue-500' : 'hover:bg-gray-700'
          }`}
          aria-label="Toggle Warnings"
          title={`警告面板 (${shortcuts.find((s) => s.description === '切换警告面板')?.key})`}
        >
          W
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobile && (activePanel.left || activePanel.right) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => {
            closePanel('left');
            closePanel('right');
          }}
        />
      )}
    </div>
  );
}
