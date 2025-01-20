'use client';

import { Hints } from '@/components/panels/LeftPanels/Hints';
import { Questions } from '@/components/panels/LeftPanels/Questions';
import { TestRun } from '@/components/panels/LeftPanels/TestRun';
import { Chat } from '@/components/panels/RightPanels/Chat';
import { Progress } from '@/components/panels/RightPanels/Progress';
import { Warnings } from '@/components/panels/RightPanels/Warnings';
import { usePanels } from '@/hooks/usePanels';
import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { activePanel, togglePanel } = usePanels();

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-12 bg-gray-800 flex flex-col space-y-4 p-2">
        <button
          onClick={() => togglePanel('left', 'questions')}
          className={`p-2 rounded ${
            activePanel.left === 'questions' ? 'bg-blue-500' : 'hover:bg-gray-700'
          }`}
        >
          Q
        </button>
        <button
          onClick={() => togglePanel('left', 'hints')}
          className={`p-2 rounded ${
            activePanel.left === 'hints' ? 'bg-blue-500' : 'hover:bg-gray-700'
          }`}
        >
          H
        </button>
        <button
          onClick={() => togglePanel('left', 'testrun')}
          className={`p-2 rounded ${
            activePanel.left === 'testrun' ? 'bg-blue-500' : 'hover:bg-gray-700'
          }`}
        >
          T
        </button>
      </div>

      {/* Left Panel */}
      <div className={`w-80 bg-gray-900 ${activePanel.left ? '' : 'hidden'}`}>
        {activePanel.left === 'questions' && <Questions isOpen={true} />}
        {activePanel.left === 'hints' && <Hints isOpen={true} />}
        {activePanel.left === 'testrun' && <TestRun isOpen={true} />}
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-900">{children}</div>

      {/* Right Panel */}
      <div className={`w-80 bg-gray-900 ${activePanel.right ? '' : 'hidden'}`}>
        {activePanel.right === 'chat' && <Chat isOpen={true} />}
        {activePanel.right === 'progress' && <Progress isOpen={true} />}
        {activePanel.right === 'warnings' && <Warnings isOpen={true} />}
      </div>

      {/* Right Sidebar */}
      <div className="w-12 bg-gray-800 flex flex-col space-y-4 p-2">
        <button
          onClick={() => togglePanel('right', 'chat')}
          className={`p-2 rounded ${
            activePanel.right === 'chat' ? 'bg-blue-500' : 'hover:bg-gray-700'
          }`}
        >
          C
        </button>
        <button
          onClick={() => togglePanel('right', 'progress')}
          className={`p-2 rounded ${
            activePanel.right === 'progress' ? 'bg-blue-500' : 'hover:bg-gray-700'
          }`}
        >
          P
        </button>
        <button
          onClick={() => togglePanel('right', 'warnings')}
          className={`p-2 rounded ${
            activePanel.right === 'warnings' ? 'bg-blue-500' : 'hover:bg-gray-700'
          }`}
        >
          W
        </button>
      </div>
    </div>
  );
}
