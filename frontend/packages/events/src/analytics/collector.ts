import { Observable, Subject, filter, map } from 'rxjs';
import { EventPriority, IEvent } from '../types/event';

export interface IDataCollectorConfig {
  batchSize?: number;
  batchInterval?: number;
  filterPriority?: EventPriority;
  preprocessors?: Array<(event: IEvent) => IEvent>;
}

export interface IDataCollector {
  collect(event: IEvent): void;
  collectBatch(events: IEvent[]): void;
  asObservable(): Observable<IEvent>;
  addPreprocessor(preprocessor: (event: IEvent) => IEvent): void;
  clear(): void;
}

export class DataCollector implements IDataCollector {
  private eventSubject: Subject<IEvent>;
  private config: Required<IDataCollectorConfig>;
  private preprocessors: Array<(event: IEvent) => IEvent>;

  constructor(config: IDataCollectorConfig = {}) {
    this.eventSubject = new Subject<IEvent>();
    this.preprocessors = config.preprocessors || [];
    this.config = {
      batchSize: config.batchSize || 100,
      batchInterval: config.batchInterval || 1000,
      filterPriority: config.filterPriority || EventPriority.LOW,
      preprocessors: this.preprocessors,
    };
  }

  public collect(event: IEvent): void {
    if (this.shouldCollect(event)) {
      const processedEvent = this.preprocess(event);
      this.eventSubject.next(processedEvent);
    }
  }

  public collectBatch(events: IEvent[]): void {
    events.forEach((event) => this.collect(event));
  }

  public asObservable(): Observable<IEvent> {
    return this.eventSubject.asObservable().pipe(
      filter((event) => this.shouldCollect(event)),
      map((event) => this.preprocess(event))
    );
  }

  public addPreprocessor(preprocessor: (event: IEvent) => IEvent): void {
    this.preprocessors.push(preprocessor);
  }

  public clear(): void {
    this.eventSubject.complete();
    this.eventSubject = new Subject<IEvent>();
    this.preprocessors = [];
  }

  private shouldCollect(event: IEvent): boolean {
    return (event.priority || EventPriority.NORMAL) >= this.config.filterPriority;
  }

  private preprocess(event: IEvent): IEvent {
    return this.preprocessors.reduce(
      (processedEvent, preprocessor) => preprocessor(processedEvent),
      { ...event }
    );
  }
}
