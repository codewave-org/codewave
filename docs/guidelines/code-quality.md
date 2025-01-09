# 代码质量工具指南

本项目使用多个工具来保证代码质量和一致性。

## 前端

### 代码格式化

#### Prettier

Prettier 是一个固执己见的代码格式化工具，支持多种语言。

- **配置文件**: `.prettierrc`
- **使用方法**:
  ```bash
  # 格式化所有文件
  pnpm prettier:write
  
  # 检查是否需要格式化（不实际修改）
  pnpm prettier:check
  ```

### 代码检查

#### ESLint

ESLint 用于检查 JavaScript/TypeScript 代码质量和风格。

- **配置文件**: `.eslintrc.json`
- **使用方法**:
  ```bash
  # 检查代码
  pnpm lint
  
  # 自动修复可修复的问题
  pnpm lint:fix
  ```

#### TypeScript

TypeScript 提供静态类型检查。

- **配置文件**: `tsconfig.json`
- **使用方法**:
  ```bash
  pnpm type-check
  ```

### VS Code 集成

1. 安装推荐的扩展：
   - ESLint
   - Prettier
   - TypeScript and JavaScript Language Features

2. 项目已配置 `.vscode/settings.json`，支持：
   - 保存时自动格式化（Prettier）
   - 实时代码检查（ESLint）
   - TypeScript 类型检查

### 推荐的 VS Code 设置

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Python 后端

### 代码格式化

#### Black

Black 是一个无需配置的 Python 代码格式化工具。

- **配置文件**: `pyproject.toml` 中的 `[tool.black]` 部分
- **使用方法**:
  ```bash
  # 格式化所有文件
  poetry run black .
  
  # 检查是否需要格式化（不实际修改）
  poetry run black . --check
  ```

#### isort

isort 用于自动排序和格式化 Python 导入语句。

- **配置文件**: `pyproject.toml` 中的 `[tool.isort]` 部分
- **使用方法**:
  ```bash
  # 排序所有文件的导入
  poetry run isort .
  
  # 检查是否需要排序（不实际修改）
  poetry run isort . --check
  ```

### 代码检查

#### Flake8

Flake8 用于检查 Python 代码风格和质量。

- **配置文件**: `.flake8`
- **使用方法**:
  ```bash
  poetry run flake8 .
  ```

#### Mypy

Mypy 用于 Python 静态类型检查。

- **配置文件**: `pyproject.toml` 中的 `[tool.mypy]` 部分
- **使用方法**:
  ```bash
  poetry run mypy .
  ```

#### Ruff

Ruff 是一个快速的 Python linter。

- **配置文件**: `pyproject.toml` 中的 `[tool.ruff]` 部分
- **使用方法**:
  ```bash
  poetry run ruff check .
  ```

### VS Code 集成

1. 安装 Python 扩展
2. 项目已配置 `.vscode/settings.json`，支持：
   - 保存时自动格式化（Black）
   - 保存时自动整理导入（isort）
   - 实时代码检查（Flake8）

### CI 集成

在每次 Pull Request 和推送到 main 分支时，CI 会：
1. 运行所有代码质量检查
2. 运行所有测试
3. 只有所有检查都通过才允许合并

## 本地开发工作流

1. 编写代码时，VS Code 会自动格式化和检查代码

2. 前端代码提交前检查：
   ```bash
   cd frontend
   pnpm lint
   pnpm type-check
   pnpm prettier:check
   ```

3. 后端代码提交前检查：
   ```bash
   cd backend
   poetry run black . --check
   poetry run isort . --check
   poetry run flake8 .
   poetry run mypy .
   poetry run ruff check .
   ```

4. 如果发现问题：
   - 前端格式问题：
     - 运行 `pnpm prettier:write` 修复格式
     - 运行 `pnpm lint:fix` 修复 ESLint 问题
   - 后端格式问题：
     - 运行 `poetry run black .` 和 `poetry run isort .` 自动修复
   - 其他问题：根据工具提示手动修复 