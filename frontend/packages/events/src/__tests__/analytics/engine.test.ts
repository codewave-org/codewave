import { AnalysisEngine } from '../../analytics/engine';
import { EventPriority, EventType, IEvent } from '../../types/event';

describe('AnalysisEngine', () => {
  let engine: AnalysisEngine;
  let mockEvents: IEvent[];

  beforeEach(() => {
    engine = new AnalysisEngine();
    const now = Date.now();
    mockEvents = [
      {
        type: EventType.EDITOR_CHANGE,
        payload: { text: 'test1' },
        timestamp: now,
        priority: EventPriority.NORMAL,
      },
      {
        type: EventType.EDITOR_CHANGE,
        payload: { text: 'test2' },
        timestamp: now + 100,
        priority: EventPriority.HIGH,
      },
      {
        type: EventType.EDITOR_SAVE,
        payload: { text: 'test3' },
        timestamp: now + 200,
        priority: EventPriority.NORMAL,
      },
    ];
  });

  describe('analyze', () => {
    it('should return empty result for empty events array', () => {
      const result = engine.analyze([]);
      expect(result.totalEvents).toBe(0);
      expect(result.typeDistribution.size).toBe(0);
      expect(result.priorityDistribution.size).toBe(0);
      expect(result.timeRange.start).toBe(0);
      expect(result.timeRange.end).toBe(0);
      expect(result.patterns).toEqual([]);
    });

    it('should analyze events correctly', () => {
      const result = engine.analyze(mockEvents);

      // Check total events
      expect(result.totalEvents).toBe(3);

      // Check type distribution
      expect(result.typeDistribution.get(EventType.EDITOR_CHANGE)).toBe(2);
      expect(result.typeDistribution.get(EventType.EDITOR_SAVE)).toBe(1);

      // Check priority distribution
      expect(result.priorityDistribution.get(EventPriority.NORMAL)).toBe(2);
      expect(result.priorityDistribution.get(EventPriority.HIGH)).toBe(1);

      // Check time range
      expect(result.timeRange.start).toBe(mockEvents[0].timestamp);
      expect(result.timeRange.end).toBe(mockEvents[2].timestamp);
    });
  });

  describe('findConsecutiveEvents', () => {
    it('should find consecutive events of the same type', () => {
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
          timestamp: Date.now() + 100,
          priority: EventPriority.NORMAL,
        },
        {
          type: EventType.EDITOR_CHANGE,
          payload: { text: 'test3' },
          timestamp: Date.now() + 200,
          priority: EventPriority.NORMAL,
        },
      ];

      const patterns = engine.findConsecutiveEvents(events);
      expect(patterns.length).toBe(1);
      expect(patterns[0].events.length).toBe(3);
      expect(patterns[0].name).toContain('Consecutive');
      expect(patterns[0].confidence).toBe(1.0);
    });

    it('should not find patterns with less than 3 consecutive events', () => {
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
          timestamp: Date.now() + 100,
          priority: EventPriority.NORMAL,
        },
      ];

      const patterns = engine.findConsecutiveEvents(events);
      expect(patterns.length).toBe(0);
    });
  });

  describe('findPeriodicEvents', () => {
    it('should find periodic events', () => {
      const now = Date.now();
      const interval = 1000;
      const events: IEvent[] = [
        {
          type: EventType.EDITOR_SAVE,
          payload: { text: 'test1' },
          timestamp: now,
          priority: EventPriority.NORMAL,
        },
        {
          type: EventType.EDITOR_SAVE,
          payload: { text: 'test2' },
          timestamp: now + interval,
          priority: EventPriority.NORMAL,
        },
        {
          type: EventType.EDITOR_SAVE,
          payload: { text: 'test3' },
          timestamp: now + interval * 2,
          priority: EventPriority.NORMAL,
        },
      ];

      const patterns = engine.findPeriodicEvents(events);
      expect(patterns.length).toBe(1);
      expect(patterns[0].name).toContain('Periodic');
      expect(patterns[0].confidence).toBeGreaterThan(0.8);
    });

    it('should not find patterns with less than 3 events', () => {
      const now = Date.now();
      const interval = 1000;
      const events: IEvent[] = [
        {
          type: EventType.EDITOR_SAVE,
          payload: { text: 'test1' },
          timestamp: now,
          priority: EventPriority.NORMAL,
        },
        {
          type: EventType.EDITOR_SAVE,
          payload: { text: 'test2' },
          timestamp: now + interval,
          priority: EventPriority.NORMAL,
        },
      ];

      const patterns = engine.findPeriodicEvents(events);
      expect(patterns.length).toBe(0);
    });
  });

  describe('findRelatedEvents', () => {
    it('should find related events', () => {
      const relatedId = 'test-relation';
      const events: IEvent[] = [
        {
          type: EventType.EDITOR_CHANGE,
          payload: { text: 'test1' },
          timestamp: Date.now(),
          priority: EventPriority.NORMAL,
          relatedEventId: relatedId,
        },
        {
          type: EventType.EDITOR_SAVE,
          payload: { text: 'test2' },
          timestamp: Date.now() + 100,
          priority: EventPriority.NORMAL,
          relatedEventId: relatedId,
        },
      ];

      const patterns = engine.findRelatedEvents(events);
      expect(patterns.length).toBe(1);
      expect(patterns[0].events.length).toBe(2);
      expect(patterns[0].name).toBe('Related events');
      expect(patterns[0].confidence).toBe(1.0);
    });

    it('should not find patterns with single events', () => {
      const events: IEvent[] = [
        {
          type: EventType.EDITOR_CHANGE,
          payload: { text: 'test1' },
          timestamp: Date.now(),
          priority: EventPriority.NORMAL,
          relatedEventId: 'test-relation',
        },
      ];

      const patterns = engine.findRelatedEvents(events);
      expect(patterns.length).toBe(0);
    });
  });

  describe('predictNextEvents', () => {
    it('should return empty array for now', () => {
      const predictions = engine.predictNextEvents(mockEvents);
      expect(predictions).toEqual([]);
    });
  });

  describe('detectAnomalies', () => {
    it('should return empty array for now', () => {
      const anomalies = engine.detectAnomalies(mockEvents);
      expect(anomalies).toEqual([]);
    });
  });

  describe('predictTrends', () => {
    it('should return empty array for now', () => {
      const trends = engine.predictTrends(mockEvents);
      expect(trends).toEqual([]);
    });
  });
});
