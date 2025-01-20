'use client';

import { Hints } from '@/components/panels/LeftPanels/Hints';
import { Questions } from '@/components/panels/LeftPanels/Questions';
import { TestRun } from '@/components/panels/LeftPanels/TestRun';
import { Chat } from '@/components/panels/RightPanels/Chat';
import { Progress } from '@/components/panels/RightPanels/Progress';
import { Warnings } from '@/components/panels/RightPanels/Warnings';
import { usePanels } from '@/hooks/usePanels';
import { ReactNode, useEffect, useRef } from 'react';
import Split from 'split.js';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { activePanel, togglePanel } = usePanels();
  const splitInstance = useRef<Split.Instance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 初始化或更新 Split.js
  useEffect(() => {
    if (!containerRef.current) return;

    // 清理现有实例
    if (splitInstance.current) {
      splitInstance.current.destroy();
      splitInstance.current = null;
    }

    const elements = containerRef.current.querySelectorAll<HTMLDivElement>('.split-panel');
    const visibleElements = Array.from(elements).filter(
      (el: HTMLDivElement) => !el.classList.contains('hidden')
    );

    if (visibleElements.length > 1) {
      const sizes =
        visibleElements.length === 3
          ? [20, 60, 20]
          : activePanel.left
            ? [25, 75] // 左侧面板打开
            : [75, 25]; // 右侧面板打开

      const minSizes =
        visibleElements.length === 3
          ? [200, 400, 200]
          : activePanel.left
            ? [200, 400] // 左侧面板打开
            : [400, 200]; // 右侧面板打开

      splitInstance.current = Split(visibleElements, {
        sizes,
        minSize: minSizes,
        gutterSize: 4,
        snapOffset: 0,
        direction: 'horizontal',
        cursor: 'col-resize',
      });
    }

    return () => {
      if (splitInstance.current) {
        splitInstance.current.destroy();
        splitInstance.current = null;
      }
    };
  }, [activePanel.left, activePanel.right]);

  return (
    <div className="flex h-screen bg-gray-900" data-testid="main-layout">
      {/* Left Sidebar */}
      <div className="flex-none w-12 bg-gray-800 flex flex-col space-y-4 p-2">
        <button
          onClick={() => togglePanel('left', 'questions')}
          className={`p-2 rounded ${
            activePanel.left === 'questions' ? 'bg-blue-500' : 'hover:bg-gray-700'
          }`}
          aria-label="Toggle Questions"
        >
          Q
        </button>
        <button
          onClick={() => togglePanel('left', 'hints')}
          className={`p-2 rounded ${
            activePanel.left === 'hints' ? 'bg-blue-500' : 'hover:bg-gray-700'
          }`}
          aria-label="Toggle Hints"
        >
          H
        </button>
        <button
          onClick={() => togglePanel('left', 'testrun')}
          className={`p-2 rounded ${
            activePanel.left === 'testrun' ? 'bg-blue-500' : 'hover:bg-gray-700'
          }`}
          aria-label="Toggle TestRun"
        >
          T
        </button>
      </div>

      {/* Main Container */}
      <div ref={containerRef} className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div
          className={`split-panel bg-gray-900 overflow-auto ${!activePanel.left ? 'hidden' : ''}`}
          data-testid="left-panel"
        >
          {activePanel.left === 'questions' && <Questions isOpen={true} />}
          {activePanel.left === 'hints' && <Hints isOpen={true} />}
          {activePanel.left === 'testrun' && <TestRun isOpen={true} />}
        </div>

        {/* Main Content */}
        <div
          className="split-panel bg-gray-900 overflow-auto flex-1 min-w-[400px]"
          data-testid="main-content"
        >
          <div className="h-full w-full">{children}</div>
        </div>

        {/* Right Panel */}
        <div
          className={`split-panel bg-gray-900 overflow-auto ${!activePanel.right ? 'hidden' : ''}`}
          data-testid="right-panel"
        >
          {activePanel.right === 'chat' && <Chat isOpen={true} />}
          {activePanel.right === 'progress' && <Progress isOpen={true} />}
          {activePanel.right === 'warnings' && <Warnings isOpen={true} />}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="flex-none w-12 bg-gray-800 flex flex-col space-y-4 p-2">
        <button
          onClick={() => togglePanel('right', 'chat')}
          className={`p-2 rounded ${
            activePanel.right === 'chat' ? 'bg-blue-500' : 'hover:bg-gray-700'
          }`}
          aria-label="Toggle Chat"
        >
          C
        </button>
        <button
          onClick={() => togglePanel('right', 'progress')}
          className={`p-2 rounded ${
            activePanel.right === 'progress' ? 'bg-blue-500' : 'hover:bg-gray-700'
          }`}
          aria-label="Toggle Progress"
        >
          P
        </button>
        <button
          onClick={() => togglePanel('right', 'warnings')}
          className={`p-2 rounded ${
            activePanel.right === 'warnings' ? 'bg-blue-500' : 'hover:bg-gray-700'
          }`}
          aria-label="Toggle Warnings"
        >
          W
        </button>
      </div>
    </div>
  );
}
