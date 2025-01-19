import { Observable, Subject, filter } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { EventPriority, IEvent, IEventHandler, IPartialEvent } from '../types/event';

interface ISubscription {
  id: string;
  type: string;
  handler: IEventHandler;
  once?: boolean;
}

/**
 * 事件总线实现
 */
export class EventBus {
  private subject = new Subject<IEvent>();
  private subscriptions = new Map<string, ISubscription>();

  /**
   * 发布事件
   */
  publish<T>(event: IPartialEvent<T>): void {
    // 确保事件有ID
    if (!event.id) {
      event.id = uuidv4();
    }
    // 确保事件有时间戳
    if (!event.timestamp) {
      event.timestamp = Date.now();
    }
    // 确保事件有优先级
    if (event.priority === undefined) {
      event.priority = EventPriority.NORMAL;
    }

    const completeEvent = event as IEvent<T>;
    this.subject.next(completeEvent);

    // 处理所有订阅者
    this.subscriptions.forEach((subscription) => {
      if (subscription.type === event.type) {
        subscription.handler.handle(completeEvent);
        if (subscription.once) {
          this.subscriptions.delete(subscription.id);
        }
      }
    });
  }

  /**
   * 订阅事件
   */
  subscribe<T>(
    type: string,
    handler: IEventHandler<T>,
    options: { once?: boolean; priority?: number } = {}
  ): () => void {
    const id = handler.id || uuidv4();
    const subscription: ISubscription = {
      id,
      type,
      handler: {
        ...handler,
        id,
        priority: options.priority ?? handler.priority ?? EventPriority.NORMAL,
      },
      once: options.once,
    };

    this.subscriptions.set(id, subscription);

    return () => this.unsubscribe(type, id);
  }

  /**
   * 取消订阅
   */
  unsubscribe(type: string, handlerId: string): void {
    const subscription = this.subscriptions.get(handlerId);
    if (subscription && subscription.type === type) {
      this.subscriptions.delete(handlerId);
    }
  }

  /**
   * 获取事件流
   */
  asObservable<T>(type: string): Observable<IEvent<T>> {
    return this.subject.pipe(filter((event) => event.type === type)) as Observable<IEvent<T>>;
  }

  /**
   * 清除所有订阅
   */
  clear(): void {
    this.subscriptions.clear();
  }

  /**
   * 获取订阅数量
   */
  getSubscriptionCount(): number {
    return this.subscriptions.size;
  }

  /**
   * 获取特定类型的订阅数量
   */
  getTypeSubscriptionCount(type: string): number {
    return Array.from(this.subscriptions.values()).filter((sub) => sub.type === type).length;
  }
}
