import { IEvent } from '../types/event';

/**
 * 分析结果类型
 */
export interface IAnalysisResult {
  /** 事件总数 */
  totalEvents: number;

  /** 事件类型分布 */
  typeDistribution: Map<string, number>;

  /** 优先级分布 */
  priorityDistribution: Map<number, number>;

  /** 时间范围 */
  timeRange: {
    start: number;
    end: number;
  };

  /** 发现的模式 */
  patterns: IEventPattern[];
}

/**
 * 事件模式类型
 */
export interface IEventPattern {
  /** 模式ID */
  id: string;

  /** 模式名称 */
  name: string;

  /** 模式描述 */
  description: string;

  /** 匹配的事件序列 */
  events: IEvent[];

  /** 匹配次数 */
  occurrences: number;

  /** 置信度 */
  confidence: number;
}

/**
 * 事件分析器实现
 */
export class EventAnalyzer {
  /**
   * 分析事件序列
   */
  analyze(events: IEvent[]): IAnalysisResult {
    if (!events.length) {
      return this.createEmptyResult();
    }

    const typeDistribution = new Map<string, number>();
    const priorityDistribution = new Map<number, number>();
    let minTime = Number.MAX_SAFE_INTEGER;
    let maxTime = Number.MIN_SAFE_INTEGER;

    // 统计分布
    events.forEach((event) => {
      // 类型分布
      const typeCount = typeDistribution.get(event.type) || 0;
      typeDistribution.set(event.type, typeCount + 1);

      // 优先级分布
      const priority = event.priority || 0;
      const priorityCount = priorityDistribution.get(priority) || 0;
      priorityDistribution.set(priority, priorityCount + 1);

      // 时间范围
      minTime = Math.min(minTime, event.timestamp);
      maxTime = Math.max(maxTime, event.timestamp);
    });

    // 查找模式
    const patterns = this.findPatterns(events);

    return {
      totalEvents: events.length,
      typeDistribution,
      priorityDistribution,
      timeRange: {
        start: minTime,
        end: maxTime,
      },
      patterns,
    };
  }

  /**
   * 查找事件模式
   */
  private findPatterns(events: IEvent[]): IEventPattern[] {
    const patterns: IEventPattern[] = [];

    // 查找连续的相同类型事件
    this.findConsecutiveEvents(events, patterns);

    // 查找周期性事件
    this.findPeriodicEvents(events, patterns);

    // 查找关联事件
    this.findRelatedEvents(events, patterns);

    return patterns;
  }

  /**
   * 查找连续的相同类型事件
   */
  private findConsecutiveEvents(events: IEvent[], patterns: IEventPattern[]): void {
    let currentType = '';
    let currentEvents: IEvent[] = [];

    const addPattern = (type: string, events: IEvent[]) => {
      if (events.length >= 3) {
        patterns.push({
          id: `consecutive-${type}-${patterns.length}`,
          name: `连续${type}事件`,
          description: `发现${events.length}个连续的${type}事件`,
          events: [...events],
          occurrences: 1,
          confidence: 0.8,
        });
      }
    };

    events.forEach((event, index) => {
      if (event.type === currentType) {
        currentEvents.push(event);
      } else {
        addPattern(currentType, currentEvents);
        currentType = event.type;
        currentEvents = [event];
      }

      // 处理最后一组事件
      if (index === events.length - 1) {
        addPattern(currentType, currentEvents);
      }
    });
  }

  /**
   * 查找周期性事件
   */
  private findPeriodicEvents(events: IEvent[], patterns: IEventPattern[]): void {
    const typeGroups = new Map<string, IEvent[]>();

    // 按类型分组
    events.forEach((event) => {
      const typeEvents = typeGroups.get(event.type) || [];
      typeEvents.push(event);
      typeGroups.set(event.type, typeEvents);
    });

    // 分析每种类型的周期性
    typeGroups.forEach((typeEvents, type) => {
      if (typeEvents.length < 3) return;

      const intervals: number[] = [];
      for (let i = 1; i < typeEvents.length; i++) {
        intervals.push(typeEvents[i].timestamp - typeEvents[i - 1].timestamp);
      }

      // 计算平均间隔和标准差
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const stdDev = Math.sqrt(
        intervals.reduce((a, b) => a + Math.pow(b - avgInterval, 2), 0) / intervals.length
      );

      // 如果标准差较小，认为是周期性事件
      if (stdDev / avgInterval < 0.2) {
        patterns.push({
          id: `periodic-${type}-${patterns.length}`,
          name: `周期性${type}事件`,
          description: `发现周期约为${Math.round(avgInterval)}ms的${type}事件`,
          events: typeEvents,
          occurrences: typeEvents.length,
          confidence: 1 - stdDev / avgInterval,
        });
      }
    });
  }

  /**
   * 查找关联事件
   */
  private findRelatedEvents(events: IEvent[], patterns: IEventPattern[]): void {
    const relatedGroups = new Map<string, IEvent[]>();

    // 按关联ID分组
    events.forEach((event) => {
      if (event.relatedEventId) {
        const group = relatedGroups.get(event.relatedEventId) || [];
        group.push(event);
        relatedGroups.set(event.relatedEventId, group);
      }
    });

    // 分析关联事件
    relatedGroups.forEach((group, relatedId) => {
      if (group.length >= 2) {
        patterns.push({
          id: `related-${relatedId}`,
          name: '关联事件序列',
          description: `发现${group.length}个相关联的事件`,
          events: group,
          occurrences: 1,
          confidence: 1,
        });
      }
    });
  }

  /**
   * 创建空的分析结果
   */
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
}
