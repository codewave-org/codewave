import { EventPriority, IEvent } from '../types/event';
import {
  IBatchProcessResult,
  IEventQueryOptions,
  IEventStore,
  IEventStoreConfig,
} from '../types/store';

/**
 * 内存事件存储实现
 */
export class MemoryEventStore implements IEventStore {
  private events: IEvent[] = [];
  private config: Required<IEventStoreConfig>;

  constructor(config?: IEventStoreConfig) {
    this.config = {
      maxHistorySize: 1000,
      batchSize: 100,
      batchDelay: 1000,
      enableCompression: false,
      ...config,
    };
  }

  /**
   * 添加单个事件
   */
  async add(event: IEvent): Promise<void> {
    this.events.push(event);
    await this.ensureSize();
  }

  /**
   * 批量添加事件
   */
  async addBatch(events: IEvent[]): Promise<IBatchProcessResult> {
    const result: IBatchProcessResult = {
      processed: 0,
      failed: [],
    };

    // 先添加所有事件
    for (const event of events) {
      try {
        this.events.push(event);
        result.processed++;
      } catch (error) {
        result.failed.push({
          event,
          error: error instanceof Error ? error : new Error('Unknown error'),
        });
      }
    }

    // 然后一次性处理大小限制
    await this.ensureSize();

    return result;
  }

  /**
   * 获取事件历史
   */
  async getHistory(options: IEventQueryOptions = {}): Promise<IEvent[]> {
    let filtered = this.events;

    // 按时间过滤
    if (options.startTime !== undefined) {
      filtered = filtered.filter((e) => e.timestamp >= options.startTime!);
    }
    if (options.endTime !== undefined) {
      filtered = filtered.filter((e) => e.timestamp <= options.endTime!);
    }

    // 按类型过滤
    if (options.types?.length) {
      filtered = filtered.filter((e) => options.types!.includes(e.type));
    }

    // 按优先级过滤
    if (options.priority !== undefined) {
      filtered = filtered.filter((e) => e.priority === options.priority);
    }

    // 分页
    const offset = options.offset || 0;
    const limit = options.limit || filtered.length;

    return filtered.slice(offset, offset + limit);
  }

  /**
   * 清除历史记录
   */
  async clearHistory(): Promise<void> {
    this.events = [];
  }

  /**
   * 获取存储统计信息
   */
  async getStats(): Promise<{
    totalEvents: number;
    oldestEvent: IEvent | null;
    newestEvent: IEvent | null;
    storageSize: number;
  }> {
    return {
      totalEvents: this.events.length,
      oldestEvent: this.events[0] || null,
      newestEvent: this.events[this.events.length - 1] || null,
      storageSize: this.estimateSize(),
    };
  }

  /**
   * 压缩存储
   * 对于内存存储，我们通过移除低优先级的旧事件来实现压缩
   */
  async compress(): Promise<void> {
    if (!this.config.enableCompression) return;

    const threshold = this.config.maxHistorySize * 0.8;
    if (this.events.length <= threshold) return;

    // 按时间戳排序
    const sortedEvents = [...this.events].sort((a, b) => a.timestamp - b.timestamp);

    // 分离高优先级事件和低优先级事件
    const highPriorityEvents = sortedEvents.filter(
      (e) => e.priority === EventPriority.HIGH || e.priority === EventPriority.CRITICAL
    );

    // 如果高优先级事件已经超过阈值，只保留最新的事件
    if (highPriorityEvents.length > threshold) {
      this.events = highPriorityEvents.slice(-Math.floor(threshold));
      return;
    }

    // 计算还需要多少低优先级事件
    const remainingSlots = Math.floor(threshold) - highPriorityEvents.length;
    const lowPriorityEvents = sortedEvents.filter(
      (e) => e.priority !== EventPriority.HIGH && e.priority !== EventPriority.CRITICAL
    );

    // 合并事件并保持时间顺序
    this.events = [...highPriorityEvents, ...lowPriorityEvents.slice(-remainingSlots)].sort(
      (a, b) => a.timestamp - b.timestamp
    );
  }

  /**
   * 清理过期数据
   */
  async cleanup(beforeTime: number): Promise<number> {
    const originalLength = this.events.length;
    this.events = this.events.filter((e) => e.timestamp > beforeTime);
    return originalLength - this.events.length;
  }

  /**
   * 确保存储大小不超过限制
   */
  private async ensureSize(): Promise<void> {
    if (this.events.length > this.config.maxHistorySize) {
      if (this.config.enableCompression) {
        await this.compress();
      }

      // 如果仍然超过限制，直接移除最旧的事件
      if (this.events.length > this.config.maxHistorySize) {
        const excess = this.events.length - this.config.maxHistorySize;
        this.events.splice(0, excess);
      }
    }
  }

  /**
   * 估算存储大小（字节）
   */
  private estimateSize(): number {
    return this.events.reduce((size, event) => {
      // 粗略估算每个事件对象的大小
      return size + JSON.stringify(event).length * 2; // UTF-16 编码，每个字符2字节
    }, 0);
  }
}
