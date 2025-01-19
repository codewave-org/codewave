# 更新代码片段

## 更新代码片段信息

### 基本信息
- 接口描述：更新现有代码片段的信息，包括代码内容、标题等
- 请求方法：PUT
- 请求路径：/api/v1/code-snippets/{id}
- 需要认证：是
- 权限要求：代码片段创建者

### 请求参数

#### 路径参数
| 参数名 | 类型 | 必填 | 描述 | 示例 |
|--------|------|------|------|------|
| id | string | 是 | 代码片段ID | snippet-001 |

#### 请求头
| 参数名 | 类型 | 必填 | 描述 | 示例 |
|--------|------|------|------|------|
| Authorization | string | 是 | Bearer Token | Bearer eyJhbGciOiJIUzI1NiJ9... |
| Content-Type | string | 是 | 内容类型 | application/json |

#### 请求体
```json
{
  "title": "Updated Example Snippet",
  "content": "print('Hello, Updated World!')",
  "language": "python",
  "description": "An updated hello world example",
  "tags": ["example", "tutorial", "updated"],
  "isPublic": true,
  "versionNote": "Updated print message"
}
```

| 字段名 | 类型 | 必填 | 描述 | 示例 |
|--------|------|------|------|------|
| title | string | 否 | 代码片段标题 | "Updated Example Snippet" |
| content | string | 否 | 代码内容 | "print('Hello, Updated World!')" |
| language | string | 否 | 编程语言 | "python" |
| description | string | 否 | 代码片段描述 | "An updated hello world example" |
| tags | array | 否 | 标签列表 | ["example", "tutorial", "updated"] |
| isPublic | boolean | 否 | 是否公开 | true |
| versionNote | string | 否 | 版本更新说明 | "Updated print message" |

### 响应信息

#### 响应体
```json
{
  "data": {
    "id": "snippet-001",
    "title": "Updated Example Snippet",
    "content": "print('Hello, Updated World!')",
    "language": "python",
    "description": "An updated hello world example",
    "tags": ["example", "tutorial", "updated"],
    "isPublic": true,
    "createdAt": "2024-01-09T10:00:00Z",
    "updatedAt": "2024-01-09T11:00:00Z",
    "creator": {
      "id": "user-001",
      "username": "example_user"
    },
    "currentVersion": {
      "number": 2,
      "createdAt": "2024-01-09T11:00:00Z",
      "note": "Updated print message"
    }
  }
}
```

| 字段名 | 类型 | 描述 | 示例 |
|--------|------|------|------|
| id | string | 代码片段ID | "snippet-001" |
| title | string | 更新后的标题 | "Updated Example Snippet" |
| content | string | 更新后的代码内容 | "print('Hello, Updated World!')" |
| language | string | 编程语言 | "python" |
| description | string | 更新后的描述 | "An updated hello world example" |
| tags | array | 更新后的标签列表 | ["example", "tutorial", "updated"] |
| isPublic | boolean | 是否公开 | true |
| createdAt | string | 创建时间 | "2024-01-09T10:00:00Z" |
| updatedAt | string | 更新时间 | "2024-01-09T11:00:00Z" |
| creator | object | 创建者信息 | {"id": "user-001", "username": "example_user"} |
| currentVersion | object | 当前版本信息 | {"number": 2, "createdAt": "..."} |

#### 响应码
| 状态码 | 描述 | 说明 |
|--------|------|------|
| 200 | 成功 | 更新成功 |
| 400 | 请求参数错误 | 请求参数不符合要求 |
| 401 | 未认证 | 用户未登录或token无效 |
| 403 | 未授权 | 无权更新该代码片段 |
| 404 | 未找到 | 代码片段不存在 |

#### 错误码
| 错误码 | 描述 | 解决方案 |
|--------|------|----------|
| SNIPPET_NOT_FOUND | 代码片段不存在 | 检查代码片段ID是否正确 |
| INVALID_TITLE | 标题无效 | 确保标题不为空且长度在 1-100 字符之间 |
| INVALID_CONTENT | 内容无效 | 确保代码内容不为空且长度在 1-10000 字符之间 |
| INVALID_LANGUAGE | 语言无效 | 使用支持的编程语言 |
| INVALID_TAGS | 标签无效 | 确保每个标签长度在 1-20 字符之间 |

### 示例

#### 请求示例
```bash
curl -X PUT 'https://api.codewave.com/v1/code-snippets/snippet-001' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Updated Example Snippet",
    "content": "print('\''Hello, Updated World!'\'')",
    "description": "An updated hello world example",
    "tags": ["example", "tutorial", "updated"],
    "versionNote": "Updated print message"
  }'
```

#### 响应示例
```json
{
  "data": {
    "id": "snippet-001",
    "title": "Updated Example Snippet",
    "content": "print('Hello, Updated World!')",
    "language": "python",
    "description": "An updated hello world example",
    "tags": ["example", "tutorial", "updated"],
    "isPublic": true,
    "createdAt": "2024-01-09T10:00:00Z",
    "updatedAt": "2024-01-09T11:00:00Z",
    "creator": {
      "id": "user-001",
      "username": "example_user"
    },
    "currentVersion": {
      "number": 2,
      "createdAt": "2024-01-09T11:00:00Z",
      "note": "Updated print message"
    }
  }
}
```

### 注意事项
- 只有代码片段的创建者可以更新
- 每次更新都会创建新的版本记录
- 代码内容会进行安全检查
- 标签数量限制为最多 5 个
- 未提供的字段将保持原值不变

### 变更历史
| 版本 | 变更时间 | 变更内容 | 负责人 |
|------|----------|----------|--------|
| v1.0 | 2024-01-09 | 创建接口 | Hardy | 