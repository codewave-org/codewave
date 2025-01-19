import { Observable } from 'rxjs';
import { EventType, IEvent, IEventHandler } from './event';

/**
 * 事件总线配置接口
 */
export interface IEventBusOptions {
  /** 是否启用批处理 */
  enableBatching?: boolean;

  /** 批处理间隔（毫秒） */
  batchInterval?: number;

  /** 是否保留事件历史 */
  keepHistory?: boolean;

  /** 历史记录大小 */
  historySize?: number;
}

/**
 * 事件订阅选项
 */
export interface ISubscriptionOptions {
  /** 是否只处理一次 */
  once?: boolean;

  /** 处理器优先级 */
  priority?: number;
}

/**
 * 事件总线接口
 */
export interface IEventBus {
  /** 发布事件 */
  publish<T>(event: IEvent<T>): void;

  /** 订阅特定类型的事件 */
  subscribe<T>(
    type: EventType,
    handler: IEventHandler<T>,
    options?: ISubscriptionOptions
  ): () => void;

  /** 取消订阅 */
  unsubscribe(type: EventType, handlerId: string): void;

  /** 获取事件流 */
  asObservable<T>(type: EventType): Observable<IEvent<T>>;

  /** 清除所有订阅 */
  clear(): void;

  /** 获取事件历史 */
  getHistory(): IEvent[];

  /** 清除事件历史 */
  clearHistory(): void;
}
