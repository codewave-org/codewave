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
poetry run pytest tests/ -v
```

### 前端检查

在提交代码前，请确保运行以下检查：

```bash
cd frontend

# 格式化代码
pnpm run format

# 代码质量检查
pnpm run lint

# 类型检查
pnpm run type-check

# 运行测试
pnpm run test
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

#### 测试示例
```typescript
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
    it('renders children correctly', () => {
        const { getByText } = render(<Button>Click me</Button>)
        expect(getByText('Click me')).toBeInTheDocument()
    })
})
```

## 提交规范

1. 提交前运行检查
   ```bash
   # 后端检查
   cd backend
   poetry run black . --check && poetry run isort . --check && poetry run flake8 . && poetry run mypy . && poetry run ruff check .
   poetry run pytest tests/ -v

   # 前端检查
   cd frontend
   pnpm run lint && pnpm run type-check && pnpm run test
   ```

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
     - 类型检查（tsc）
     - 单元测试（jest）
3. 所有检查通过后才能合并到目标分支 