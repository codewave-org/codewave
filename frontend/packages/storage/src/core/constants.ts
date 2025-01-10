// 数据库配置
export const DB_CONFIG = {
  name: 'codewave_db',
  version: 1,
  stores: {
    snippets: 'snippets',
    versions: 'versions',
    tags: 'tags',
  },
} as const;

// 本地存储键
export const STORAGE_KEYS = {
  config: 'codewave_config',
  theme: 'codewave_theme',
  recentSnippets: 'codewave_recent_snippets',
  favoriteTags: 'codewave_favorite_tags',
} as const;

// 默认配置
export const DEFAULT_CONFIG = {
  theme: 'light',
  editor_preferences: {
    theme: 'vs',
    fontSize: 14,
    tabSize: 2,
    wordWrap: true,
    lineNumbers: true,
    minimap: true,
  },
  recent_snippets: [],
  favorite_tags: [],
} as const;

// 错误消息
export const ERROR_MESSAGES = {
  DB_CONNECTION: 'Failed to connect to the database',
  DB_UPGRADE: 'Failed to upgrade the database',
  INVALID_DATA: 'Invalid data format',
  NOT_FOUND: 'Resource not found',
  STORAGE_FULL: 'Local storage is full',
} as const;
