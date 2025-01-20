import { useCallback, useEffect } from 'react';
import { PanelSide, PanelType } from './usePanels';

interface HotkeyOptions {
  onTogglePanel: (side: PanelSide, panel: PanelType) => void;
  onClosePanel: (side: PanelSide) => void;
}

export function useHotkeys({ onTogglePanel, onClosePanel }: HotkeyOptions) {
  // 处理快捷键
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // 如果正在输入，不处理快捷键
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Alt + Q: 切换问题面板
      if (event.altKey && event.key === 'q') {
        event.preventDefault();
        onTogglePanel('left', 'questions');
      }
      // Alt + H: 切换提示面板
      else if (event.altKey && event.key === 'h') {
        event.preventDefault();
        onTogglePanel('left', 'hints');
      }
      // Alt + T: 切换测试面板
      else if (event.altKey && event.key === 't') {
        event.preventDefault();
        onTogglePanel('left', 'testrun');
      }
      // Alt + C: 切换聊天面板
      else if (event.altKey && event.key === 'c') {
        event.preventDefault();
        onTogglePanel('right', 'chat');
      }
      // Alt + P: 切换进度面板
      else if (event.altKey && event.key === 'p') {
        event.preventDefault();
        onTogglePanel('right', 'progress');
      }
      // Alt + W: 切换警告面板
      else if (event.altKey && event.key === 'w') {
        event.preventDefault();
        onTogglePanel('right', 'warnings');
      }
      // Esc: 关闭当前面板
      else if (event.key === 'Escape') {
        event.preventDefault();
        onClosePanel('left');
        onClosePanel('right');
      }
    },
    [onTogglePanel, onClosePanel]
  );

  // 注册快捷键
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // 返回快捷键提示
  return {
    shortcuts: [
      { key: 'Alt + Q', description: '切换问题面板' },
      { key: 'Alt + H', description: '切换提示面板' },
      { key: 'Alt + T', description: '切换测试面板' },
      { key: 'Alt + C', description: '切换聊天面板' },
      { key: 'Alt + P', description: '切换进度面板' },
      { key: 'Alt + W', description: '切换警告面板' },
      { key: 'Esc', description: '关闭当前面板' },
    ],
  };
}
