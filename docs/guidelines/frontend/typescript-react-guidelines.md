# TypeScript/React 开发规范

## 1. TypeScript 规范

### 1.1 基本规范
- 使用 TypeScript 严格模式
- 使用 ESLint + Prettier 进行代码格式化
- 行长度限制在 100 个字符以内
- 使用 2 个空格进行缩进

### 1.2 命名规范
- 文件名：使用 kebab-case
  ```typescript
  // 组件文件
  code-snippet-list.tsx
  code-snippet-detail.tsx
  
  // 工具文件
  api-client.ts
  use-snippets.ts
  ```

- 组件名：使用 PascalCase
  ```typescript
  export const CodeSnippetList: React.FC = () => {
    return <div>...</div>;
  };
  
  export const CodeSnippetDetail: React.FC<Props> = ({ id }) => {
    return <div>...</div>;
  };
  ```

- 变量和函数：使用 camelCase
  ```typescript
  const snippetList: CodeSnippet[] = [];
  const currentUser: User | null = null;
  
  function createSnippet(data: CreateSnippetDto): Promise<CodeSnippet> {
    return api.post('/snippets', data);
  }
  ```

- 接口和类型：使用 PascalCase
  ```typescript
  interface CodeSnippet {
    id: string;
    title: string;
    content: string;
    language: string;
  }
  
  type SnippetStatus = 'draft' | 'published' | 'archived';
  ```

### 1.3 类型定义
- 优先使用接口定义对象类型
- 使用类型别名定义联合类型和工具类型
- 导出所有公共类型
- 使用精确的类型，避免 any

```typescript
// types.ts
export interface CodeSnippet {
  id: string;
  title: string;
  content: string;
  language: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  creator: User;
}

export type Language = 'typescript' | 'javascript' | 'python' | 'java';

export interface CreateSnippetDto {
  title: string;
  content: string;
  language: Language;
  tags?: string[];
}
```

## 2. React 规范

### 2.1 组件结构
- 使用函数组件和 Hooks
- 按职责拆分组件
- 使用 TypeScript 定义 Props 类型

```typescript
interface Props {
  snippet: CodeSnippet;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const CodeSnippetCard: React.FC<Props> = ({
  snippet,
  onEdit,
  onDelete,
}) => {
  return (
    <Card>
      <CardHeader title={snippet.title} />
      <CardContent>
        <CodeEditor value={snippet.content} language={snippet.language} />
      </CardContent>
      <CardActions>
        {onEdit && <Button onClick={() => onEdit(snippet.id)}>编辑</Button>}
        {onDelete && <Button onClick={() => onDelete(snippet.id)}>删除</Button>}
      </CardActions>
    </Card>
  );
};
```

### 2.2 Hooks 规范
- 自定义 Hook 名称以 use 开头
- 遵循 Hooks 的使用规则
- 合理拆分复杂的 Hook

```typescript
function useCodeSnippet(id: string) {
  const [snippet, setSnippet] = useState<CodeSnippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchSnippet() {
      try {
        setLoading(true);
        const data = await api.get(`/snippets/${id}`);
        setSnippet(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchSnippet();
  }, [id]);

  return { snippet, loading, error };
}
```

### 2.3 状态管理
- 使用 Context 管理全局状态
- 使用 React Query 管理服务器状态
- 使用 Zustand 管理复杂的客户端状态

```typescript
// store/snippets.ts
import create from 'zustand';

interface SnippetStore {
  snippets: CodeSnippet[];
  selectedSnippet: CodeSnippet | null;
  setSelectedSnippet: (snippet: CodeSnippet | null) => void;
}

export const useSnippetStore = create<SnippetStore>((set) => ({
  snippets: [],
  selectedSnippet: null,
  setSelectedSnippet: (snippet) => set({ selectedSnippet: snippet }),
}));
```

## 3. 项目结构

### 3.1 目录结构
```
frontend/
├── src/
│   ├── components/     # 可复用组件
│   ├── pages/         # 页面组件
│   ├── hooks/         # 自定义 Hooks
│   ├── services/      # API 服务
│   ├── store/         # 状态管理
│   ├── types/         # TypeScript 类型定义
│   ├── utils/         # 工具函数
│   └── App.tsx        # 根组件
├── public/            # 静态资源
└── package.json       # 项目配置
```

