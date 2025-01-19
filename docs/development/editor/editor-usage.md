# CodeWave 编辑器使用指南

## 简介

本文档将指导你如何在项目中使用 CodeWave 编辑器组件。CodeWave 编辑器基于 Monaco Editor 构建，提供了强大的代码编辑功能和丰富的定制选项。

## 快速开始

### 1. 安装依赖

首先，在你的项目中安装编辑器包：

```bash
pnpm add @codewave/editor
```

### 2. 基础使用

创建一个简单的代码编辑器：

```tsx
import { Editor } from '@codewave/editor';
import { useState } from 'react';

function CodeEditor() {
  const [code, setCode] = useState('// 在这里输入代码');

  return (
    <div style={{ height: '500px' }}>
      <Editor
        value={code}
        onChange={setCode}
        language="typescript"
      />
    </div>
  );
}
```

注意：编辑器组件需要一个具有固定高度的容器。

### 3. 配置主题

编辑器支持多种主题，你可以使用内置主题或自定义主题：

```tsx
import { Editor, EditorTheme } from '@codewave/editor';

// 使用内置主题
function EditorWithTheme() {
  return <Editor theme="vs-dark" />;
}

// 使用自定义主题
const customTheme: EditorTheme = {
  name: 'my-theme',
  data: {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6A9955' },
      { token: 'keyword', foreground: '569CD6' }
    ],
    colors: {
      'editor.background': '#1E1E1E',
      'editor.foreground': '#D4D4D4'
    }
  }
};

function EditorWithCustomTheme() {
  return <Editor theme={customTheme} />;
}
```

## 高级功能

### 1. 编辑器实例访问

通过 `onMount` 回调可以访问编辑器实例，实现更高级的功能：

```tsx
function AdvancedEditor() {
  const handleEditorMount = (editor: editor.IStandaloneCodeEditor) => {
    // 设置光标位置
    editor.setPosition({ lineNumber: 1, column: 1 });
    
    // 添加内容
    editor.setValue('// 新的内容');
    
    // 聚焦编辑器
    editor.focus();
  };

  return <Editor onMount={handleEditorMount} />;
}
```

### 2. 插件集成

编辑器支持通过插件扩展功能：

```tsx
import { Editor, EditorPlugin } from '@codewave/editor';

const autoSavePlugin: EditorPlugin = {
  name: 'auto-save',
  init: (editor) => {
    let timer: NodeJS.Timeout;
    
    editor.onDidChangeModelContent(() => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        // 自动保存逻辑
        console.log('Auto saving...', editor.getValue());
      }, 1000);
    });
  }
};

function EditorWithPlugin() {
  return <Editor plugins={[autoSavePlugin]} />;
}
```

## 最佳实践

### 1. 性能优化

- 使用 `React.memo` 包装编辑器组件，避免不必要的重渲染
- 对于大文件编辑，使用节流处理 onChange 事件
- 及时销毁不再使用的编辑器实例

```tsx
import { useCallback } from 'react';
import { throttle } from 'lodash';

function OptimizedEditor() {
  const handleChange = useCallback(
    throttle((value: string) => {
      console.log('Content changed:', value);
    }, 500),
    []
  );

  return <Editor onChange={handleChange} />;
}
```

### 2. 错误处理

添加错误边界以优雅处理可能的异常：

```tsx
class EditorErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>编辑器加载失败</div>;
    }
    return this.props.children;
  }
}

function SafeEditor() {
  return (
    <EditorErrorBoundary>
      <Editor />
    </EditorErrorBoundary>
  );
}
```

### 3. 可访问性

为编辑器添加适当的 ARIA 标签：

```tsx
function AccessibleEditor() {
  return (
    <div
      role="application"
      aria-label="代码编辑器"
    >
      <Editor
        aria-label="TypeScript 代码编辑器"
      />
    </div>
  );
}
```

## 常见问题

### 1. 编辑器不显示
- 检查容器是否设置了高度
- 确认依赖是否正确安装
- 检查浏览器控制台是否有错误

### 2. 主题不生效
- 确认主题对象格式是否正确
- 检查主题名称是否与内置主题冲突
- 验证颜色值格式是否正确

### 3. 性能问题
- 避免频繁更新 value prop
- 使用节流处理 onChange 事件
- 考虑使用 React.memo 优化渲染

## 更多资源

- [API 文档](../api/editor.md)
- [Monaco Editor 文档](https://microsoft.github.io/monaco-editor/)
- [示例代码库](../examples/editor/) 