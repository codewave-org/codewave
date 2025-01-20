'use client';

import { CodeEditor } from '@/components/editor/CodeEditor';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { Hints } from '@/components/panels/LeftPanels/Hints';
import { Questions } from '@/components/panels/LeftPanels/Questions';
import { TestRun } from '@/components/panels/LeftPanels/TestRun';
import { Chat } from '@/components/panels/RightPanels/Chat';
import { Progress } from '@/components/panels/RightPanels/Progress';
import { Warnings } from '@/components/panels/RightPanels/Warnings';
import { usePanels } from '@/hooks/usePanels';

const defaultCode = `#include <iostream>
#include <vector>
#define MAXSIZE 10005
using namespace std;

int main() {
    int temp;
    int nums[MAXSIZE];
    
    while(scanf("%d",&temp) != EOF) {
        
    }
    return 0;
}`;

export default function Home() {
  const { activePanel, togglePanel } = usePanels();

  return (
    <main className="flex flex-col h-screen bg-gray-900 text-white">
      {/* 顶部导航栏 */}
      <div className="flex h-12 items-center justify-between bg-gray-800 px-4">
        <div className="flex items-center gap-4">
          <div className="text-xl font-bold text-blue-400">CodeWave</div>
        </div>
      </div>

      {/* 编辑器工具栏 */}
      <EditorToolbar />

      {/* 主要内容区域 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧边栏 */}
        <div className="flex">
          {/* 侧边栏按钮 */}
          <div className="flex w-12 flex-col bg-gray-800">
            <button
              className={`p-3 hover:bg-gray-700 ${
                activePanel.left === 'questions' ? 'bg-gray-700' : ''
              }`}
              onClick={() => togglePanel('left', 'questions')}
              aria-label="题目"
            >
              Q
            </button>
            <button
              className={`p-3 hover:bg-gray-700 ${
                activePanel.left === 'hints' ? 'bg-gray-700' : ''
              }`}
              onClick={() => togglePanel('left', 'hints')}
              aria-label="提示"
            >
              H
            </button>
            <button
              className={`p-3 hover:bg-gray-700 ${
                activePanel.left === 'testrun' ? 'bg-gray-700' : ''
              }`}
              onClick={() => togglePanel('left', 'testrun')}
              aria-label="测试"
            >
              T
            </button>
          </div>

          {/* 左侧面板 */}
          <Questions isOpen={activePanel.left === 'questions'} />
          <Hints isOpen={activePanel.left === 'hints'} />
          <TestRun isOpen={activePanel.left === 'testrun'} />
        </div>

        {/* 中间编辑器区域 */}
        <div className="flex-1">
          <CodeEditor defaultValue={defaultCode} height="calc(100vh - 96px)" />
        </div>

        {/* 右侧边栏 */}
        <div className="flex">
          {/* 右侧面板 */}
          <Chat isOpen={activePanel.right === 'chat'} />
          <Progress isOpen={activePanel.right === 'progress'} />
          <Warnings isOpen={activePanel.right === 'warnings'} />

          {/* 侧边栏按钮 */}
          <div className="flex w-12 flex-col bg-gray-800">
            <button
              className={`p-3 hover:bg-gray-700 ${
                activePanel.right === 'chat' ? 'bg-gray-700' : ''
              }`}
              onClick={() => togglePanel('right', 'chat')}
              aria-label="聊天"
            >
              C
            </button>
            <button
              className={`p-3 hover:bg-gray-700 ${
                activePanel.right === 'progress' ? 'bg-gray-700' : ''
              }`}
              onClick={() => togglePanel('right', 'progress')}
              aria-label="进度"
            >
              P
            </button>
            <button
              className={`p-3 hover:bg-gray-700 ${
                activePanel.right === 'warnings' ? 'bg-gray-700' : ''
              }`}
              onClick={() => togglePanel('right', 'warnings')}
              aria-label="警告"
            >
              W
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
