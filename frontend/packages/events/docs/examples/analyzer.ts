import { EventAnalyzer, EventPriority, EventType, IEvent } from '@codewave/events';

// 创建一些示例事件
const events: IEvent[] = [
  // 编辑器连续修改事件
  {
    type: EventType.EDITOR_CHANGE,
    payload: { file: 'main.ts', changes: [{ line: 1, text: 'const x = 1;' }] },
    timestamp: Date.now(),
    priority: EventPriority.NORMAL,
  },
  {
    type: EventType.EDITOR_CHANGE,
    payload: { file: 'main.ts', changes: [{ line: 2, text: 'const y = 2;' }] },
    timestamp: Date.now() + 1000,
    priority: EventPriority.NORMAL,
  },
  {
    type: EventType.EDITOR_CHANGE,
    payload: { file: 'main.ts', changes: [{ line: 3, text: 'const z = 3;' }] },
    timestamp: Date.now() + 2000,
    priority: EventPriority.NORMAL,
  },

  // 周期性的代码检查事件
  {
    type: EventType.CODE_LINT,
    payload: { file: 'main.ts', issues: [] },
    timestamp: Date.now() + 3000,
    priority: EventPriority.LOW,
  },
  {
    type: EventType.CODE_LINT,
    payload: { file: 'main.ts', issues: [] },
    timestamp: Date.now() + 6000,
    priority: EventPriority.LOW,
  },
  {
    type: EventType.CODE_LINT,
    payload: { file: 'main.ts', issues: [] },
    timestamp: Date.now() + 9000,
    priority: EventPriority.LOW,
  },

  // 相关联的错误事件
  {
    type: EventType.SYSTEM_ERROR,
    payload: { message: '连接失败' },
    timestamp: Date.now() + 10000,
    priority: EventPriority.CRITICAL,
    id: 'error-1',
    relatedEventId: 'connection-failure',
  },
  {
    type: EventType.SYSTEM_WARNING,
    payload: { message: '尝试重新连接' },
    timestamp: Date.now() + 11000,
    priority: EventPriority.HIGH,
    relatedEventId: 'connection-failure',
  },
];

// 创建分析器实例
const analyzer = new EventAnalyzer();

// 分析事件
const result = analyzer.analyze(events);

// 输出分析结果
console.log('事件分析结果：');
console.log('总事件数：', result.totalEvents);

console.log('\n事件类型分布：');
result.typeDistribution.forEach((count, type) => {
  console.log(`${type}: ${count}次`);
});

console.log('\n优先级分布：');
result.priorityDistribution.forEach((count, priority) => {
  console.log(`优先级${priority}: ${count}次`);
});

console.log('\n时间范围：');
console.log('开始时间：', new Date(result.timeRange.start).toLocaleString());
console.log('结束时间：', new Date(result.timeRange.end).toLocaleString());

console.log('\n发现的模式：');
result.patterns.forEach((pattern) => {
  console.log(`\n模式：${pattern.name}`);
  console.log(`描述：${pattern.description}`);
  console.log(`置信度：${pattern.confidence}`);
  console.log(`匹配事件数：${pattern.events.length}`);
});
