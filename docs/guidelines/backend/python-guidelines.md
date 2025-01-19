# Python 开发规范

## 1. 代码风格

### 1.1 基本规范
- 遵循 PEP 8 规范
- 使用 4 个空格进行缩进
- 行长度限制在 88 个字符以内（使用 black 格式化工具）
- 使用 UTF-8 编码
- 文件末尾留一个空行

### 1.2 命名规范
- 包名：全小写，简短，不使用下划线
  ```python
  # 好的例子
  from codewave.models import CodeSnippet
  
  # 避免的例子
  from code_wave.code_models import code_snippet
  ```

- 类名：使用 PascalCase
  ```python
  class CodeSnippet:
      pass
  
  class VersionHistory:
      pass
  ```

- 函数和变量名：使用 snake_case
  ```python
  def create_snippet(title: str, content: str) -> CodeSnippet:
      pass
  
  user_name = "example"
  ```

- 常量：全大写，使用下划线连接
  ```python
  MAX_SNIPPET_LENGTH = 10000
  DEFAULT_PAGE_SIZE = 20
  ```

### 1.3 导入规范
- 导入顺序：
  1. 标准库导入
  2. 第三方库导入
  3. 本地应用/库导入
- 每组之间空一行
- 在每组内按字母顺序排序

```python
import json
import os
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from codewave.models import CodeSnippet
from codewave.schemas import SnippetCreate
from codewave.utils import get_db
```

## 2. 项目结构

### 2.1 目录结构
```
backend/
├── alembic/              # 数据库迁移
├── apps/                 # 应用代码
│   ├── __init__.py
│   ├── main.py          # 应用入口
│   ├── api/             # API 路由
│   ├── core/            # 核心配置
│   ├── models/          # 数据模型
│   ├── schemas/         # Pydantic 模型
│   ├── services/        # 业务逻辑
│   └── utils/           # 工具函数
├── tests/               # 测试代码
└── requirements.txt     # 依赖管理
```

### 2.2 模块职责
- api/: 只处理 HTTP 请求/响应
- models/: 定义数据库模型
- schemas/: 定义数据验证和序列化
- services/: 实现业务逻辑
- utils/: 提供通用工具函数

## 3. 代码规范

### 3.1 类型注解
- 使用类型注解提高代码可读性和可维护性
- 使用 Optional 表示可选参数
- 使用 Union 表示多类型
- 使用 TypeVar 和泛型进行参数化类型定义

```python
from typing import List, Optional, Union

def get_snippets(
    page: int,
    page_size: int,
    language: Optional[str] = None,
    tags: Optional[List[str]] = None
) -> List[CodeSnippet]:
    pass
```

### 3.2 异常处理
- 使用自定义异常类
- 在适当的层级处理异常
- 提供有意义的错误信息

```python
class SnippetNotFoundError(Exception):
    pass

def get_snippet_by_id(snippet_id: str) -> CodeSnippet:
    snippet = db.query(CodeSnippet).get(snippet_id)
    if not snippet:
        raise SnippetNotFoundError(f"Snippet {snippet_id} not found")
    return snippet
```

### 3.3 日志规范
- 使用内置的 logging 模块
- 合理设置日志级别
- 包含上下文信息

```python
import logging

logger = logging.getLogger(__name__)

def create_snippet(data: SnippetCreate) -> CodeSnippet:
    logger.info(f"Creating new snippet: {data.title}")
    try:
        # 创建代码片段
        logger.debug("Saving snippet to database")
    except Exception as e:
        logger.error(f"Failed to create snippet: {str(e)}")
        raise
```

## 4. 测试规范

### 4.1 测试结构
- 使用 pytest 框架
- 测试文件命名：test_*.py
- 测试函数命名：test_*
- 测试类命名：Test*

```python
# test_snippets.py
import pytest
from codewave.models import CodeSnippet

def test_create_snippet():
    snippet = CodeSnippet(title="Test", content="print('test')")
    assert snippet.title == "Test"

class TestSnippetAPI:
    def test_get_snippet(self, client):
        response = client.get("/api/v1/snippets/1")
        assert response.status_code == 200
```

### 4.2 测试覆盖率
- 使用 pytest-cov 检查覆盖率
- 目标覆盖率：80%以上
- 重点关注核心业务逻辑

### 4.3 测试数据
- 使用 fixtures 提供测试数据
- 使用工厂模式创建测试对象
- 避免测试之间的数据依赖

```python
@pytest.fixture
def sample_snippet():
    return CodeSnippet(
        title="Test Snippet",
        content="print('test')",
        language="python"
    )
```

## 5. 文档规范

### 5.1 代码注释
- 使用 docstring 记录函数/类的用途
- 描述参数和返回值
- 提供使用示例

```python
def create_snippet(data: SnippetCreate) -> CodeSnippet:
    """创建新的代码片段。

    Args:
        data (SnippetCreate): 代码片段创建数据

    Returns:
        CodeSnippet: 创建的代码片段对象

    Raises:
        ValidationError: 当输入数据无效时
        DatabaseError: 当数据库操作失败时

    Example:
        >>> data = SnippetCreate(title="Example", content="print('Hello')")
        >>> snippet = create_snippet(data)
    """
    pass
```

### 5.2 API 文档
- 使用 FastAPI 的自动文档生成
- 为每个 API 端点提供详细描述
- 包含请求/响应示例

```python
@router.post("/snippets", response_model=SnippetResponse)
async def create_snippet(
    data: SnippetCreate,
    db: Session = Depends(get_db)
) -> SnippetResponse:
    """创建新的代码片段。
    
    - 支持多种编程语言
    - 自动进行代码格式化
    - 创建后立即可用
    """
    pass
```

## 6. 性能优化

### 6.1 数据库操作
- 使用适当的索引
- 避免 N+1 查询问题
- 使用批量操作
- 合理使用缓存

### 6.2 代码优化
- 使用生成器处理大数据集
- 避免不必要的内存分配
- 使用异步操作处理 I/O

```python
async def get_snippets_batch(
    ids: List[str]
) -> AsyncGenerator[CodeSnippet, None]:
    for id_batch in chunks(ids, 100):
        snippets = await db.query(CodeSnippet).filter(
            CodeSnippet.id.in_(id_batch)
        ).gino.all()
        for snippet in snippets:
            yield snippet
```

## 7. 安全规范

### 7.1 数据验证
- 使用 Pydantic 进行输入验证
- 实施适当的访问控制
- 防止 SQL 注入

### 7.2 敏感信息
- 不在代码中硬编码敏感信息
- 使用环境变量或配置文件
- 加密存储敏感数据

```python
from codewave.core.config import settings

database_url = settings.DATABASE_URL
secret_key = settings.SECRET_KEY
```

## 8. 版本控制

### 8.1 分支管理
- 主分支：master/main
- 开发分支：develop
- 功能分支：feature/*
- 修复分支：hotfix/*

### 8.2 提交规范
- 使用清晰的提交信息
- 遵循约定式提交规范
- 适当使用标签

```
feat: 添加代码片段版本控制功能
fix: 修复分页参数验证问题
docs: 更新 API 文档
```

## 9. 变更历史
| 版本 | 变更时间 | 变更内容 | 负责人 |
|------|----------|----------|--------|
| v1.0 | 2024-01-09 | 创建文档 | Hardy | 