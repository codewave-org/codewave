# 后端开发环境配置指南

本文档描述了如何设置和配置 CodeWave 项目的后端开发环境。

## 环境要求

- Python >= 3.10
- Poetry >= 2.0.0
- PostgreSQL >= 15
- Redis Stack

## 开发工具

- FastAPI
- SQLAlchemy
- Alembic
- OpenTelemetry
- 代码质量工具：
  - Black
  - isort
  - mypy
  - ruff

## 快速开始

1. 安装 Python
```bash
# 推荐使用 pyenv 管理 Python 版本
brew install pyenv
pyenv install 3.10
pyenv global 3.10
```

2. 安装 Poetry
```bash
pip install poetry
```

3. 安装依赖
```bash
cd backend
poetry install
```

4. 安装数据库
```bash
# PostgreSQL
brew install postgresql@15

# Redis Stack
brew install redis-stack
```

5. 开发命令
```bash
# 激活虚拟环境
poetry shell

# 运行开发服务器
poetry run uvicorn apps.main:app --reload

# 运行测试
poetry run pytest

# 代码格式化
poetry run black .
poetry run isort .

# 类型检查
poetry run mypy .

# 代码检查
poetry run ruff check .
```

## 项目结构

```
backend/
├── apps/          # 应用程序
├── packages/      # 共享包
├── pyproject.toml # Poetry 配置
├── poetry.lock    # 依赖锁定文件
└── .env.example   # 环境变量示例
```

## 开发规范

### Python
- 使用 Python 3.10+ 的新特性
- 严格使用类型注解
- 遵循 PEP 8 规范

### FastAPI
- 使用依赖注入
- 遵循 RESTful API 设计原则
- 使用 Pydantic 进行数据验证

### 数据库
- 使用 SQLAlchemy 2.0 异步 API
- 使用 Alembic 进行数据库迁移
- 遵循数据库设计最佳实践

### 代码质量
- 使用 Black 进行代码格式化
- 使用 isort 管理导入顺序
- 使用 mypy 进行类型检查
- 使用 ruff 进行代码检查

## 常见问题

### Q: 如何添加新的依赖？
A: 使用 `poetry add <package>` 添加生产依赖，或使用 `poetry add -D <package>` 添加开发依赖。

### Q: 如何运行数据库迁移？
A: 使用 Alembic 命令：
```bash
# 创建迁移
poetry run alembic revision --autogenerate -m "description"

# 应用迁移
poetry run alembic upgrade head
```

### Q: 如何处理环境变量？
A: 复制 `.env.example` 文件为 `.env`，并根据需要修改配置。 