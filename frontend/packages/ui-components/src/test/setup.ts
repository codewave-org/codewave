import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// 配置 testing-library
configure({
    testIdAttribute: 'data-testid',
});

// 清理所有模拟
afterEach(() => {
    jest.clearAllMocks();
}); 