import { EventAnalyzer } from '../analytics/analyzer';
import { EventPriority, EventType, IEvent } from '../types/event';

describe('EventAnalyzer', () => {
  let analyzer: EventAnalyzer;

  beforeEach(() => {
    analyzer = new EventAnalyzer();
  });

  describe('analyze', () => {
    it('should return empty result for empty events array', () => {
      const result = analyzer.analyze([]);
      expect(result.totalEvents).toBe(0);
      expect(result.typeDistribution.size).toBe(0);
      expect(result.priorityDistribution.size).toBe(0);
      expect(result.timeRange.start).toBe(0);
      expect(result.timeRange.end).toBe(0);
      expect(result.patterns).toHaveLength(0);
    });

    it('should correctly analyze event type distribution', () => {
      const events: IEvent[] = [
        {
          type: EventType.EDITOR_CHANGE,
          payload: {},
          timestamp: 1000,
          priority: EventPriority.NORMAL,
        },
        {
          type: EventType.EDITOR_CHANGE,
          payload: {},
          timestamp: 2000,
          priority: EventPriority.NORMAL,
        },
        {
          type: EventType.CODE_LINT,
          payload: {},
          timestamp: 3000,
          priority: EventPriority.HIGH,
        },
      ];

      const result = analyzer.analyze(events);
      expect(result.totalEvents).toBe(3);
      expect(result.typeDistribution.get(EventType.EDITOR_CHANGE)).toBe(2);
      expect(result.typeDistribution.get(EventType.CODE_LINT)).toBe(1);
    });

    it('should correctly analyze priority distribution', () => {
      const events: IEvent[] = [
        {
          type: EventType.EDITOR_CHANGE,
          payload: {},
          timestamp: 1000,
          priority: EventPriority.NORMAL,
        },
        {
          type: EventType.CODE_LINT,
          payload: {},
          timestamp: 2000,
          priority: EventPriority.HIGH,
        },
        {
          type: EventType.SYSTEM_ERROR,
          payload: {},
          timestamp: 3000,
          priority: EventPriority.CRITICAL,
        },
      ];

      const result = analyzer.analyze(events);
      expect(result.priorityDistribution.get(EventPriority.NORMAL)).toBe(1);
      expect(result.priorityDistribution.get(EventPriority.HIGH)).toBe(1);
      expect(result.priorityDistribution.get(EventPriority.CRITICAL)).toBe(1);
    });

    it('should correctly analyze time range', () => {
      const events: IEvent[] = [
        {
          type: EventType.EDITOR_CHANGE,
          payload: {},
          timestamp: 1000,
        },
        {
          type: EventType.CODE_LINT,
          payload: {},
          timestamp: 2000,
        },
      ];

      const result = analyzer.analyze(events);
      expect(result.timeRange.start).toBe(1000);
      expect(result.timeRange.end).toBe(2000);
    });
  });

  describe('pattern detection', () => {
    it('should detect consecutive events', () => {
      const events: IEvent[] = [
        {
          type: EventType.EDITOR_CHANGE,
          payload: {},
          timestamp: 1000,
        },
        {
          type: EventType.EDITOR_CHANGE,
          payload: {},
          timestamp: 2000,
        },
        {
          type: EventType.EDITOR_CHANGE,
          payload: {},
          timestamp: 3000,
        },
      ];

      const result = analyzer.analyze(events);
      const consecutivePattern = result.patterns.find((p) => p.id.startsWith('consecutive'));
      expect(consecutivePattern).toBeDefined();
      expect(consecutivePattern?.events).toHaveLength(3);
    });

    it('should detect periodic events', () => {
      const events: IEvent[] = [
        {
          type: EventType.CODE_LINT,
          payload: {},
          timestamp: 1000,
        },
        {
          type: EventType.CODE_LINT,
          payload: {},
          timestamp: 2000,
        },
        {
          type: EventType.CODE_LINT,
          payload: {},
          timestamp: 3000,
        },
      ];

      const result = analyzer.analyze(events);
      const periodicPattern = result.patterns.find((p) => p.id.startsWith('periodic'));
      expect(periodicPattern).toBeDefined();
      expect(periodicPattern?.confidence).toBeGreaterThan(0.8);
    });

    it('should detect related events', () => {
      const relatedId = 'test-123';
      const events: IEvent[] = [
        {
          type: EventType.EDITOR_CHANGE,
          payload: {},
          timestamp: 1000,
          relatedEventId: relatedId,
        },
        {
          type: EventType.CODE_LINT,
          payload: {},
          timestamp: 2000,
          relatedEventId: relatedId,
        },
      ];

      const result = analyzer.analyze(events);
      const relatedPattern = result.patterns.find((p) => p.id === `related-${relatedId}`);
      expect(relatedPattern).toBeDefined();
      expect(relatedPattern?.events).toHaveLength(2);
      expect(relatedPattern?.confidence).toBe(1);
    });
  });
});
