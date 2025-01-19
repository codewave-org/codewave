# CodeWave 编辑器测试文档

## 概述

本文档详细说明了 CodeWave 编辑器的测试策略、测试用例和测试覆盖率情况。

## 测试环境

### 技术栈
- Jest
- React Testing Library
- jest-environment-jsdom
- ts-jest

### 配置文件
- `jest.config.js`: Jest 主配置
- `jest.setup.ts`: 测试环境设置

## 测试策略

### 1. 单元测试
- 组件渲染测试
- 属性验证测试
- 事件处理测试
- 状态管理测试

### 2. 集成测试
- 编辑器功能测试
- 主题系统测试
- 插件系统测试

### 3. 快照测试
- UI 一致性测试
- 主题渲染测试

## 测试用例

### 编辑器组件测试

#### 基础渲染测试
```typescript
describe('Editor Component', () => {
  it('should render successfully', () => {
    render(<Editor value="" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should apply custom theme', () => {
    const theme = {
      name: 'test-theme',
      data: {/* theme data */}
    };
    render(<Editor theme={theme} />);
    const editor = screen.getByRole('textbox');
    expect(editor).toHaveAttribute('data-theme', 'test-theme');
  });
});
```

#### 事件处理测试
```typescript
describe('Editor Events', () => {
  it('should call onChange when content changes', () => {
    const onChange = jest.fn();
    render(<Editor value="" onChange={onChange} />);
    const editor = screen.getByRole('textbox');
    fireEvent.change(editor, { target: { value: 'new content' } });
    expect(onChange).toHaveBeenCalledWith('new content');
  });

  it('should call onMount when editor is ready', () => {
    const onMount = jest.fn();
    render(<Editor onMount={onMount} />);
    expect(onMount).toHaveBeenCalled();
  });
});
```

#### 主题系统测试
```typescript
describe('Editor Theme System', () => {
  it('should apply built-in theme', () => {
    render(<Editor theme="vs-dark" />);
    expect(screen.getByRole('textbox')).toHaveClass('vs-dark');
  });

  it('should handle theme switching', () => {
    const { rerender } = render(<Editor theme="vs-dark" />);
    rerender(<Editor theme="vs-light" />);
    expect(screen.getByRole('textbox')).toHaveClass('vs-light');
  });
});
```

#### 插件系统测试
```typescript
describe('Editor Plugin System', () => {
  const testPlugin = {
    name: 'test-plugin',
    init: jest.fn()
  };

  it('should initialize plugins', () => {
    render(<Editor plugins={[testPlugin]} />);
    expect(testPlugin.init).toHaveBeenCalled();
  });

  it('should cleanup plugins on unmount', () => {
    const { unmount } = render(<Editor plugins={[testPlugin]} />);
    unmount();
    // 验证清理逻辑
  });
});
```

## 测试覆盖率

### 当前覆盖率报告

```
--------------------------|---------|----------|---------|---------|
File                     | % Stmts | % Branch | % Funcs | % Lines |
--------------------------|---------|----------|---------|---------|
All files                |   94.32 |    78.26 |   92.31 |   94.29 |
 components/             |   95.65 |    80.00 |   93.33 |   95.59 |
  Editor.tsx             |   95.65 |    80.00 |   93.33 |   95.59 |
 types/                  |   90.00 |    75.00 |   90.00 |   90.00 |
  index.ts               |   90.00 |    75.00 |   90.00 |   90.00 |
--------------------------|---------|----------|---------|---------|
```

### 覆盖率目标
- 语句覆盖率 (Statements): > 90%
- 分支覆盖率 (Branches): > 70%
- 函数覆盖率 (Functions): > 90%
- 行覆盖率 (Lines): > 90%

## 测试最佳实践

### 1. 组件测试
- 使用 `data-testid` 进行元素选择
- 测试用户交互而不是实现细节
- 验证组件的可访问性

### 2. 事件测试
- 模拟用户交互
- 验证事件处理函数
- 测试事件传播

### 3. 异步测试
- 使用 `act` 包装异步操作
- 等待状态更新完成
- 处理加载状态

## 常见问题

### 1. 测试环境问题
- Monaco Editor 在测试环境中的模拟
- DOM 事件的正确触发
- 异步操作的处理

### 2. 测试失败排查
- 检查测试环境配置
- 验证模拟对象的正确性
- 确认异步操作的完成

### 3. 覆盖率问题
- 识别未覆盖的代码路径
- 添加边界条件测试
- 补充错误处理测试

## 持续集成

### GitHub Actions 配置
```yaml
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - name: Install dependencies
      run: pnpm install
    - name: Run tests
      run: pnpm test
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage/coverage-final.json
```

### 测试自动化
- 提交前运行测试
- 自动生成覆盖率报告
- 覆盖率阈值检查

## 测试维护

### 1. 测试用例维护
- 定期审查测试用例
- 更新过时的测试
- 移除冗余测试

### 2. 测试文档更新
- 保持文档同步
- 添加新测试说明
- 更新测试策略

### 3. 性能优化
- 优化测试运行时间
- 并行测试执行
- 测试用例组织 