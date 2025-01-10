import { z } from 'zod';

// 基础类型
export const BaseSchema = z.object({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// 代码片段
export const SnippetSchema = BaseSchema.extend({
  title: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  content: z.string(),
  language: z.string(),
  tags: z.array(z.string()),
});

export type Snippet = z.infer<typeof SnippetSchema>;

// 版本元数据
export const VersionMetadataSchema = z.object({
  changes: z.array(z.string()), // 变更说明
  size: z.number().int().positive(), // 内容大小（字节）
  hash: z.string().optional(), // 内容哈希，由系统自动计算
});

// 版本
export const VersionSchema = BaseSchema.extend({
  snippet_id: z.string().uuid(),
  content: z.string(),
  description: z.string().max(1000).optional(),
  version_number: z.number().int().positive(),
  parent_version_id: z.string().uuid().optional(),
  metadata: VersionMetadataSchema,
});

export type Version = z.infer<typeof VersionSchema>;
export type VersionMetadata = z.infer<typeof VersionMetadataSchema>;

// 标签
export const TagSchema = BaseSchema.extend({
  name: z.string().min(1).max(50),
});

export type Tag = z.infer<typeof TagSchema>;

// 配置
export const EditorPreferencesSchema = z.object({
  theme: z.string(),
  fontSize: z.number(),
  tabSize: z.number(),
  wordWrap: z.boolean(),
  lineNumbers: z.boolean(),
  minimap: z.boolean(),
});

export const ConfigSchema = z.object({
  theme: z.string(),
  editor_preferences: EditorPreferencesSchema,
  recent_snippets: z.array(z.string().uuid()),
  favorite_tags: z.array(z.string()),
});

export type Config = z.infer<typeof ConfigSchema>;
export type EditorPreferences = z.infer<typeof EditorPreferencesSchema>;
