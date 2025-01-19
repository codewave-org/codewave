import { MemoryEventStore } from '../store/memory';
import { EventPriority, EventType, IEvent } from '../types/event';

describe('MemoryEventStore', () => {
  let store: MemoryEventStore;

  beforeEach(() => {
    store = new MemoryEventStore({
      maxHistorySize: 5,
      batchSize: 2,
      batchDelay: 100,
      enableCompression: true,
    });
  });

  afterEach(async () => {
    await store.clearHistory();
  });

  describe('add and getHistory', () => {
    it('should store and retrieve events', async () => {
      const event: IEvent = {
        type: EventType.EDITOR_CHANGE,
        payload: { text: 'test' },
        timestamp: Date.now(),
        priority: EventPriority.NORMAL,
      };

      await store.add(event);
      const history = await store.getHistory();

      expect(history).toHaveLength(1);
      expect(history[0]).toEqual(event);
    });

    it('should handle query options', async () => {
      const now = Date.now();
      const events: IEvent[] = [
        {
          type: EventType.EDITOR_CHANGE,
          payload: { text: 'test1' },
          timestamp: now - 2000,
          priority: EventPriority.LOW,
        },
        {
          type: EventType.EDITOR_CHANGE,
          payload: { text: 'test2' },
          timestamp: now - 1000,
          priority: EventPriority.NORMAL,
        },
        {
          type: EventType.CODE_LINT,
          payload: { text: 'test3' },
          timestamp: now,
          priority: EventPriority.HIGH,
        },
      ];

      await store.addBatch(events);

      // 测试时间范围过滤
      let filtered = await store.getHistory({
        startTime: now - 1500,
        endTime: now - 500,
      });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].payload.text).toBe('test2');

      // 测试类型过滤
      filtered = await store.getHistory({
        types: [EventType.CODE_LINT],
      });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].payload.text).toBe('test3');

      // 测试优先级过滤
      filtered = await store.getHistory({
        priority: EventPriority.NORMAL,
      });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].payload.text).toBe('test2');

      // 测试分页
      filtered = await store.getHistory({
        offset: 1,
        limit: 1,
      });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].payload.text).toBe('test2');
    });
  });

  describe('addBatch', () => {
    it('should handle batch processing', async () => {
      const events: IEvent[] = [
        {
          type: EventType.EDITOR_CHANGE,
          payload: { text: 'test1' },
          timestamp: Date.now(),
          priority: EventPriority.NORMAL,
        },
        {
          type: EventType.EDITOR_CHANGE,
          payload: { text: 'test2' },
          timestamp: Date.now(),
          priority: EventPriority.NORMAL,
        },
      ];

      const result = await store.addBatch(events);
      expect(result.processed).toBe(2);
      expect(result.failed).toHaveLength(0);

      const history = await store.getHistory();
      expect(history).toHaveLength(2);
    });
  });

  describe('size management', () => {
    it('should respect maxHistorySize', async () => {
      const events: IEvent[] = Array.from({ length: 6 }, (_, i) => ({
        type: EventType.EDITOR_CHANGE,
        payload: { text: `test${i}` },
        timestamp: Date.now() + i,
        priority: EventPriority.NORMAL,
      }));

      await store.addBatch(events);
      const history = await store.getHistory();

      // 由于maxHistorySize为5，最旧的事件应该被移除
      expect(history.length).toBeLessThanOrEqual(5);
      expect(history[history.length - 1].payload.text).toBe('test5');
    });

    it('should handle compression', async () => {
      const events: IEvent[] = Array.from({ length: 6 }, (_, i) => ({
        type: EventType.EDITOR_CHANGE,
        payload: { text: `test${i}` },
        timestamp: Date.now() + i,
        priority: i === 0 ? EventPriority.CRITICAL : EventPriority.LOW,
      }));

      await store.addBatch(events);
      await store.compress();
      const history = await store.getHistory();

      // 应该保留关键优先级的事件和最新的事件
      const criticalEvents = history.filter((e) => e.priority === EventPriority.CRITICAL);
      expect(criticalEvents).toHaveLength(1);
      expect(criticalEvents[0].payload.text).toBe('test0');

      // 总事件数不应超过maxHistorySize
      expect(history.length).toBeLessThanOrEqual(5);

      // 最新的事件应该被保留
      expect(history[history.length - 1].payload.text).toBe('test5');
    });
  });

  describe('cleanup', () => {
    it('should remove events before specified time', async () => {
      const now = Date.now();
      const events: IEvent[] = [
        {
          type: EventType.EDITOR_CHANGE,
          payload: { text: 'old' },
          timestamp: now - 1000,
          priority: EventPriority.NORMAL,
        },
        {
          type: EventType.EDITOR_CHANGE,
          payload: { text: 'new' },
          timestamp: now,
          priority: EventPriority.NORMAL,
        },
      ];

      await store.addBatch(events);
      const removed = await store.cleanup(now - 500);
      expect(removed).toBe(1);

      const history = await store.getHistory();
      expect(history).toHaveLength(1);
      expect(history[0].payload.text).toBe('new');
    });
  });

  describe('stats', () => {
    it('should return correct stats', async () => {
      const now = Date.now();
      const events: IEvent[] = [
        {
          type: EventType.EDITOR_CHANGE,
          payload: { text: 'first' },
          timestamp: now - 1000,
          priority: EventPriority.NORMAL,
        },
        {
          type: EventType.EDITOR_CHANGE,
          payload: { text: 'last' },
          timestamp: now,
          priority: EventPriority.NORMAL,
        },
      ];

      await store.addBatch(events);
      const stats = await store.getStats();

      expect(stats.totalEvents).toBe(2);
      expect(stats.oldestEvent?.payload.text).toBe('first');
      expect(stats.newestEvent?.payload.text).toBe('last');
      expect(stats.storageSize).toBeGreaterThan(0);
    });
  });
});
