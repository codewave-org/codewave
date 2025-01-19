import { v4 as uuidv4 } from 'uuid';
import { EventBus } from '../bus/event-bus';
import { EventPriority, EventType, IPartialEvent } from '../types/event';
import {
  ILearningEvent,
  ILearningIntegration,
  ILearningProgress,
  ILearningState,
  LearningAction,
  LearningPattern,
  LearningReport,
} from './types';

export class LearningIntegration implements ILearningIntegration {
  private readonly userId: string;
  private readonly eventBus: EventBus;
  private states: Map<string, ILearningState>;

  constructor(eventBus: EventBus, userId: string) {
    this.userId = userId;
    this.eventBus = eventBus;
    this.states = new Map();
  }

  private getStateKey(courseId: string, lessonId: string): string {
    return `${courseId}:${lessonId}`;
  }

  private getOrCreateState(courseId: string, lessonId: string): ILearningState {
    const key = this.getStateKey(courseId, lessonId);
    let state = this.states.get(key);

    if (!state) {
      state = {
        courseId,
        lessonId,
        userId: this.userId,
        progress: 0,
        startTime: Date.now(),
        lastUpdateTime: Date.now(),
        totalDuration: 0,
        status: 'not_started',
      };
      this.states.set(key, state);
    }

    return state;
  }

  private emitLearningEvent(
    action: LearningAction,
    courseId: string,
    lessonId: string,
    metadata?: Record<string, any>
  ) {
    const state = this.getOrCreateState(courseId, lessonId);
    const now = Date.now();
    const duration = action === LearningAction.RESUME ? 0 : now - state.lastUpdateTime;

    const learningEvent: ILearningEvent = {
      type: EventType.LEARNING_PROGRESS,
      timestamp: now,
      priority: EventPriority.NORMAL,
      learning: {
        id: uuidv4(),
        courseId,
        lessonId,
        userId: this.userId,
        action,
        progress: state.progress,
        duration,
        score: state.score,
        metadata,
      },
    };

    const event: IPartialEvent<ILearningEvent> = {
      id: uuidv4(),
      type: EventType.LEARNING_PROGRESS,
      priority: EventPriority.NORMAL,
      payload: learningEvent,
    };

    this.eventBus.publish(event);
    state.lastUpdateTime = now;
    if (duration > 0) {
      state.totalDuration += duration;
    }
  }

  trackStart(courseId: string, lessonId: string): void {
    const state = this.getOrCreateState(courseId, lessonId);
    state.status = 'in_progress';
    this.emitLearningEvent(LearningAction.START, courseId, lessonId);
  }

  trackComplete(courseId: string, lessonId: string, score?: number): void {
    const state = this.getOrCreateState(courseId, lessonId);
    state.status = 'completed';
    state.progress = 100;
    if (score !== undefined) {
      state.score = score;
    }
    this.emitLearningEvent(LearningAction.COMPLETE, courseId, lessonId);
  }

  trackPause(courseId: string, lessonId: string): void {
    this.emitLearningEvent(LearningAction.PAUSE, courseId, lessonId);
  }

  trackResume(courseId: string, lessonId: string): void {
    this.emitLearningEvent(LearningAction.RESUME, courseId, lessonId);
  }

  trackPractice(courseId: string, lessonId: string, metadata?: Record<string, any>): void {
    this.emitLearningEvent(LearningAction.PRACTICE, courseId, lessonId, metadata);
  }

  getProgress(courseId: string, lessonId: string): ILearningProgress {
    const state = this.getOrCreateState(courseId, lessonId);
    return {
      courseId: state.courseId,
      lessonId: state.lessonId,
      progress: state.progress,
      score: state.score,
      startTime: state.startTime,
      lastUpdateTime: state.lastUpdateTime,
      totalDuration: state.totalDuration,
      status: state.status,
    };
  }

  updateProgress(courseId: string, lessonId: string, progress: number): void {
    const state = this.getOrCreateState(courseId, lessonId);
    state.progress = Math.min(100, Math.max(0, progress));
    this.emitLearningEvent(LearningAction.SUBMIT, courseId, lessonId);
  }

  async analyzeLearningPattern(): Promise<LearningPattern> {
    // 这里应该实现学习模式分析的逻辑
    // 目前返回一个空的模式列表
    return {
      userId: this.userId,
      patterns: [],
    };
  }

  async generateReport(): Promise<LearningReport> {
    // 这里应该实现报告生成的逻辑
    // 目前返回一个基础的报告
    const states = Array.from(this.states.values());
    const completedLessons = states.filter((s) => s.status === 'completed').length;
    const totalScore = states.reduce((sum, s) => sum + (s.score || 0), 0);
    const averageScore = completedLessons > 0 ? totalScore / completedLessons : 0;

    return {
      userId: this.userId,
      courseId: states[0]?.courseId || '',
      startTime: Math.min(...states.map((s) => s.startTime)),
      endTime: Math.max(...states.map((s) => s.lastUpdateTime)),
      totalDuration: states.reduce((sum, s) => sum + s.totalDuration, 0),
      completedLessons,
      averageScore,
      learningPatterns: [],
      recommendations: [],
    };
  }
}
