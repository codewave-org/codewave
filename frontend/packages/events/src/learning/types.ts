import { EventPriority, EventType } from '../types/event';

export enum LearningAction {
  START = 'start',
  COMPLETE = 'complete',
  PAUSE = 'pause',
  RESUME = 'resume',
  SUBMIT = 'submit',
  REVIEW = 'review',
  PRACTICE = 'practice',
}

export interface ILearningState {
  courseId: string;
  lessonId: string;
  userId: string;
  progress: number;
  score?: number;
  startTime: number;
  lastUpdateTime: number;
  totalDuration: number;
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface ILearningEvent {
  type: EventType;
  timestamp: number;
  priority: EventPriority;
  learning: {
    id: string;
    courseId: string;
    lessonId: string;
    userId: string;
    action: LearningAction;
    progress: number;
    duration?: number;
    score?: number;
    metadata?: Record<string, any>;
  };
}

export interface ILearningProgress {
  courseId: string;
  lessonId: string;
  progress: number;
  score?: number;
  startTime: number;
  lastUpdateTime: number;
  totalDuration: number;
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface LearningPattern {
  userId: string;
  patterns: Array<{
    type: string;
    description: string;
    confidence: number;
    metadata: Record<string, any>;
  }>;
}

export interface LearningReport {
  userId: string;
  courseId: string;
  startTime: number;
  endTime: number;
  totalDuration: number;
  completedLessons: number;
  averageScore: number;
  learningPatterns: LearningPattern[];
  recommendations: Array<{
    type: string;
    description: string;
    priority: number;
  }>;
}

export interface ILearningIntegration {
  // 学习行为跟踪
  trackStart(courseId: string, lessonId: string): void;
  trackComplete(courseId: string, lessonId: string, score?: number): void;
  trackPause(courseId: string, lessonId: string): void;
  trackResume(courseId: string, lessonId: string): void;
  trackPractice(courseId: string, lessonId: string, metadata?: Record<string, any>): void;

  // 进度管理
  getProgress(courseId: string, lessonId: string): ILearningProgress;
  updateProgress(courseId: string, lessonId: string, progress: number): void;

  // 数据分析
  analyzeLearningPattern(): Promise<LearningPattern>;
  generateReport(): Promise<LearningReport>;
}
