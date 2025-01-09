# Testing Guidelines

## Overview

本文档描述了 CodeWave 项目的测试规范和最佳实践。

## 测试类型

### 单元测试
- 测试单个函数/方法的行为
- 使用 mock 隔离外部依赖
- 关注边界条件和错误处理

### 集成测试
- 测试多个组件的交互
- 使用真实的数据库连接
- 验证完整的业务流程

### API 测试
- 测试 HTTP 接口的行为
- 验证请求/响应的格式
- 检查状态码和错误处理

## 测试工具

### pytest
- 主要的测试框架
- 使用 fixtures 管理测试依赖
- 支持参数化测试

### TestClient vs AsyncClient
- `TestClient`: 用于同步测试，更简单直观
  ```python
  def test_sync(client: TestClient):
      response = client.get("/api/endpoint")
      assert response.status_code == 200
  ```
- `AsyncClient`: 用于异步测试，更接近生产环境
  ```python
  async def test_async(async_client: AsyncClient):
      async with AsyncClient(app=app, base_url="http://test") as client:
          response = await client.get("/api/endpoint")
          assert response.status_code == 200
  ```

## 测试结构

### 目录结构
```
tests/
├── api/            # API 测试
├── unit/           # 单元测试
└── integration/    # 集成测试
```

### 文件命名
- 测试文件: `test_*.py`
- 测试类: `Test*`
- 测试方法: `test_*`

## 最佳实践

### 测试隔离
- 每个测试应该是独立的
- 使用 fixtures 管理测试状态
- 测试后清理所有更改

### 测试数据
- 使用 fixtures 提供测试数据
- 避免在测试中硬编码数据
- 使用工厂方法创建测试对象

### 异步测试
- 使用 `@pytest.mark.asyncio` 标记异步测试
- 正确处理异步上下文管理器
- 注意异步资源的清理

### 基础测试类
- 使用 `BaseAPITest` 提供通用功能
- 继承基类简化测试编写
- 保持测试代码的一致性

## 示例

### API 测试示例
```python
class TestUserAPI(BaseAPITest):
    def test_create_user(self):
        data = {"username": "test", "email": "test@example.com"}
        response = self.client.post("/api/users", json=data)
        self.assert_status(response, HTTP_201_CREATED)
        assert "id" in response.json()
```

### 异步测试示例
```python
@pytest.mark.asyncio
async def test_async_operation(async_client: AsyncClient):
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/async-endpoint")
        assert response.status_code == HTTP_200_OK
```

## 注意事项

### mypy 类型检查
- 测试代码也需要类型注解
- 某些测试场景可能需要在 `mypy.ini` 中排除
- 使用 `reveal_type()` 调试类型问题

### 测试覆盖率
- 使用 pytest-cov 检查覆盖率
- 关注核心业务逻辑的覆盖
- 定期检查并提高覆盖率

### 性能考虑
- 避免不必要的数据库操作
- 合理使用 fixtures 的 scope
- 注意异步测试的资源管理 