/**
 * 事件类型枚举
 */
export enum EventType {
  // 编辑器事件
  EDITOR_CHANGE = 'editor:change',
  EDITOR_SAVE = 'editor:save',
  EDITOR_FOCUS = 'editor:focus',
  EDITOR_BLUR = 'editor:blur',

  // 代码事件
  CODE_LINT = 'code:lint',
  CODE_FORMAT = 'code:format',
  CODE_COMPLETE = 'code:complete',

  // 学习事件
  LEARNING_START = 'learning:start',
  LEARNING_COMPLETE = 'learning:complete',
  LEARNING_PROGRESS = 'learning:progress',

  // 系统事件
  SYSTEM_ERROR = 'system:error',
  SYSTEM_WARNING = 'system:warning',
  SYSTEM_INFO = 'system:info',
}

/**
 * 事件优先级
 */
export enum EventPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 3,
}

/**
 * 基础事件接口
 */
export interface IEvent<T = any> {
  /** 事件类型 */
  type: EventType;

  /** 事件数据 */
  payload: T;

  /** 事件时间戳 */
  timestamp: number;

  /** 事件优先级 */
  priority?: EventPriority;

  /** 事件源 */
  source?: string;

  /** 事件ID */
  id?: string;

  /** 关联事件ID */
  relatedEventId?: string;
}

/**
 * 未完整的事件接口
 * 用于事件发布时，允许省略某些字段，由EventBus自动补充
 */
export type IPartialEvent<T = any> = Omit<IEvent<T>, 'timestamp'> &
  Partial<Pick<IEvent<T>, 'timestamp'>>;

/**
 * 事件处理器接口
 */
export interface IEventHandler<T = any> {
  /** 处理事件 */
  handle(event: IEvent<T>): void | Promise<void>;

  /** 处理器优先级 */
  priority?: EventPriority;

  /** 处理器ID */
  id?: string;
}
