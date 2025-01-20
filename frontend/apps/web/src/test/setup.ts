import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback) => {
  return setTimeout(callback, 0);
};

// Mock cancelAnimationFrame
global.cancelAnimationFrame = (id) => {
  clearTimeout(id);
};

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
