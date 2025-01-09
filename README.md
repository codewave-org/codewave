# CodeWave

CodeWave 是一个 AI 驱动的智能编程学习平台，采用插件化的开发工具框架，致力于为每位学习者提供个性化的编程学习体验。

## 产品特色

- **AI 主动引导**：实时观察用户学习行为，从学习者思维角度出发，智能分析学习障碍
- **个性化学习**：提供贴身私教模式，定制学习方案，自适应调整教学进度
- **深度集成**：练习进度智能提示，学习过程时间回溯，错误经验智能总结

## 项目结构

```
codewave/
├── frontend/         # 前端代码
│   ├── packages/    # 前端核心包
│   │   ├── editor/         # 编辑器核心
│   │   ├── plugin-system/  # 插件系统
│   │   └── ui-components/ # 基础UI组件
│   └── apps/        # 前端应用
├── backend/         # 后端代码
│   ├── packages/    # 后端核心包
│   │   ├── server/         # 基础服务
│   │   ├── plugin-manager/ # 插件管理
│   │   └── common/        # 公共模块
│   └── apps/        # 后端应用
├── docs/           # 项目文档
│   ├── architecture/  # 架构设计
│   ├── api/          # API文档
│   └── product/      # 产品文档
└── scripts/        # 工具脚本
```

## 技术栈

### 前端
- React 18 + TypeScript 5.x
- Vite
- pnpm + Turborepo
- Zustand + TanStack Query
- Radix UI + TailwindCSS
- Monaco Editor

### 后端
- FastAPI
- SQLite
- SQLAlchemy 2.0
- Alembic
- OpenTelemetry

## 开发环境要求

### 前端要求
- Node.js >= 16
- pnpm >= 8.0
- TypeScript 5.x

### 后端要求
- Python >= 3.10
- Poetry
- SQLite 3

## 快速开始

1. 克隆仓库
```bash
git clone https://github.com/codewave-org/codewave.git
cd codewave
```

2. 安装依赖
```bash
# 前端依赖
cd frontend
pnpm install

# 后端依赖
cd ../backend
poetry install
```

3. 启动开发环境
```bash
# 前端开发服务器
cd frontend
pnpm dev

# 后端开发服务器
cd ../backend
poetry run uvicorn apps.main:app --reload
```

## 核心功能

- 🤖 **Proactive Insight Agent**：主动感知学习困境，无需刻意提问
- 📊 **全程学习追踪**：跟踪学习过程，收集完整学习数据
- 🔄 **持续性教学**：突破上下文限制，实现持续性指导
- 📈 **深度行为分析**：深入理解用户行为，精准把握学习难点

## 文档

- [架构设计](docs/architecture/README.md)
- [API文档](docs/api/README.md)
- [开发指南](docs/development/README.md)
- [产品文档](docs/product/README.md)

## 贡献指南

请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解如何参与项目开发。

## 许可证

Apache-2.0