'use client';

import { CodeEditor } from '@/components/editor/CodeEditor';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { MainLayout } from '@/components/layout/MainLayout';

export default function Page() {
  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <EditorToolbar />
        <div className="flex-1">
          <CodeEditor />
        </div>
      </div>
    </MainLayout>
  );
}
