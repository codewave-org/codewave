# @codewave/editor API文档

## 概述

`@codewave/editor` 是CodeWave项目的核心编辑器包，基于Monaco Editor构建，提供了丰富的代码编辑功能和主题支持。

## 安装

```bash
pnpm add @codewave/editor
```

## 组件

### Editor

主要的编辑器组件，提供代码编辑功能。

#### Props

| 属性 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| value | string | 是 | - | 编辑器的当前内容 |
| language | string | 否 | 'javascript' | 代码语言 |
| theme | EditorTheme | 否 | 'vs-dark' | 编辑器主题 |
| onChange | (value: string) => void | 否 | - | 内容变更回调 |
| onMount | (editor: IStandaloneCodeEditor) => void | 否 | - | 编辑器挂载完成回调 |

#### 示例

```tsx
import { Editor } from '@codewave/editor';

function MyEditor() {
  const [code, setCode] = useState('');

  return (
    <Editor
      value={code}
      language="typescript"
      onChange={setCode}
      onMount={(editor) => {
        // 编辑器实例可用
        console.log('Editor mounted');
      }}
    />
  );
}
```

## 类型定义

### EditorTheme

```typescript
interface EditorTheme {
  name: string;
  data: editor.IStandaloneThemeData;
}
```

### EditorPlugin

```typescript
interface EditorPlugin {
  name: string;
  init: (editor: editor.IStandaloneCodeEditor) => void;
}
```

## 主题定制

编辑器支持自定义主题，可以通过传入符合 `EditorTheme` 接口的主题对象来实现：

```typescript
const customTheme: EditorTheme = {
  name: 'my-theme',
  data: {
    base: 'vs-dark',
    inherit: true,
    rules: [
      // 自定义语法高亮规则
    ],
    colors: {
      // 自定义颜色
    }
  }
};
```

## 插件系统

编辑器支持通过插件扩展功能。插件需要实现 `EditorPlugin` 接口：

```typescript
const myPlugin: EditorPlugin = {
  name: 'my-plugin',
  init: (editor) => {
    // 插件初始化逻辑
  }
};
```

## 事件系统

编辑器组件提供了以下事件回调：

- `onChange`: 当编辑器内容变更时触发
- `onMount`: 当编辑器实例创建完成时触发

## 性能考虑

- 编辑器组件使用了 React.memo 进行优化
- 大文件编辑时建议使用节流来处理 onChange 事件
- 编辑器实例会在组件卸载时自动销毁

## 浏览器兼容性

支持所有现代浏览器：
- Chrome >= 60
- Firefox >= 60
- Safari >= 12
- Edge >= 79

## 已知问题

1. 在某些移动设备上可能存在性能问题
2. 某些特殊字符可能导致语法高亮异常

## 更新日志

### v0.1.0
- 初始版本
- 基础编辑器功能
- 主题支持
- 插件系统 