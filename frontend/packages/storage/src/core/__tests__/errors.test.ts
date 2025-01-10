import { ERROR_MESSAGES } from '../constants';
import {
    DatabaseError,
    NotFoundError,
    StorageError,
    StorageFullError,
    ValidationError,
} from '../errors';

describe('Storage Errors', () => {
    describe('StorageError', () => {
        it('should create base storage error with code', () => {
            const error = new StorageError('Test error', 'TEST_ERROR');
            expect(error.message).toBe('Test error');
            expect(error.code).toBe('TEST_ERROR');
            expect(error.name).toBe('StorageError');
        });

        it('should be instanceof Error', () => {
            const error = new StorageError('Test error', 'TEST_ERROR');
            expect(error).toBeInstanceOf(Error);
        });
    });

    describe('DatabaseError', () => {
        it('should create database error with default message', () => {
            const error = new DatabaseError();
            expect(error.message).toBe(ERROR_MESSAGES.DB_CONNECTION);
            expect(error.code).toBe('DB_ERROR');
            expect(error.name).toBe('DatabaseError');
        });

        it('should create database error with custom message', () => {
            const message = 'Custom database error';
            const error = new DatabaseError(message);
            expect(error.message).toBe(message);
            expect(error.code).toBe('DB_ERROR');
        });

        it('should be instanceof StorageError', () => {
            const error = new DatabaseError();
            expect(error).toBeInstanceOf(StorageError);
        });
    });

    describe('ValidationError', () => {
        it('should create validation error with default message', () => {
            const error = new ValidationError();
            expect(error.message).toBe(ERROR_MESSAGES.INVALID_DATA);
            expect(error.code).toBe('VALIDATION_ERROR');
            expect(error.name).toBe('ValidationError');
        });

        it('should be instanceof StorageError', () => {
            const error = new ValidationError();
            expect(error).toBeInstanceOf(StorageError);
        });
    });

    describe('NotFoundError', () => {
        it('should create not found error with default message', () => {
            const error = new NotFoundError();
            expect(error.message).toBe(ERROR_MESSAGES.NOT_FOUND);
            expect(error.code).toBe('NOT_FOUND');
            expect(error.name).toBe('NotFoundError');
        });

        it('should be instanceof StorageError', () => {
            const error = new NotFoundError();
            expect(error).toBeInstanceOf(StorageError);
        });
    });

    describe('StorageFullError', () => {
        it('should create storage full error with default message', () => {
            const error = new StorageFullError();
            expect(error.message).toBe(ERROR_MESSAGES.STORAGE_FULL);
            expect(error.code).toBe('STORAGE_FULL');
            expect(error.name).toBe('StorageFullError');
        });

        it('should be instanceof StorageError', () => {
            const error = new StorageFullError();
            expect(error).toBeInstanceOf(StorageError);
        });
    });
}); 