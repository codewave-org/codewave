'use client';

import { CodeEditor } from '@/components/CodeEditor';
import { MainLayout } from '@/layouts/MainLayout';
import { useEditorStore } from '@/stores/editorStore';
import type { SupportedLanguage } from '@/types/editor';

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
  const { language, setLanguage } = useEditorStore();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as SupportedLanguage);
  };

  return (
    <MainLayout>
      <div className="container flex min-h-screen gap-4 py-4">
        {/* 左侧面板 */}
        <div className="w-64 space-y-4">
          {/* 知识点 */}
          <div className="rounded-lg border p-4">
            <h2 className="mb-2 font-semibold">Knowledge Points</h2>
            <div className="space-y-2">{/* 这里将添加知识点列表 */}</div>
          </div>

          {/* 提示 */}
          <div className="rounded-lg border p-4">
            <h2 className="mb-2 font-semibold">Hints</h2>
            <div className="space-y-2">{/* 这里将添加提示列表 */}</div>
          </div>

          {/* 测试用例 */}
          <div className="rounded-lg border p-4">
            <h2 className="mb-2 font-semibold">Test Cases</h2>
            <div className="space-y-2">{/* 这里将添加测试用例列表 */}</div>
          </div>
        </div>

        {/* 中间编程区域 */}
        <div className="flex-1 space-y-4">
          {/* 顶部工具栏 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <select className="rounded-md border px-3 py-1" aria-label="选择题目">
                <option>两数之和</option>
              </select>
              <select
                className="rounded-md border px-3 py-1"
                aria-label="选择编程语言"
                value={language}
                onChange={handleLanguageChange}
              >
                <option value="cpp">C++</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="java">Java</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-md border px-3 py-1">Test</button>
              <button className="rounded-md border px-3 py-1">Submit</button>
            </div>
          </div>

          {/* 题目描述 */}
          <div className="rounded-lg border p-4">
            <h1 className="mb-4 text-xl font-bold">两数之和</h1>
            <div className="space-y-4">
              <p>
                给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target
                的那两个整数，并返回它们的数组下标。
              </p>
              <p>你可以假设每种输入只会对应一个答案，并且你不能重复使用相同的元素。</p>
              <p>你可以按任意顺序返回答案。</p>
            </div>
          </div>

          {/* 代码编辑器 */}
          <div className="rounded-lg border p-4">
            <CodeEditor defaultValue={defaultCode} height="400px" />
          </div>
        </div>

        {/* 右侧面板 */}
        <div className="w-64 space-y-4">
          {/* 聊天区域 */}
          <div className="rounded-lg border p-4">
            <h2 className="mb-2 font-semibold">Chat</h2>
            <div className="h-[300px] space-y-2">{/* 这里将添加聊天消息 */}</div>
          </div>

          {/* 进度 */}
          <div className="rounded-lg border p-4">
            <h2 className="mb-2 font-semibold">Process</h2>
            <div className="space-y-2">{/* 这里将添加进度信息 */}</div>
          </div>

          {/* 警告 */}
          <div className="rounded-lg border p-4">
            <h2 className="mb-2 font-semibold">Warnings</h2>
            <div className="space-y-2">{/* 这里将添加警告信息 */}</div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
