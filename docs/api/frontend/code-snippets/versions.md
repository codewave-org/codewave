# 获取代码片段版本历史

## 获取代码片段的版本历史记录

### 基本信息
- 接口描述：获取指定代码片段的所有历史版本记录
- 请求方法：GET
- 请求路径：/api/v1/code-snippets/{id}/versions
- 需要认证：否（私有代码片段需要认证）
- 权限要求：公开代码片段无需权限，私有代码片段需要是创建者

### 请求参数

#### 路径参数
| 参数名 | 类型 | 必填 | 描述 | 示例 |
|--------|------|------|------|------|
| id | string | 是 | 代码片段ID | snippet-001 |

#### 查询参数
| 参数名 | 类型 | 必填 | 描述 | 示例 |
|--------|------|------|------|------|
| page | integer | 否 | 页码，默认 1 | 1 |
| page_size | integer | 否 | 每页数量，默认 20 | 20 |

#### 请求头
| 参数名 | 类型 | 必填 | 描述 | 示例 |
|--------|------|------|------|------|
| Authorization | string | 否 | Bearer Token（访问私有代码片段时必填） | Bearer eyJhbGciOiJIUzI1NiJ9... |

### 响应信息

#### 响应体
```json
{
  "data": [
    {
      "id": "version-002",
      "number": 2,
      "content": "print('Hello, Updated World!')",
      "title": "Updated Example Snippet",
      "description": "An updated hello world example",
      "tags": ["example", "tutorial", "updated"],
      "isPublic": true,
      "createdAt": "2024-01-09T11:00:00Z",
      "note": "Updated print message",
      "creator": {
        "id": "user-001",
        "username": "example_user"
      }
    },
    {
      "id": "version-001",
      "number": 1,
      "content": "print('Hello, World!')",
      "title": "Example Snippet",
      "description": "A simple hello world example",
      "tags": ["example", "tutorial"],
      "isPublic": true,
      "createdAt": "2024-01-09T10:00:00Z",
      "note": "Initial version",
      "creator": {
        "id": "user-001",
        "username": "example_user"
      }
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 2,
    "totalPages": 1
  }
}
```

| 字段名 | 类型 | 描述 | 示例 |
|--------|------|------|------|
| id | string | 版本ID | "version-002" |
| number | integer | 版本号 | 2 |
| content | string | 该版本的代码内容 | "print('Hello, Updated World!')" |
| title | string | 该版本的标题 | "Updated Example Snippet" |
| description | string | 该版本的描述 | "An updated hello world example" |
| tags | array | 该版本的标签列表 | ["example", "tutorial", "updated"] |
| isPublic | boolean | 该版本是否公开 | true |
| createdAt | string | 版本创建时间 | "2024-01-09T11:00:00Z" |
| note | string | 版本更新说明 | "Updated print message" |
| creator | object | 创建者信息 | {"id": "user-001", "username": "example_user"} |

#### 响应码
| 状态码 | 描述 | 说明 |
|--------|------|------|
| 200 | 成功 | 成功获取版本历史 |
| 401 | 未认证 | 访问私有代码片段时未提供有效token |
| 403 | 未授权 | 无权访问该代码片段 |
| 404 | 未找到 | 代码片段不存在 |

#### 错误码
| 错误码 | 描述 | 解决方案 |
|--------|------|----------|
| SNIPPET_NOT_FOUND | 代码片段不存在 | 检查代码片段ID是否正确 |
| SNIPPET_PRIVATE | 私有代码片段 | 需要登录并有权限访问 |

### 示例

#### 请求示例
```bash
# 访问公开代码片段版本历史
curl -X GET 'https://api.codewave.com/v1/code-snippets/snippet-001/versions'

# 访问私有代码片段版本历史
curl -X GET 'https://api.codewave.com/v1/code-snippets/snippet-001/versions' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...'
```

#### 响应示例
```json
{
  "data": [
    {
      "id": "version-002",
      "number": 2,
      "content": "print('Hello, Updated World!')",
      "title": "Updated Example Snippet",
      "description": "An updated hello world example",
      "tags": ["example", "tutorial", "updated"],
      "isPublic": true,
      "createdAt": "2024-01-09T11:00:00Z",
      "note": "Updated print message",
      "creator": {
        "id": "user-001",
        "username": "example_user"
      }
    },
    {
      "id": "version-001",
      "number": 1,
      "content": "print('Hello, World!')",
      "title": "Example Snippet",
      "description": "A simple hello world example",
      "tags": ["example", "tutorial"],
      "isPublic": true,
      "createdAt": "2024-01-09T10:00:00Z",
      "note": "Initial version",
      "creator": {
        "id": "user-001",
        "username": "example_user"
      }
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 2,
    "totalPages": 1
  }
}
```

### 注意事项
- 版本历史按版本号降序排列（最新版本在前）
- 每个版本都包含完整的代码内容和元数据
- 访问私有代码片段的版本历史需要认证
- 版本号从 1 开始递增

### 变更历史
| 版本 | 变更时间 | 变更内容 | 负责人 |
|------|----------|----------|--------|
| v1.0 | 2024-01-09 | 创建接口 | Hardy | 