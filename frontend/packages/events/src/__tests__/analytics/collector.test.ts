import { DataCollector } from '../../analytics/collector';
import { EventPriority, EventType, IEvent } from '../../types/event';

describe('DataCollector', () => {
  let collector: DataCollector;

  beforeEach(() => {
    collector = new DataCollector();
  });

  afterEach(() => {
    collector.clear();
  });

  it('should collect events', (done) => {
    const testEvent: IEvent = {
      type: EventType.EDITOR_CHANGE,
      payload: { text: 'test' },
      timestamp: Date.now(),
      priority: EventPriority.NORMAL,
    };

    collector.asObservable().subscribe((event) => {
      expect(event).toEqual(testEvent);
      done();
    });

    collector.collect(testEvent);
  });

  it('should collect batch events', (done) => {
    const testEvents: IEvent[] = [
      {
        type: EventType.EDITOR_CHANGE,
        payload: { text: 'test1' },
        timestamp: Date.now(),
        priority: EventPriority.NORMAL,
      },
      {
        type: EventType.EDITOR_SAVE,
        payload: { text: 'test2' },
        timestamp: Date.now(),
        priority: EventPriority.HIGH,
      },
    ];

    let count = 0;
    collector.asObservable().subscribe((event) => {
      expect(event).toEqual(testEvents[count]);
      count++;
      if (count === testEvents.length) {
        done();
      }
    });

    collector.collectBatch(testEvents);
  });

  it('should filter events by priority', (done) => {
    const collector = new DataCollector({
      filterPriority: EventPriority.HIGH,
    });

    const lowPriorityEvent: IEvent = {
      type: EventType.EDITOR_CHANGE,
      payload: { text: 'test' },
      timestamp: Date.now(),
      priority: EventPriority.LOW,
    };

    const highPriorityEvent: IEvent = {
      type: EventType.EDITOR_SAVE,
      payload: { text: 'test' },
      timestamp: Date.now(),
      priority: EventPriority.HIGH,
    };

    collector.asObservable().subscribe((event) => {
      expect(event).toEqual(highPriorityEvent);
      done();
    });

    collector.collect(lowPriorityEvent);
    collector.collect(highPriorityEvent);
  });

  it('should apply preprocessors', (done) => {
    const addSource = (event: IEvent): IEvent => ({
      ...event,
      source: 'test',
    });

    const addId = (event: IEvent): IEvent => ({
      ...event,
      id: '123',
    });

    const collector = new DataCollector({
      preprocessors: [addSource, addId],
    });

    const testEvent: IEvent = {
      type: EventType.EDITOR_CHANGE,
      payload: { text: 'test' },
      timestamp: Date.now(),
      priority: EventPriority.NORMAL,
    };

    collector.asObservable().subscribe((event) => {
      expect(event).toEqual({
        ...testEvent,
        source: 'test',
        id: '123',
      });
      done();
    });

    collector.collect(testEvent);
  });

  it('should add preprocessor dynamically', (done) => {
    const addSource = (event: IEvent): IEvent => ({
      ...event,
      source: 'test',
    });

    const testEvent: IEvent = {
      type: EventType.EDITOR_CHANGE,
      payload: { text: 'test' },
      timestamp: Date.now(),
      priority: EventPriority.NORMAL,
    };

    collector.addPreprocessor(addSource);

    collector.asObservable().subscribe((event) => {
      expect(event).toEqual({
        ...testEvent,
        source: 'test',
      });
      done();
    });

    collector.collect(testEvent);
  });

  it('should clear collector', () => {
    const addSource = (event: IEvent): IEvent => ({
      ...event,
      source: 'test',
    });

    collector.addPreprocessor(addSource);
    collector.clear();

    expect(collector['preprocessors']).toEqual([]);
  });
});
