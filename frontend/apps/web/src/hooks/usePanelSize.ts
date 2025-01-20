import { useCallback, useEffect, useState } from 'react';

interface PanelSizes {
  left?: number[];
  right?: number[];
}

const PANEL_SIZES_KEY = 'codewave:panel-sizes';

export function usePanelSize() {
  const [sizes, setSizes] = useState<PanelSizes>(() => {
    try {
      const saved = localStorage.getItem(PANEL_SIZES_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // 保存面板大小到 localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PANEL_SIZES_KEY, JSON.stringify(sizes));
    } catch {
      // 忽略存储错误
    }
  }, [sizes]);

  // 更新左侧面板大小
  const updateLeftPanelSize = useCallback((newSizes: number[]) => {
    setSizes((prev) => ({
      ...prev,
      left: newSizes,
    }));
  }, []);

  // 更新右侧面板大小
  const updateRightPanelSize = useCallback((newSizes: number[]) => {
    setSizes((prev) => ({
      ...prev,
      right: newSizes,
    }));
  }, []);

  // 获取默认面板大小
  const getDefaultSizes = useCallback(
    (side: 'left' | 'right', panelCount: number) => {
      if (sizes[side]) {
        return sizes[side];
      }

      // 默认大小配置
      if (panelCount === 2) {
        return side === 'left' ? [25, 75] : [75, 25];
      }
      if (panelCount === 3) {
        return [20, 60, 20];
      }
      return Array(panelCount).fill(100 / panelCount);
    },
    [sizes]
  );

  // 获取默认最小大小
  const getDefaultMinSizes = useCallback((side: 'left' | 'right', panelCount: number) => {
    if (panelCount === 2) {
      return side === 'left' ? [200, 400] : [400, 200];
    }
    if (panelCount === 3) {
      return [200, 400, 200];
    }
    return Array(panelCount).fill(100);
  }, []);

  return {
    sizes,
    updateLeftPanelSize,
    updateRightPanelSize,
    getDefaultSizes,
    getDefaultMinSizes,
  };
}
