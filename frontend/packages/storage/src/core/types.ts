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

// 版本
export const VersionSchema = BaseSchema.extend({
  snippet_id: z.string().uuid(),
  content: z.string(),
  description: z.string().max(1000).optional(),
});

export type Version = z.infer<typeof VersionSchema>;

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
