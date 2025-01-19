# 创建代码片段

## 创建新的代码片段

### 基本信息
- 接口描述：创建一个新的代码片段
- 请求方法：POST
- 请求路径：/api/v1/code-snippets
- 需要认证：是
- 权限要求：已登录用户

### 请求参数

#### 请求头
| 参数名 | 类型 | 必填 | 描述 | 示例 |
|--------|------|------|------|------|
| Authorization | string | 是 | Bearer Token | Bearer eyJhbGciOiJIUzI1NiJ9... |
| Content-Type | string | 是 | 内容类型 | application/json |

#### 请求体
```json
{
  "title": "Example Snippet",
  "content": "print('Hello, World!')",
  "language": "python",
  "description": "A simple hello world example",
  "tags": ["example", "tutorial"],
  "isPublic": true
}
```

| 字段名 | 类型 | 必填 | 描述 | 示例 |
|--------|------|------|------|------|
| title | string | 是 | 代码片段标题 | "Example Snippet" |
| content | string | 是 | 代码内容 | "print('Hello, World!')" |
| language | string | 是 | 编程语言 | "python" |
| description | string | 否 | 代码片段描述 | "A simple hello world example" |
| tags | array | 否 | 标签列表 | ["example", "tutorial"] |
| isPublic | boolean | 否 | 是否公开，默认 true | true |

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
    }
  }
}
```

| 字段名 | 类型 | 描述 | 示例 |
|--------|------|------|------|
| id | string | 代码片段ID | "snippet-001" |
| title | string | 标题 | "Example Snippet" |
| content | string | 代码内容 | "print('Hello, World!')" |
| language | string | 编程语言 | "python" |
| description | string | 描述 | "A simple hello world example" |
| tags | array | 标签列表 | ["example", "tutorial"] |
| isPublic | boolean | 是否公开 | true |
| createdAt | string | 创建时间 | "2024-01-09T10:00:00Z" |
| updatedAt | string | 更新时间 | "2024-01-09T10:00:00Z" |
| creator | object | 创建者信息 | {"id": "user-001", "username": "example_user"} |

#### 响应码
| 状态码 | 描述 | 说明 |
|--------|------|------|
| 201 | 创建成功 | 代码片段创建成功 |
| 400 | 请求参数错误 | 请求参数不符合要求 |
| 401 | 未认证 | 用户未登录或 token 无效 |
| 403 | 未授权 | 用户无权限创建代码片段 |

#### 错误码
| 错误码 | 描述 | 解决方案 |
|--------|------|----------|
| INVALID_TITLE | 标题无效 | 确保标题不为空且长度在 1-100 字符之间 |
| INVALID_CONTENT | 内容无效 | 确保代码内容不为空且长度在 1-10000 字符之间 |
| INVALID_LANGUAGE | 语言无效 | 使用支持的编程语言 |
| INVALID_TAGS | 标签无效 | 确保每个标签长度在 1-20 字符之间 |

### 示例

#### 请求示例
```bash
curl -X POST 'https://api.codewave.com/v1/code-snippets' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Example Snippet",
    "content": "print('\''Hello, World!'\'')",
    "language": "python",
    "description": "A simple hello world example",
    "tags": ["example", "tutorial"],
    "isPublic": true
  }'
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
    }
  }
}
```

### 注意事项
- 代码内容会进行安全检查，禁止包含恶意代码
- 标签数量限制为最多 5 个
- 创建后的代码片段默认为公开状态

### 变更历史
| 版本 | 变更时间 | 变更内容 | 负责人 |
|------|----------|----------|--------|
| v1.0 | 2024-01-09 | 创建接口 | Hardy | 