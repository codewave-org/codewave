# 前端开发环境配置指南

本文档描述了如何设置和配置 CodeWave 项目的前端开发环境。

## 环境要求

- Node.js >= 16.0.0
- pnpm >= 8.0.0

## 开发工具

- TypeScript 5.x
- ESLint
- Prettier
- Turbo

## 快速开始

1. 安装 Node.js
```bash
# 推荐使用 nvm 管理 Node.js 版本
nvm install 16
nvm use 16
```

2. 安装 pnpm
```bash
npm install -g pnpm@latest
```

3. 安装依赖
```bash
cd frontend
pnpm install
```

4. 开发命令
```bash
# 启动开发服务器
pnpm dev

# 构建项目
pnpm build

# 运行测试
pnpm test

# 代码检查
pnpm lint

# 修复代码风格
pnpm lint:fix

# 格式化代码
pnpm format

# 清理构建缓存和依赖
pnpm clean
```

## 项目结构

```
frontend/
├── apps/          # 应用程序
├── packages/      # 共享包
├── package.json   # 工作区配置
├── pnpm-lock.yaml # 依赖锁定文件
├── tsconfig.json  # TypeScript 配置
├── .eslintrc.json # ESLint 配置
└── .prettierrc    # Prettier 配置
```

## 开发规范

### TypeScript
- 使用严格模式
- 避免使用 `any` 类型
- 优先使用接口而不是类型别名

### React
- 使用函数组件和 Hooks
- 遵循 React 最佳实践
- 使用 TypeScript 定义 Props 类型

### 代码风格
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循项目的 `.eslintrc.json` 和 `.prettierrc` 配置

## 常见问题

### Q: 如何添加新的依赖？
A: 使用 `pnpm add <package>` 在工作区根目录添加依赖，或使用 `-w` 标志指定工作区。

### Q: 如何处理 TypeScript 错误？
A: 确保正确配置了 `tsconfig.json`，并遵循 TypeScript 的类型系统规范。

### Q: 如何解决依赖冲突？
A: 检查 `pnpm-lock.yaml` 文件，必要时手动解决版本冲突。 