# 开发工具使用指南

本文档介绍了项目中使用的各种开发工具的配置和使用方法。

## 目录
- [代码格式化](#代码格式化)
- [代码质量检查](#代码质量检查)
- [类型检查](#类型检查)
- [测试工具](#测试工具)
- [常见问题](#常见问题)

## 代码格式化

### Prettier

#### 配置
项目使用 `.prettierrc` 进行配置，主要设置包括：
- 使用单引号
- 使用 4 空格缩进
- 行宽限制为 100 字符
- 使用 ES5 尾随逗号
- 箭头函数始终使用括号

忽略特定文件通过 `.prettierignore` 配置。

#### 使用方法
```bash
# 检查代码格式
pnpm run format:check

# 自动修复格式
pnpm run format
```

## 代码质量检查

### ESLint

#### 配置
项目使用 `.eslintrc.js` 进行配置，主要特点：
- 集成了 TypeScript 和 Prettier 规则
- 启用 TypeScript 严格模式
- 与 Prettier 规则兼容
- 合理的警告级别设置

忽略特定文件通过 `.eslintignore` 配置。

#### 使用方法
```bash
# 检查代码质量
pnpm run lint

# 自动修复问题
pnpm run lint:fix
```

### 后端代码质量工具

#### Black
Python 代码格式化工具。

```bash
# 格式化代码
poetry run black .
```

#### isort
导入语句排序工具。

```bash
# 排序导入语句
poetry run isort .
```

#### Flake8
Python 代码质量检查工具。

```bash
# 检查代码质量
poetry run flake8 .
```

#### Ruff
快速的 Python linter。

```bash
# 检查代码
poetry run ruff check .
```

## 类型检查

### 前端类型检查
使用 TypeScript 编译器进行类型检查：

```bash
# 运行类型检查
pnpm run type-check
```

### 后端类型检查
使用 mypy 进行类型检查：

```bash
# 运行类型检查
poetry run mypy .
```

注意：
- 测试文件（`tests/`目录）默认不进行类型检查
- 可以通过 `mypy.ini` 配置类型检查行为

## 测试工具

### 前端测试
使用 Jest 进行测试：

```bash
# 运行所有测试
pnpm run test

# 监听模式
pnpm run test:watch

# 生成覆盖率报告
pnpm run test:coverage
```

### 后端测试
使用 pytest 进行测试：

```bash
# 运行所有测试
poetry run pytest tests/ -v

# 生成覆盖率报告
poetry run pytest tests/ --cov=apps
```

## 常见问题

### 1. Prettier 和 ESLint 冲突
**问题**：有时 Prettier 和 ESLint 的规则可能发生冲突。
**解决方案**：项目已配置 eslint-config-prettier 来禁用所有与 Prettier 冲突的 ESLint 规则。如果仍然遇到冲突，请先运行 `pnpm run format`，然后再运行 `pnpm run lint:fix`。

### 2. 类型检查错误
**问题**：遇到难以解决的类型错误。
**解决方案**：
- 检查是否正确导入了类型定义
- 确保使用了正确的类型声明
- 必要时可以使用类型断言，但要谨慎使用
- 参考项目中的其他类似用法

### 3. 测试覆盖率不足
**问题**：测试覆盖率未达到要求。
**解决方案**：
- 使用覆盖率报告找出未覆盖的代码
- 优先测试核心业务逻辑
- 添加边界条件测试
- 确保异常处理路径也有测试覆盖 