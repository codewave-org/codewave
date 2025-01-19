# 后端开发环境配置指南

本文档描述了如何设置和配置 CodeWave 项目的后端开发环境。

## 环境要求

- Python >= 3.10
- Poetry >= 2.0.0
- SQLite >= 3.0

## 开发工具

- FastAPI
- SQLAlchemy
- Alembic
- 代码质量工具：
  - Black
  - isort
  - mypy
  - ruff

## 快速开始

### 1. Python 环境配置

```bash
# 推荐使用 pyenv 管理 Python 版本
brew install pyenv
pyenv install 3.10
pyenv global 3.10
```

### 2. Poetry 配置
```bash
# 安装 Poetry
curl -sSL https://install.python-poetry.org | python3 -

# 配置虚拟环境在项目目录下
poetry config virtualenvs.in-project true

# 进入后端目录
cd backend

# 创建并激活虚拟环境（这会在项目目录下创建 .venv 目录）
poetry env use python3.10

# 安装依赖（如果虚拟环境不存在，这一步也会创建虚拟环境）
poetry install
```

> **重要提示**：每当修改 Poetry 配置或重新安装环境后，需要重新加载环境变量才能使更改生效。可以通过以下方式之一实现：
> - 重启终端
> - 执行 `source ~/.zshrc`（如果使用 zsh）
> - 开启新的 shell 会话

### 3. 数据库配置
```bash
# SQLite 通常已经预装在大多数系统中
# 创建数据目录
mkdir -p data

# 初始化数据库
poetry run alembic upgrade head
```

## IDE 配置指南

### VS Code 配置
1. 安装必要的扩展
   - Python
   - Pylance
   - Python Test Explorer
   - SQLite Viewer（推荐，用于查看数据库内容）

2. 配置 Python 解释器
   - 打开命令面板 (Cmd + Shift + P)
   - 输入 "Python: Select Interpreter"
   - 选择 Poetry 创建的虚拟环境解释器
   - 如果找不到正确的解释器，可以通过以下命令获取路径：
     ```bash
     # 查看虚拟环境信息
     poetry env info --path
     ```
   - 将输出的路径加上 `/bin/python` 即为解释器路径

3. 工作区设置
   在 `.vscode/settings.json` 中添加：
   ```json
   {
     "python.defaultInterpreterPath": "${workspaceFolder}/backend/.venv/bin/python",
     "python.analysis.extraPaths": [
       "${workspaceFolder}/backend/packages",
       "${workspaceFolder}/backend/apps"
     ],
     "python.linting.enabled": true,
     "python.linting.pylintEnabled": true,
     "python.formatting.provider": "black",
     "python.analysis.typeCheckingMode": "basic",
     "editor.formatOnSave": true,
     "editor.codeActionsOnSave": {
       "source.organizeImports": true
     }
   }
   ```

4. 环境变量配置
   - 复制 `.env.example` 为 `.env`
   - 根据需要修改环境变量，特别是敏感信息如密钥和密码、数据库路径等配置

### 解决导入问题
如果在 VS Code 中，Python 解释器无法解析导入，请按照以下步骤进行排查：

1. 确认 Poetry 虚拟环境
   ```bash
   # 查看虚拟环境信息
   poetry env info
   ```

2. 更新 VS Code 设置
   - 使用实际的虚拟环境路径
   - 确保 `python.analysis.extraPaths` 包含了所有源码目录

3. 重启 VS Code
   - 完全关闭 VS Code
   - 重新打开项目
   - 重新选择 Python 解释器

4. 验证配置
   - 打开任意 Python 文件
   - 确认底部状态栏显示正确的 Python 解释器
   - 检查导入是否正常工作

## 开发工作流
```bash
# 激活虚拟环境
poetry shell

# 启动服务
uvicorn apps.main:app --reload
```

### 2. 运行测试
```bash
# 运行所有测试
poetry run pytest

# 运行特定测试
poetry run pytest tests/test_specific.py
```

### 3. 代码格式化
```bash
# 格式化代码
poetry run black .

# 运行 lint
poetry run pylint **/*.py
```

### 4. 代码检查
```bash
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
├── data/          # 数据文件（包含 SQLite 数据库）
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
- 使用 SQLAlchemy 2.0 API
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
A: 复制 `.env.example` 文件为 `.env`，并根据需要修改配置。主要配置项包括：
- `DB_DRIVER`: sqlite
- `DB_PATH`: ./data/codewave.db

### Q: 导入问题
A: 如果遇到 "无法解析导入" 的问题：
1. 确保已经选择了正确的 Python 解释器
2. 检查 `PYTHONPATH` 是否包含了项目目录
3. 尝试重启 VS Code
4. 运行 `poetry install` 确保所有依赖都已安装

### Q: Poetry 虚拟环境问题
A: 如果找不到虚拟环境：
1. 确保已经运行了 `poetry install`
2. 检查 `.venv` 目录是否存在
3. 使用 `poetry env info` 查看环境信息
4. 必要时可以删除 `.venv` 目录重新安装

### Q: 数据库问题
A: 如果遇到数据库问题：
1. 确保 `data` 目录存在且有写入权限
2. 检查 SQLite 数据库文件是否正确创建
3. 验证环境变量中的数据库路径配置
4. 如果数据库损坏，可以删除数据库文件并重新运行迁移

### Q: 环境配置修改后不生效怎么办？
A: 当修改了 Poetry 配置或重新安装环境后，可能需要重新加载环境变量：
1. 重启终端（最简单的方法）
2. 执行 `source ~/.zshrc`（如果使用 zsh）
3. 开启新的 shell 会话
4. 如果使用 VS Code，可能还需要重启 VS Code 或重新加载窗口