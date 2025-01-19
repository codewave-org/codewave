import { EventBus } from '../../bus/event-bus';
import { LearningIntegration } from '../../learning/integration';
import { LearningAction } from '../../learning/types';
import { EventType } from '../../types/event';

describe('LearningIntegration', () => {
  let eventBus: EventBus;
  let learningIntegration: LearningIntegration;
  const userId = 'test-user-id';
  const courseId = 'test-course-id';
  const lessonId = 'test-lesson-id';

  beforeEach(() => {
    eventBus = new EventBus();
    learningIntegration = new LearningIntegration(eventBus, userId);
  });

  describe('tracking methods', () => {
    it('should track start of learning session', () => {
      const publishSpy = jest.spyOn(eventBus, 'publish');
      learningIntegration.trackStart(courseId, lessonId);

      expect(publishSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: EventType.LEARNING_PROGRESS,
          payload: expect.objectContaining({
            learning: expect.objectContaining({
              action: LearningAction.START,
              courseId,
              lessonId,
              userId,
            }),
          }),
        })
      );
    });

    it('should track completion of learning session', () => {
      const publishSpy = jest.spyOn(eventBus, 'publish');
      const score = 85;
      learningIntegration.trackComplete(courseId, lessonId, score);

      expect(publishSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: EventType.LEARNING_PROGRESS,
          payload: expect.objectContaining({
            learning: expect.objectContaining({
              action: LearningAction.COMPLETE,
              courseId,
              lessonId,
              userId,
              score,
            }),
          }),
        })
      );
    });

    it('should track completion without score', () => {
      const publishSpy = jest.spyOn(eventBus, 'publish');
      learningIntegration.trackComplete(courseId, lessonId);

      expect(publishSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            learning: expect.objectContaining({
              action: LearningAction.COMPLETE,
              score: undefined,
            }),
          }),
        })
      );
    });

    it('should track pause and resume of learning session', () => {
      const publishSpy = jest.spyOn(eventBus, 'publish');

      learningIntegration.trackPause(courseId, lessonId);
      expect(publishSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            learning: expect.objectContaining({
              action: LearningAction.PAUSE,
            }),
          }),
        })
      );

      learningIntegration.trackResume(courseId, lessonId);
      expect(publishSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            learning: expect.objectContaining({
              action: LearningAction.RESUME,
            }),
          }),
        })
      );
    });

    it('should track practice with metadata', () => {
      const publishSpy = jest.spyOn(eventBus, 'publish');
      const metadata = { exerciseId: 'ex-1', attempts: 2 };

      learningIntegration.trackPractice(courseId, lessonId, metadata);
      expect(publishSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            learning: expect.objectContaining({
              action: LearningAction.PRACTICE,
              metadata,
            }),
          }),
        })
      );
    });

    it('should track practice without metadata', () => {
      const publishSpy = jest.spyOn(eventBus, 'publish');

      learningIntegration.trackPractice(courseId, lessonId);
      expect(publishSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            learning: expect.objectContaining({
              action: LearningAction.PRACTICE,
              metadata: undefined,
            }),
          }),
        })
      );
    });
  });

  describe('progress management', () => {
    it('should get initial progress', () => {
      const progress = learningIntegration.getProgress(courseId, lessonId);

      expect(progress).toEqual(
        expect.objectContaining({
          courseId,
          lessonId,
          progress: 0,
          status: 'not_started',
        })
      );
    });

    it('should update progress', () => {
      const progressValue = 75;
      learningIntegration.updateProgress(courseId, lessonId, progressValue);

      const progress = learningIntegration.getProgress(courseId, lessonId);
      expect(progress.progress).toBe(progressValue);
    });

    it('should clamp progress between 0 and 100', () => {
      learningIntegration.updateProgress(courseId, lessonId, -10);
      expect(learningIntegration.getProgress(courseId, lessonId).progress).toBe(0);

      learningIntegration.updateProgress(courseId, lessonId, 150);
      expect(learningIntegration.getProgress(courseId, lessonId).progress).toBe(100);
    });
  });

  describe('analysis and reporting', () => {
    it('should analyze learning pattern', async () => {
      const pattern = await learningIntegration.analyzeLearningPattern();

      expect(pattern).toEqual({
        userId,
        patterns: [],
      });
    });

    it('should generate learning report with no lessons', async () => {
      const report = await learningIntegration.generateReport();

      expect(report).toEqual(
        expect.objectContaining({
          userId,
          courseId: '',
          completedLessons: 0,
          averageScore: 0,
          learningPatterns: [],
          recommendations: [],
        })
      );
    });

    it('should generate learning report with completed lessons', async () => {
      learningIntegration.trackStart(courseId, lessonId);
      learningIntegration.updateProgress(courseId, lessonId, 50);
      learningIntegration.trackComplete(courseId, lessonId, 90);

      const report = await learningIntegration.generateReport();

      expect(report).toEqual(
        expect.objectContaining({
          userId,
          courseId,
          completedLessons: 1,
          averageScore: 90,
          learningPatterns: [],
          recommendations: [],
        })
      );
    });

    it('should generate learning report with multiple lessons', async () => {
      const lessonId2 = 'test-lesson-id-2';

      // First lesson
      learningIntegration.trackStart(courseId, lessonId);
      learningIntegration.updateProgress(courseId, lessonId, 100);
      learningIntegration.trackComplete(courseId, lessonId, 90);

      // Second lesson
      learningIntegration.trackStart(courseId, lessonId2);
      learningIntegration.updateProgress(courseId, lessonId2, 100);
      learningIntegration.trackComplete(courseId, lessonId2, 80);

      const report = await learningIntegration.generateReport();

      expect(report).toEqual(
        expect.objectContaining({
          userId,
          courseId,
          completedLessons: 2,
          averageScore: 85, // (90 + 80) / 2
          learningPatterns: [],
          recommendations: [],
        })
      );
    });
  });

  describe('state management', () => {
    it('should maintain separate states for different lessons', () => {
      const lessonId2 = 'test-lesson-id-2';

      learningIntegration.trackStart(courseId, lessonId);
      learningIntegration.updateProgress(courseId, lessonId, 50);

      learningIntegration.trackStart(courseId, lessonId2);
      learningIntegration.updateProgress(courseId, lessonId2, 75);

      const progress1 = learningIntegration.getProgress(courseId, lessonId);
      const progress2 = learningIntegration.getProgress(courseId, lessonId2);

      expect(progress1.progress).toBe(50);
      expect(progress2.progress).toBe(75);
    });

    it('should track duration correctly', () => {
      const startTime = Date.now();
      jest.spyOn(Date, 'now').mockImplementation(() => startTime);

      learningIntegration.trackStart(courseId, lessonId);

      // Simulate time passing
      jest.spyOn(Date, 'now').mockImplementation(() => startTime + 1000);
      learningIntegration.trackPause(courseId, lessonId);

      const progress = learningIntegration.getProgress(courseId, lessonId);
      expect(progress.totalDuration).toBe(1000);
    });

    it('should accumulate duration across multiple sessions', () => {
      const startTime = Date.now();
      jest.spyOn(Date, 'now').mockImplementation(() => startTime);

      // First session
      learningIntegration.trackStart(courseId, lessonId);
      jest.spyOn(Date, 'now').mockImplementation(() => startTime + 1000);
      learningIntegration.trackPause(courseId, lessonId);

      // Second session
      jest.spyOn(Date, 'now').mockImplementation(() => startTime + 2000);
      learningIntegration.trackResume(courseId, lessonId);
      jest.spyOn(Date, 'now').mockImplementation(() => startTime + 3000);
      learningIntegration.trackPause(courseId, lessonId);

      const progress = learningIntegration.getProgress(courseId, lessonId);
      expect(progress.totalDuration).toBe(2000); // 1000 + 1000
    });
  });
});
