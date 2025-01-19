import { v4 as uuidv4 } from 'uuid';
import { EventPriority, EventType, IEvent } from '../types/event';

export interface IAnalysisResult {
  totalEvents: number;
  typeDistribution: Map<string, number>;
  priorityDistribution: Map<number, number>;
  timeRange: {
    start: number;
    end: number;
  };
  patterns: IEventPattern[];
}

export interface IEventPattern {
  id: string;
  name: string;
  description: string;
  events: IEvent[];
  occurrences: number;
  confidence: number;
}

export interface ITrendPrediction {
  type: EventType;
  probability: number;
  expectedTimestamp: number;
  confidence: number;
}

export interface IAnalysisEngine {
  analyze(events: IEvent[]): IAnalysisResult;
  findPatterns(events: IEvent[]): IEventPattern[];
  findConsecutiveEvents(events: IEvent[]): IEventPattern[];
  findPeriodicEvents(events: IEvent[]): IEventPattern[];
  findRelatedEvents(events: IEvent[]): IEventPattern[];
  predictNextEvents(events: IEvent[]): IEvent[];
  detectAnomalies(events: IEvent[]): IEvent[];
  predictTrends(events: IEvent[]): ITrendPrediction[];
}

export class AnalysisEngine implements IAnalysisEngine {
  public analyze(events: IEvent[]): IAnalysisResult {
    if (!events.length) {
      return this.createEmptyResult();
    }

    const typeDistribution = new Map<string, number>();
    const priorityDistribution = new Map<number, number>();
    let minTimestamp = Number.MAX_SAFE_INTEGER;
    let maxTimestamp = Number.MIN_SAFE_INTEGER;

    events.forEach((event) => {
      // Update type distribution
      const currentTypeCount = typeDistribution.get(event.type) || 0;
      typeDistribution.set(event.type, currentTypeCount + 1);

      // Update priority distribution
      const priority = event.priority || EventPriority.NORMAL;
      const currentPriorityCount = priorityDistribution.get(priority) || 0;
      priorityDistribution.set(priority, currentPriorityCount + 1);

      // Update time range
      minTimestamp = Math.min(minTimestamp, event.timestamp);
      maxTimestamp = Math.max(maxTimestamp, event.timestamp);
    });

    return {
      totalEvents: events.length,
      typeDistribution,
      priorityDistribution,
      timeRange: {
        start: minTimestamp,
        end: maxTimestamp,
      },
      patterns: this.findPatterns(events),
    };
  }

  public findPatterns(events: IEvent[]): IEventPattern[] {
    const patterns: IEventPattern[] = [];
    patterns.push(...this.findConsecutiveEvents(events));
    patterns.push(...this.findPeriodicEvents(events));
    patterns.push(...this.findRelatedEvents(events));
    return patterns;
  }

  public findConsecutiveEvents(events: IEvent[]): IEventPattern[] {
    const patterns: IEventPattern[] = [];
    const sortedEvents = [...events].sort((a, b) => a.timestamp - b.timestamp);

    let currentPattern: IEvent[] = [];
    let currentType: string | null = null;

    sortedEvents.forEach((event) => {
      if (currentType === event.type) {
        currentPattern.push(event);
      } else {
        if (currentPattern.length >= 3) {
          patterns.push(
            this.createPattern(
              'consecutive-events',
              `Consecutive ${currentType} events`,
              `Found ${currentPattern.length} consecutive events of type ${currentType}`,
              [...currentPattern],
              1.0
            )
          );
        }
        currentPattern = [event];
        currentType = event.type;
      }
    });

    // Check the last pattern
    if (currentPattern.length >= 3) {
      patterns.push(
        this.createPattern(
          'consecutive-events',
          `Consecutive ${currentType} events`,
          `Found ${currentPattern.length} consecutive events of type ${currentType}`,
          [...currentPattern],
          1.0
        )
      );
    }

    return patterns;
  }

  public findPeriodicEvents(events: IEvent[]): IEventPattern[] {
    const patterns: IEventPattern[] = [];
    const typeGroups = new Map<string, IEvent[]>();

    // Group events by type
    events.forEach((event) => {
      const typeEvents = typeGroups.get(event.type) || [];
      typeEvents.push(event);
      typeGroups.set(event.type, typeEvents);
    });

    // Analyze each type group for periodicity
    typeGroups.forEach((typeEvents, type) => {
      if (typeEvents.length < 3) return;

      const sortedEvents = typeEvents.sort((a, b) => a.timestamp - b.timestamp);
      const intervals: number[] = [];

      for (let i = 1; i < sortedEvents.length; i++) {
        intervals.push(sortedEvents[i].timestamp - sortedEvents[i - 1].timestamp);
      }

      const averageInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const variance =
        intervals.reduce((acc, interval) => acc + Math.pow(interval - averageInterval, 2), 0) /
        intervals.length;
      const standardDeviation = Math.sqrt(variance);

      // If standard deviation is less than 20% of average interval, consider it periodic
      if (standardDeviation < averageInterval * 0.2) {
        patterns.push(
          this.createPattern(
            'periodic-events',
            `Periodic ${type} events`,
            `Found periodic events with average interval of ${Math.round(averageInterval)}ms`,
            sortedEvents,
            1 - standardDeviation / averageInterval
          )
        );
      }
    });

    return patterns;
  }

  public findRelatedEvents(events: IEvent[]): IEventPattern[] {
    const patterns: IEventPattern[] = [];
    const relatedGroups = new Map<string, IEvent[]>();

    // Group events by relatedEventId
    events.forEach((event) => {
      if (event.relatedEventId) {
        const group = relatedGroups.get(event.relatedEventId) || [];
        group.push(event);
        relatedGroups.set(event.relatedEventId, group);
      }
    });

    // Create patterns for related event groups
    relatedGroups.forEach((group, relatedId) => {
      if (group.length >= 2) {
        patterns.push(
          this.createPattern(
            'related-events',
            'Related events',
            `Found ${group.length} events related to ${relatedId}`,
            group,
            1.0
          )
        );
      }
    });

    return patterns;
  }

  public predictNextEvents(_events: IEvent[]): IEvent[] {
    // This is a placeholder implementation
    // In a real implementation, we would use more sophisticated prediction algorithms
    return [];
  }

  public detectAnomalies(_events: IEvent[]): IEvent[] {
    // This is a placeholder implementation
    // In a real implementation, we would use statistical analysis or machine learning
    return [];
  }

  public predictTrends(_events: IEvent[]): ITrendPrediction[] {
    // This is a placeholder implementation
    // In a real implementation, we would use time series analysis
    return [];
  }

  private createEmptyResult(): IAnalysisResult {
    return {
      totalEvents: 0,
      typeDistribution: new Map(),
      priorityDistribution: new Map(),
      timeRange: {
        start: 0,
        end: 0,
      },
      patterns: [],
    };
  }

  private createPattern(
    type: string,
    name: string,
    description: string,
    events: IEvent[],
    confidence: number
  ): IEventPattern {
    return {
      id: uuidv4(),
      name,
      description,
      events,
      occurrences: events.length,
      confidence,
    };
  }
}
