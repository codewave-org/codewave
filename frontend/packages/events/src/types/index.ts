export enum EventType {
  SYSTEM = 'system',
  USER = 'user',
  EDITOR = 'editor',
  LEARNING = 'learning',
  AI = 'ai'
}

export enum EventPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 3
}

export interface IEvent {
  id: string;
  type: EventType;
  subtype: string;
  timestamp: number;
  priority: EventPriority;
  metadata?: Record<string, any>;
}

export interface IEventHandler<T extends IEvent = IEvent> {
  handle(event: T): void | Promise<void>;
} 