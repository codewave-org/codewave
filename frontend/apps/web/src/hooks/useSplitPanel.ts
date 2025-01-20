import debounce from 'lodash/debounce';
import { useCallback, useEffect, useRef } from 'react';
import Split from 'split.js';

interface SplitPanelConfig {
  sizes?: number[];
  minSizes?: number[];
  gutterSize?: number;
  snapOffset?: number;
  direction?: 'horizontal' | 'vertical';
  cursor?: string;
}

interface SplitPanelOptions extends SplitPanelConfig {
  onDragEnd?: (sizes: number[]) => void;
}

export function useSplitPanel(
  containerRef: React.RefObject<HTMLElement>,
  options: SplitPanelOptions
) {
  const splitInstance = useRef<Split.Instance | null>(null);
  const configRef = useRef(options);

  // 更新配置
  useEffect(() => {
    configRef.current = options;
  }, [options]);

  // 创建 Split 实例
  const createSplitInstance = useCallback(() => {
    if (!containerRef.current) return;

    // 清理现有实例
    if (splitInstance.current) {
      splitInstance.current.destroy();
      splitInstance.current = null;
    }

    const elements = containerRef.current.querySelectorAll<HTMLElement>('.split-panel');
    const visibleElements = Array.from(elements).filter((el) => !el.classList.contains('hidden'));

    if (visibleElements.length > 1) {
      const { sizes, minSizes, gutterSize, snapOffset, direction, cursor, onDragEnd } =
        configRef.current;

      splitInstance.current = Split(visibleElements, {
        sizes: sizes || Array(visibleElements.length).fill(100 / visibleElements.length),
        minSize: minSizes || Array(visibleElements.length).fill(100),
        gutterSize: gutterSize || 4,
        snapOffset: snapOffset || 0,
        direction: direction || 'horizontal',
        cursor: cursor || 'col-resize',
        onDragEnd: onDragEnd ? debounce((sizes) => onDragEnd(sizes), 200) : undefined,
      });
    }
  }, []);

  // 初始化或更新 Split 实例
  useEffect(() => {
    createSplitInstance();

    return () => {
      if (splitInstance.current) {
        splitInstance.current.destroy();
        splitInstance.current = null;
      }
    };
  }, [createSplitInstance]);

  // 提供重新初始化方法
  const reinitialize = useCallback(() => {
    createSplitInstance();
  }, [createSplitInstance]);

  // 获取当前面板大小
  const getSizes = useCallback(() => {
    return splitInstance.current?.getSizes() || [];
  }, []);

  // 设置面板大小
  const setSizes = useCallback((sizes: number[]) => {
    if (splitInstance.current) {
      splitInstance.current.setSizes(sizes);
    }
  }, []);

  return {
    reinitialize,
    getSizes,
    setSizes,
  };
}
