# 获取代码片段列表

## 获取代码片段列表

### 基本信息
- 接口描述：获取代码片段列表，支持分页、过滤和排序
- 请求方法：GET
- 请求路径：/api/v1/code-snippets
- 需要认证：否
- 权限要求：无（公开接口）

### 请求参数

#### 查询参数
| 参数名 | 类型 | 必填 | 描述 | 示例 |
|--------|------|------|------|------|
| page | integer | 否 | 页码，默认 1 | 1 |
| page_size | integer | 否 | 每页数量，默认 20 | 20 |
| language | string | 否 | 编程语言过滤 | python |
| tag | string | 否 | 标签过滤 | example |
| creator | string | 否 | 创建者用户名 | example_user |
| sort | string | 否 | 排序字段 | created_at |
| order | string | 否 | 排序方向（asc/desc） | desc |
| search | string | 否 | 搜索关键词 | hello world |

### 响应信息

#### 响应体
```json
{
  "data": [
    {
      "id": "snippet-001",
      "title": "Example Snippet",
      "description": "A simple hello world example",
      "language": "python",
      "tags": ["example", "tutorial"],
      "isPublic": true,
      "createdAt": "2024-01-09T10:00:00Z",
      "updatedAt": "2024-01-09T10:00:00Z",
      "creator": {
        "id": "user-001",
        "username": "example_user"
      }
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

| 字段名 | 类型 | 描述 | 示例 |
|--------|------|------|------|
| data | array | 代码片段列表 | [...] |
| meta | object | 分页信息 | {"page": 1, "pageSize": 20} |

#### 响应码
| 状态码 | 描述 | 说明 |
|--------|------|------|
| 200 | 成功 | 成功获取列表 |
| 400 | 请求参数错误 | 请求参数不符合要求 |

#### 错误码
| 错误码 | 描述 | 解决方案 |
|--------|------|----------|
| INVALID_PAGE | 页码无效 | 确保页码大于 0 |
| INVALID_PAGE_SIZE | 每页数量无效 | 确保每页数量在 1-100 之间 |
| INVALID_SORT | 排序字段无效 | 使用支持的排序字段 |
| INVALID_ORDER | 排序方向无效 | 使用 asc 或 desc |

### 示例

#### 请求示例
```bash
curl -X GET 'https://api.codewave.com/v1/code-snippets?page=1&page_size=20&language=python&sort=created_at&order=desc'
```

#### 响应示例
```json
{
  "data": [
    {
      "id": "snippet-001",
      "title": "Example Snippet",
      "description": "A simple hello world example",
      "language": "python",
      "tags": ["example", "tutorial"],
      "isPublic": true,
      "createdAt": "2024-01-09T10:00:00Z",
      "updatedAt": "2024-01-09T10:00:00Z",
      "creator": {
        "id": "user-001",
        "username": "example_user"
      }
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### 注意事项
- 默认只返回公开的代码片段
- 已登录用户可以看到自己的私有代码片段
- 返回的代码片段不包含完整代码内容，需要通过详情接口获取

### 变更历史
| 版本 | 变更时间 | 变更内容 | 负责人 |
|------|----------|----------|--------|
| v1.0 | 2024-01-09 | 创建接口 | Hardy | 