import { useCallback, useEffect, useState } from 'react';

// 断点配置
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

type Breakpoint = keyof typeof breakpoints;

interface ResponsiveState {
  width: number;
  height: number;
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

// 默认状态
const defaultState: ResponsiveState = {
  width: 0,
  height: 0,
  breakpoint: 'lg',
  isMobile: false,
  isTablet: false,
  isDesktop: true,
};

// 获取当前断点
const getBreakpoint = (width: number): Breakpoint => {
  if (width < breakpoints.sm) return 'sm';
  if (width < breakpoints.md) return 'md';
  if (width < breakpoints.lg) return 'lg';
  if (width < breakpoints.xl) return 'xl';
  return '2xl';
};

// 防抖函数
function debounce<Args extends unknown[]>(
  func: (...args: Args) => void,
  wait: number
): (...args: Args) => void {
  let timeout: NodeJS.Timeout;
  return function (this: unknown, ...args: Args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export function useResponsive() {
  const [state, setState] = useState<ResponsiveState>(defaultState);
  const [isClient, setIsClient] = useState(false);

  // 初始化客户端状态
  useEffect(() => {
    setIsClient(true);
    const width = window.innerWidth;
    const height = window.innerHeight;
    setState({
      width,
      height,
      breakpoint: getBreakpoint(width),
      isMobile: width < breakpoints.md,
      isTablet: width >= breakpoints.md && width < breakpoints.lg,
      isDesktop: width >= breakpoints.lg,
    });
  }, []);

  // 更新响应式状态
  const updateState = useCallback(() => {
    if (!isClient) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    setState({
      width,
      height,
      breakpoint: getBreakpoint(width),
      isMobile: width < breakpoints.md,
      isTablet: width >= breakpoints.md && width < breakpoints.lg,
      isDesktop: width >= breakpoints.lg,
    });
  }, [isClient]);

  // 监听窗口大小变化
  useEffect(() => {
    if (!isClient) return;

    const debouncedUpdate = debounce(updateState, 200);
    window.addEventListener('resize', debouncedUpdate);

    return () => {
      window.removeEventListener('resize', debouncedUpdate);
    };
  }, [isClient, updateState]);

  // 获取断点下的面板配置
  const getPanelConfig = useCallback(
    (side: 'left' | 'right') => {
      const { isMobile, isTablet } = state;

      if (isMobile) {
        return {
          sizes: side === 'left' ? [100, 0] : [0, 100],
          minSizes: [200, 0],
          isFloating: true,
        };
      }

      if (isTablet) {
        return {
          sizes: side === 'left' ? [30, 70] : [70, 30],
          minSizes: [200, 300],
          isFloating: false,
        };
      }

      return {
        sizes: side === 'left' ? [25, 75] : [75, 25],
        minSizes: [200, 400],
        isFloating: false,
      };
    },
    [state]
  );

  return {
    ...state,
    getPanelConfig,
    isClient,
  };
}
