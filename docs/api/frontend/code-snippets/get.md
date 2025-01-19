# 获取代码片段详情

## 获取单个代码片段的详细信息

### 基本信息
- 接口描述：获取单个代码片段的详细信息，包括完整的代码内容
- 请求方法：GET
- 请求路径：/api/v1/code-snippets/{id}
- 需要认证：否（私有代码片段需要认证）
- 权限要求：公开代码片段无需权限，私有代码片段需要是创建者

### 请求参数

#### 路径参数
| 参数名 | 类型 | 必填 | 描述 | 示例 |
|--------|------|------|------|------|
| id | string | 是 | 代码片段ID | snippet-001 |

#### 请求头
| 参数名 | 类型 | 必填 | 描述 | 示例 |
|--------|------|------|------|------|
| Authorization | string | 否 | Bearer Token（访问私有代码片段时必填） | Bearer eyJhbGciOiJIUzI1NiJ9... |

### 响应信息

#### 响应体
```json
{
  "data": {
    "id": "snippet-001",
    "title": "Example Snippet",
    "content": "print('Hello, World!')",
    "language": "python",
    "description": "A simple hello world example",
    "tags": ["example", "tutorial"],
    "isPublic": true,
    "createdAt": "2024-01-09T10:00:00Z",
    "updatedAt": "2024-01-09T10:00:00Z",
    "creator": {
      "id": "user-001",
      "username": "example_user"
    },
    "metadata": {
      "viewCount": 100,
      "forkCount": 5,
      "likeCount": 10
    },
    "currentVersion": {
      "number": 1,
      "createdAt": "2024-01-09T10:00:00Z"
    }
  }
}
```

| 字段名 | 类型 | 描述 | 示例 |
|--------|------|------|------|
| id | string | 代码片段ID | "snippet-001" |
| title | string | 标题 | "Example Snippet" |
| content | string | 完整代码内容 | "print('Hello, World!')" |
| language | string | 编程语言 | "python" |
| description | string | 描述 | "A simple hello world example" |
| tags | array | 标签列表 | ["example", "tutorial"] |
| isPublic | boolean | 是否公开 | true |
| createdAt | string | 创建时间 | "2024-01-09T10:00:00Z" |
| updatedAt | string | 更新时间 | "2024-01-09T10:00:00Z" |
| creator | object | 创建者信息 | {"id": "user-001", "username": "example_user"} |
| metadata | object | 元数据信息 | {"viewCount": 100, "forkCount": 5} |
| currentVersion | object | 当前版本信息 | {"number": 1, "createdAt": "..."} |

#### 响应码
| 状态码 | 描述 | 说明 |
|--------|------|------|
| 200 | 成功 | 成功获取代码片段 |
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
# 访问公开代码片段
curl -X GET 'https://api.codewave.com/v1/code-snippets/snippet-001'

# 访问私有代码片段
curl -X GET 'https://api.codewave.com/v1/code-snippets/snippet-001' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...'
```

#### 响应示例
```json
{
  "data": {
    "id": "snippet-001",
    "title": "Example Snippet",
    "content": "print('Hello, World!')",
    "language": "python",
    "description": "A simple hello world example",
    "tags": ["example", "tutorial"],
    "isPublic": true,
    "createdAt": "2024-01-09T10:00:00Z",
    "updatedAt": "2024-01-09T10:00:00Z",
    "creator": {
      "id": "user-001",
      "username": "example_user"
    },
    "metadata": {
      "viewCount": 100,
      "forkCount": 5,
      "likeCount": 10
    },
    "currentVersion": {
      "number": 1,
      "createdAt": "2024-01-09T10:00:00Z"
    }
  }
}
```

### 注意事项
- 访问私有代码片段需要提供有效的认证token
- 每次访问会增加代码片段的查看次数
- 返回的代码内容会进行安全处理，移除潜在的恶意代码

### 变更历史
| 版本 | 变更时间 | 变更内容 | 负责人 |
|------|----------|----------|--------|
| v1.0 | 2024-01-09 | 创建接口 | Hardy | 