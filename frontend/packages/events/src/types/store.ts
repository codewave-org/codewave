import { IEvent } from './event';

/**
 * 事件存储配置
 */
export interface IEventStoreConfig {
  /** 最大历史记录数 */
  maxHistorySize?: number;

  /** 批处理大小 */
  batchSize?: number;

  /** 批处理延迟（毫秒） */
  batchDelay?: number;

  /** 是否启用压缩 */
  enableCompression?: boolean;
}

/**
 * 事件查询选项
 */
export interface IEventQueryOptions {
  /** 开始时间 */
  startTime?: number;

  /** 结束时间 */
  endTime?: number;

  /** 事件类型 */
  types?: string[];

  /** 优先级 */
  priority?: number;

  /** 分页大小 */
  limit?: number;

  /** 分页偏移 */
  offset?: number;
}

/**
 * 事件批处理结果
 */
export interface IBatchProcessResult {
  /** 成功处理的事件数 */
  processed: number;

  /** 失败的事件 */
  failed: Array<{
    event: IEvent;
    error: Error;
  }>;
}

/**
 * 事件存储接口
 */
export interface IEventStore {
  /** 添加事件到存储 */
  add(event: IEvent): Promise<void>;

  /** 批量添加事件 */
  addBatch(events: IEvent[]): Promise<IBatchProcessResult>;

  /** 获取事件历史 */
  getHistory(options?: IEventQueryOptions): Promise<IEvent[]>;

  /** 清除历史记录 */
  clearHistory(): Promise<void>;

  /** 获取存储统计信息 */
  getStats(): Promise<{
    totalEvents: number;
    oldestEvent: IEvent | null;
    newestEvent: IEvent | null;
    storageSize: number;
  }>;

  /** 压缩存储 */
  compress(): Promise<void>;

  /** 清理过期数据 */
  cleanup(beforeTime: number): Promise<number>;
}
