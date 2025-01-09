# CodeWave Backend

CodeWave 项目的后端服务。

## 技术栈

- FastAPI
- SQLAlchemy 2.0
- Alembic
- SQLite

## 项目结构

```
backend/
├── apps/          # 应用程序
├── packages/      # 共享包
├── data/          # 数据文件
├── pyproject.toml # Poetry 配置
├── poetry.lock    # 依赖锁定文件
└── .env.example   # 环境变量示例
```

## 开发环境

请参考 [后端开发环境配置指南](../docs/development/backend-setup.md)。

## 快速开始

1. 安装依赖
```bash
poetry install
```

2. 激活虚拟环境
```bash
poetry shell
```

3. 初始化数据库
```bash
mkdir -p data
alembic upgrade head
```

4. 运行开发服务器
```bash
uvicorn apps.main:app --reload
```

## API 文档

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- OpenAPI: http://localhost:8000/openapi.json

## 开发规范

请参考 [后端开发规范](../docs/development/backend-standards.md)。 