### 3.2 组件结构
```typescript
// components/code-snippet/code-snippet-card.tsx
import { useState } from 'react';
import { Card, CodeEditor } from '@/components/ui';
import { useSnippetActions } from '@/hooks';
import type { CodeSnippet } from '@/types';

interface Props {
  snippet: CodeSnippet;
}

export const CodeSnippetCard: React.FC<Props> = ({ snippet }) => {
  // 实现组件逻辑
};
```

## 4. 性能优化

### 4.1 渲染优化
- 使用 React.memo 优化组件重渲染
- 使用 useMemo 和 useCallback 优化性能
- 使用虚拟列表处理大列表

```typescript
const MemoizedCodeSnippetCard = React.memo(CodeSnippetCard);

function CodeSnippetList({ snippets }: Props) {
  const handleEdit = useCallback((id: string) => {
    // 处理编辑逻辑
  }, []);

  const sortedSnippets = useMemo(() => {
    return [...snippets].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [snippets]);

  return (
    <VirtualList
      data={sortedSnippets}
      renderItem={(snippet) => (
        <MemoizedCodeSnippetCard
          key={snippet.id}
          snippet={snippet}
          onEdit={handleEdit}
        />
      )}
    />
  );
}
```

### 4.2 加载优化
- 使用代码分割和懒加载
- 优化图片和资源加载
- 实现骨架屏和加载状态

```typescript
const CodeEditor = React.lazy(() => import('./code-editor'));

function SnippetDetail() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <CodeEditor />
    </Suspense>
  );
}
```

## 5. 测试规范

### 5.1 单元测试
- 使用 Jest 和 React Testing Library
- 测试组件的关键功能
- 模拟复杂的依赖

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { CodeSnippetCard } from './code-snippet-card';

describe('CodeSnippetCard', () => {
  it('should render snippet title and content', () => {
    render(<CodeSnippetCard snippet={mockSnippet} />);
    expect(screen.getByText(mockSnippet.title)).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    render(<CodeSnippetCard snippet={mockSnippet} onEdit={onEdit} />);
    fireEvent.click(screen.getByText('编辑'));
    expect(onEdit).toHaveBeenCalledWith(mockSnippet.id);
  });
});
```

### 5.2 集成测试
- 测试组件交互
- 测试路由功能
- 测试状态管理

```typescript
import { renderWithProviders } from '@/test-utils';

describe('SnippetList', () => {
  it('should load and display snippets', async () => {
    renderWithProviders(<SnippetList />);
    expect(await screen.findByText('Loading...')).toBeInTheDocument();
    expect(await screen.findAllByRole('article')).toHaveLength(10);
  });
});
```

## 6. 文档规范

### 6.1 组件文档
- 使用 Storybook 编写组件文档
- 包含组件用法示例
- 记录 Props 类型和说明

```typescript
// CodeSnippetCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { CodeSnippetCard } from './code-snippet-card';

const meta: Meta<typeof CodeSnippetCard> = {
  component: CodeSnippetCard,
  title: 'Components/CodeSnippetCard',
};

export default meta;
type Story = StoryObj<typeof CodeSnippetCard>;

export const Default: Story = {
  args: {
    snippet: {
      id: '1',
      title: 'Example Snippet',
      content: 'console.log("Hello")',
      language: 'javascript',
    },
  },
};
```

### 6.2 代码注释
- 为复杂逻辑添加注释
- 使用 JSDoc 注释公共 API
- 说明特殊处理和注意事项

```typescript
/**
 * 处理代码片段的保存操作。
 * 如果是新建，则创建新的片段；
 * 如果是编辑，则更新现有片段。
 *
 * @param data - 代码片段数据
 * @returns 保存后的代码片段
 * @throws {ValidationError} 当数据验证失败时
 */
async function handleSaveSnippet(data: SaveSnippetDto): Promise<CodeSnippet> {
  // 实现保存逻辑
}
```

## 7. 安全规范

### 7.1 XSS 防护
- 使用 React 的 JSX 转义
- 谨慎使用 dangerouslySetInnerHTML
- 验证和清理用户输入

### 7.2 认证和授权
- 使用 JWT 进行身份验证
- 实现路由保护
- 处理未授权访问

```typescript
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
```

## 8. 变更历史
| 版本 | 变更时间 | 变更内容 | 负责人 |
|------|----------|----------|--------|
| v1.0 | 2024-01-09 | 创建文档 | Hardy | 