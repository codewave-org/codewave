# 代码质量工具指南

本项目使用多个工具来保证代码质量和一致性。

## 工具配置

所有的代码质量工具配置都在以下文件中：
- `backend/pyproject.toml`：black、isort、mypy、ruff 的配置
- `backend/.flake8`：flake8 的配置

### 配置要点

1. 所有工具都配置为忽略以下目录：
   - `.git`
   - `.venv`
   - `__pycache__`
   - `build`
   - `dist`
   - `migrations`（自动生成的数据库迁移文件）

2. 代码风格统一：
   - 行长度限制：88 字符（black 标准）
   - Python 版本：3.10
   - 使用双引号作为字符串引号
   - 导入排序遵循 black 风格

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

## Python 后端

### 代码格式化

#### Black

Black 是一个无需配置的 Python 代码格式化工具。

- **配置文件**: `pyproject.toml` 中的 `[tool.black]` 部分
- **配置示例**:
  ```toml
  [tool.black]
  line-length = 88
  target-version = ['py310']
  include = '\.pyi?$'
  extend-exclude = '''
  # Directories to exclude
  /(
      \.git
      | \.venv
      | migrations
  )/
  '''
  ```
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
- **配置示例**:
  ```toml
  [tool.isort]
  profile = "black"
  multi_line_output = 3
  line_length = 88
  include_trailing_comma = true
  force_grid_wrap = 0
  use_parentheses = true
  ensure_newline_before_comments = true
  skip = [".git", ".venv", "__pycache__", "build", "dist", "migrations"]
  ```
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
- **配置示例**:
  ```ini
  [flake8]
  max-line-length = 88
  extend-ignore = E203
  exclude = 
      .git,
      __pycache__,
      build,
      dist,
      .venv,
      .eggs,
      *.egg,
      .tox,
      .pytest_cache,
      *.pyc,
      migrations
  per-file-ignores =
      __init__.py: F401
  max-complexity = 10
  ```
- **使用方法**:
  ```bash
  poetry run flake8 .
  ```

#### Mypy

Mypy 用于 Python 静态类型检查。

- **配置文件**: `pyproject.toml` 中的 `[tool.mypy]` 部分
- **配置示例**:
  ```toml
  [tool.mypy]
  python_version = "3.10"
  warn_return_any = true
  warn_unused_configs = true
  disallow_untyped_defs = true
  check_untyped_defs = true
  exclude = [
      'migrations/',
      'build/',
      'dist/',
      '.venv/',
      '__pycache__/',
  ]
  allow_redefinition = true
  namespace_packages = true
  explicit_package_bases = true
  ```
- **使用方法**:
  ```bash
  poetry run mypy .
  ```

#### Ruff

Ruff 是一个快速的 Python linter。

- **配置文件**: `pyproject.toml` 中的 `[tool.ruff]` 部分
- **配置示例**:
  ```toml
  [tool.ruff]
  line-length = 100
  target-version = "py310"
  exclude = [
      ".git",
      ".venv",
      "__pycache__",
      "build",
      "dist",
      "migrations",
  ]

  [tool.ruff.lint]
  select = ["E", "F", "B", "I", "N", "UP", "PL", "RUF"]
  ignore = []

  [tool.ruff.lint.per-file-ignores]
  "migrations/*" = ["UP", "E", "F", "B", "I", "N", "PL", "RUF"]
  ```
- **使用方法**:
  ```bash
  poetry run ruff check .
  ```

### VS Code 集成

1. 安装推荐的扩展：
   - Python
   - Black Formatter
   - isort
   - Flake8
   - Mypy Type Checker
   - Ruff

2. 推荐的 VS Code 设置：
   ```json
   {
     "editor.formatOnSave": true,
     "python.formatting.provider": "black",
     "python.linting.enabled": true,
     "python.linting.flake8Enabled": true,
     "python.linting.mypyEnabled": true,
     "isort.args": ["--profile", "black"],
     "[python]": {
       "editor.defaultFormatter": "ms-python.black-formatter",
       "editor.codeActionsOnSave": {
         "source.organizeImports": true
       }
     }
   }
   ```

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

## CI 集成

在每次 Pull Request 和推送到 main 分支时，CI 会：
1. 运行所有代码质量检查（前端和后端）
2. 运行所有测试
3. 只有所有检查都通过才允许合并

## 工具选择说明

1. **格式化工具**：
   - Black：Python 社区事实上的标准格式化工具
   - isort：专注于导入语句排序，与 Black 完美配合

2. **代码质量检查**：
   - Flake8：传统且稳定的 Python 代码质量检查工具
   - Ruff：新一代高性能 Python linter，包含多个工具的功能
   - 两者并存以确保最大的代码质量覆盖

3. **类型检查**：
   - Mypy：Python 官方类型检查工具，提供最完整的类型检查支持 