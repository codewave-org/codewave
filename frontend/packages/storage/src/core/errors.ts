import { ERROR_MESSAGES } from './constants';

// 基础错误类
export class StorageError extends Error {
    constructor(message: string, public code: string) {
        super(message);
        this.name = 'StorageError';
    }
}

// 数据库错误
export class DatabaseError extends StorageError {
    constructor(message: string = ERROR_MESSAGES.DB_CONNECTION) {
        super(message, 'DB_ERROR');
        this.name = 'DatabaseError';
    }
}

// 数据验证错误
export class ValidationError extends StorageError {
    constructor(message: string = ERROR_MESSAGES.INVALID_DATA) {
        super(message, 'VALIDATION_ERROR');
        this.name = 'ValidationError';
    }
}

// 资源未找到错误
export class NotFoundError extends StorageError {
    constructor(message: string = ERROR_MESSAGES.NOT_FOUND) {
        super(message, 'NOT_FOUND');
        this.name = 'NotFoundError';
    }
}

// 存储空间不足错误
export class StorageFullError extends StorageError {
    constructor(message: string = ERROR_MESSAGES.STORAGE_FULL) {
        super(message, 'STORAGE_FULL');
        this.name = 'StorageFullError';
    }
} 