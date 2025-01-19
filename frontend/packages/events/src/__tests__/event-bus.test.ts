import { EventBus } from '../bus/event-bus';
import { EventPriority, EventType, IEvent, IEventHandler } from '../types/event';

describe('EventBus', () => {
  let eventBus: EventBus;

  beforeEach(() => {
    eventBus = new EventBus();
  });

  afterEach(() => {
    eventBus.clear();
  });

  describe('publish and subscribe', () => {
    it('should handle basic publish/subscribe', () => {
      const event = {
        type: EventType.EDITOR_CHANGE,
        payload: { text: 'test' },
      };

      let received = false;
      const handler: IEventHandler = {
        handle: (receivedEvent: IEvent) => {
          expect(receivedEvent.type).toBe(event.type);
          expect(receivedEvent.payload).toEqual(event.payload);
          received = true;
        },
      };

      eventBus.subscribe(EventType.EDITOR_CHANGE, handler);
      eventBus.publish(event);
      expect(received).toBe(true);
    });

    it('should handle multiple subscribers', () => {
      const event = {
        type: EventType.EDITOR_CHANGE,
        payload: { text: 'test' },
      };

      let count = 0;
      const handler: IEventHandler = {
        handle: () => {
          count++;
        },
      };

      const unsubscribe1 = eventBus.subscribe(EventType.EDITOR_CHANGE, handler);
      const unsubscribe2 = eventBus.subscribe(EventType.EDITOR_CHANGE, handler);

      eventBus.publish(event);
      expect(count).toBe(2);

      // 测试取消订阅函数
      unsubscribe1();
      unsubscribe2();
      eventBus.publish(event);
      expect(count).toBe(2);
    });

    it('should handle once subscription', () => {
      const event = {
        type: EventType.EDITOR_CHANGE,
        payload: { text: 'test' },
      };

      let count = 0;
      const handler: IEventHandler = {
        handle: () => {
          count++;
        },
      };

      eventBus.subscribe(EventType.EDITOR_CHANGE, handler, { once: true });

      eventBus.publish(event);
      eventBus.publish(event);

      expect(count).toBe(1);
    });
  });

  describe('unsubscribe', () => {
    it('should handle unsubscribe', () => {
      const event = {
        type: EventType.EDITOR_CHANGE,
        payload: { text: 'test' },
      };

      let count = 0;
      const handler: IEventHandler = {
        id: 'test-handler',
        handle: () => {
          count++;
        },
      };

      eventBus.subscribe(EventType.EDITOR_CHANGE, handler);
      eventBus.unsubscribe(EventType.EDITOR_CHANGE, 'test-handler');

      eventBus.publish(event);
      expect(count).toBe(0);
    });

    it('should not unsubscribe with wrong type', () => {
      const event = {
        type: EventType.EDITOR_CHANGE,
        payload: { text: 'test' },
      };

      let count = 0;
      const handler: IEventHandler = {
        id: 'test-handler',
        handle: () => {
          count++;
        },
      };

      eventBus.subscribe(EventType.EDITOR_CHANGE, handler);
      eventBus.unsubscribe(EventType.CODE_LINT, 'test-handler');

      eventBus.publish(event);
      expect(count).toBe(1);
    });
  });

  describe('asObservable', () => {
    it('should return observable for specific event type', (done) => {
      const event = {
        type: EventType.EDITOR_CHANGE,
        payload: { text: 'test' },
      };

      eventBus.asObservable(EventType.EDITOR_CHANGE).subscribe((receivedEvent) => {
        expect(receivedEvent.type).toBe(event.type);
        expect(receivedEvent.payload).toEqual(event.payload);
        done();
      });

      eventBus.publish(event);
    });

    it('should not receive events of different type', (done) => {
      const event = {
        type: EventType.CODE_LINT,
        payload: { text: 'test' },
      };

      let received = false;
      eventBus.asObservable(EventType.EDITOR_CHANGE).subscribe(() => {
        received = true;
      });

      eventBus.publish(event);

      setTimeout(() => {
        expect(received).toBe(false);
        done();
      }, 100);
    });
  });

  describe('subscription counts', () => {
    it('should track total subscription count', () => {
      const handler: IEventHandler = {
        handle: () => {},
      };

      eventBus.subscribe(EventType.EDITOR_CHANGE, handler);
      eventBus.subscribe(EventType.CODE_LINT, handler);

      expect(eventBus.getSubscriptionCount()).toBe(2);
    });

    it('should track type-specific subscription count', () => {
      const handler: IEventHandler = {
        handle: () => {},
      };

      eventBus.subscribe(EventType.EDITOR_CHANGE, handler);
      eventBus.subscribe(EventType.EDITOR_CHANGE, handler);
      eventBus.subscribe(EventType.CODE_LINT, handler);

      expect(eventBus.getTypeSubscriptionCount(EventType.EDITOR_CHANGE)).toBe(2);
      expect(eventBus.getTypeSubscriptionCount(EventType.CODE_LINT)).toBe(1);
    });
  });

  describe('event enrichment', () => {
    it('should add missing event properties', () => {
      const event = {
        type: EventType.EDITOR_CHANGE,
        payload: { text: 'test' },
      };

      const handler: IEventHandler = {
        handle: (receivedEvent: IEvent) => {
          expect(receivedEvent.id).toBeDefined();
          expect(receivedEvent.timestamp).toBeDefined();
          expect(receivedEvent.priority).toBe(EventPriority.NORMAL);
        },
      };

      eventBus.subscribe(EventType.EDITOR_CHANGE, handler);
      eventBus.publish(event);
    });
  });
});
