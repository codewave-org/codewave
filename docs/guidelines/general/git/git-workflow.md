# Git Workflow

## 分支管理

- `main`: 主分支，用于生产环境
- `develop`: 开发分支，用于开发环境
- `feature/*`: 功能分支，用于开发新功能
- `bugfix/*`: 修复分支，用于修复 bug
- `hotfix/*`: 热修复分支，用于紧急修复生产环境问题
- `style/*`: 代码风格分支，用于代码格式化和风格改进

## 代码质量检查

### 后端检查

在提交代码前，请确保运行以下检查：

```bash
cd backend

# 格式化代码
poetry run black .
poetry run isort .

# 代码质量检查
poetry run flake8 .
poetry run ruff check .

# 类型检查
poetry run mypy .

# 运行测试
poetry run pytest tests/ -v        # 单元测试
poetry run pytest tests/api/ -v    # API 测试
```

### 前端检查

在提交代码前，请确保运行以下检查：

```bash
cd frontend

# 格式化检查
pnpm run format:check

# 格式化修复
pnpm run format

# 代码质量检查
pnpm run lint

# 代码质量修复
pnpm run lint:fix

# 类型检查
pnpm -r type-check

# 构建检查
pnpm -r build

# 运行测试
cd packages && pnpm -r test       # 运行包测试（Jest）
cd ../apps/web && pnpm test -- --run  # 运行 web 应用测试（Vitest）
```

### 类型检查说明

#### 后端
- 测试文件（`tests/`目录下的文件）默认不进行类型检查，这是为了保持测试代码的灵活性
- 如果需要对测试文件进行类型检查，可以在 `mypy.ini` 中配置
- 对于异步测试，建议使用 `AsyncClient`，对于同步测试，建议使用 `TestClient`

#### 前端
- 所有 TypeScript 文件都需要进行类型检查
- 使用 `--noEmit` 参数确保只进行类型检查而不生成文件
- 测试文件也需要进行类型检查，确保测试代码的类型安全
- 使用 `pnpm -r type-check` 对所有包进行类型检查

### 代码风格配置

#### Prettier 配置
- 使用项目根目录的 `.prettierrc` 配置文件
- 使用 `.prettierignore` 忽略特定文件
- 支持的文件类型：`*.{ts,tsx,js,jsx,json,md}`
- 主要配置：
  - 使用单引号
  - 使用 4 空格缩进
  - 行宽限制为 100 字符
  - 使用 ES5 尾随逗号
  - 箭头函数始终使用括号

#### ESLint 配置
- 使用项目根目录的 `.eslintrc.js` 配置文件
- 使用 `.eslintignore` 忽略特定文件
- 集成了 TypeScript 和 Prettier 规则
- 主要规则：
  - 启用 TypeScript 严格模式
  - 与 Prettier 规则兼容
  - 警告未使用的变量（使用 `argsIgnorePattern: "^_"` 忽略以下划线开头的参数）
  - 关闭特定的过于严格的规则

## 测试规范

### 后端测试

#### 测试文件组织
- 单元测试放在 `tests/` 目录下
- API 测试放在 `tests/api/` 目录下
- 集成测试放在 `tests/integration/` 目录下

#### 测试客户端使用
1. 同步测试
   ```python
   def test_endpoint_sync(client: TestClient) -> None:
       response = client.get("/endpoint")
       assert response.status_code == 200
   ```

2. 异步测试
   ```python
   @pytest.mark.asyncio
   async def test_endpoint_async(async_client: AsyncClient) -> None:
       async with AsyncClient(app=app, base_url="http://test") as client:
           response = await client.get("/endpoint")
           assert response.status_code == 200
   ```

### 前端测试

#### 测试文件组织
- 组件测试放在组件目录下，命名为 `*.test.tsx`
- 工具函数测试放在相应目录下，命名为 `*.test.ts`
- 集成测试放在 `tests/` 目录下

#### 测试环境配置
- packages 使用 Jest 作为测试框架
- web 使用 Vitest 作为测试框架
- 使用 `@testing-library/react` 进行组件测试
- 使用 `jest-environment-jsdom` 提供浏览器环境（packages）
- 使用 `jsdom` 提供浏览器环境（web）
- 使用 `ts-jest` 处理 TypeScript 文件（packages）

#### 测试示例
```typescript
import { render, screen } from '@testing-library/react';

describe('Component', () => {
    it('renders correctly', () => {
        render(<Component />);
        const element = screen.getByTestId('test-id');
        expect(element).toBeInTheDocument();
    });

    it('handles props correctly', () => {
        const props = {
            value: 'test',
            onChange: jest.fn()  // packages 使用 jest.fn()
        };
        render(<Component {...props} />);
        expect(screen.getByText('test')).toBeInTheDocument();
    });
});
```

#### Mock 示例
```typescript
// packages 使用 Jest
jest.mock('@external/module', () => ({
    ExternalComponent: ({ children, ...props }) => (
        <div data-testid="mock-component" {...props}>{children}</div>
    )
}));
const mockFn = jest.fn();

// web 使用 Vitest
vi.mock('@external/module', () => ({
    ExternalComponent: ({ children, ...props }) => (
        <div data-testid="mock-component" {...props}>{children}</div>
    )
}));
const mockFn = vi.fn();
```

## 提交规范

1. 提交前检查清单
   - 运行代码格式化检查 (`format:check`)
   - 运行代码质量检查 (`lint`)
   - 运行类型检查 (`type-check`)
   - 运行单元测试 (`test`)
   - 确保所有检查都通过
   - 检查是否有未提交的配置文件
   - 确保不包含敏感信息

2. 提交信息格式
   ```
   <type>(<scope>): <subject>

   <body>

   <footer>
   ```

   类型（type）:
   - feat: 新功能
   - fix: 修复 bug
   - docs: 文档更新
   - style: 代码格式化
   - refactor: 代码重构
   - test: 测试相关
   - chore: 构建过程或辅助工具的变动

## CI/CD 流程

1. 提交代码触发 CI 流程
2. CI 运行以下检查：
   - 后端：
     - 代码格式检查（black, isort）
     - 代码质量检查（flake8, ruff）
     - 类型检查（mypy，除测试文件外）
     - 单元测试（pytest）
   - 前端：
     - 代码格式检查（prettier）
     - 代码质量检查（eslint）
     - 类型检查（tsc --noEmit）
     - 单元测试（Jest for packages, Vitest for web）
3. 所有检查通过后才能合并到目标分支

## 注意事项
1. 保持配置文件的一致性
2. 定期更新依赖版本
3. 关注代码质量工具的警告
4. 保持测试覆盖率
5. 遵循代码风格指南
6. 测试代码也需要遵循相同的代码质量标准
7. 合理使用 Mock 来隔离外部依赖
8. 定期清理过时的测试用例和 Mock 