import {
    BaseSchema,
    ConfigSchema,
    SnippetSchema
} from '../types';

describe('Schema Validations', () => {
    describe('BaseSchema', () => {
        it('should validate correct base data', () => {
            const data = {
                id: '123e4567-e89b-12d3-a456-426614174000',
                created_at: '2024-01-09T12:00:00Z',
                updated_at: '2024-01-09T12:00:00Z',
            };
            expect(() => BaseSchema.parse(data)).not.toThrow();
        });

        it('should reject invalid UUID', () => {
            const data = {
                id: 'invalid-uuid',
                created_at: '2024-01-09T12:00:00Z',
                updated_at: '2024-01-09T12:00:00Z',
            };
            expect(() => BaseSchema.parse(data)).toThrow();
        });

        it('should reject invalid dates', () => {
            const data = {
                id: '123e4567-e89b-12d3-a456-426614174000',
                created_at: 'invalid-date',
                updated_at: '2024-01-09T12:00:00Z',
            };
            expect(() => BaseSchema.parse(data)).toThrow();
        });
    });

    describe('SnippetSchema', () => {
        const validSnippet = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'Test Snippet',
            content: 'console.log("Hello World");',
            language: 'javascript',
            tags: ['test', 'example'],
            created_at: '2024-01-09T12:00:00Z',
            updated_at: '2024-01-09T12:00:00Z',
        };

        it('should validate correct snippet data', () => {
            expect(() => SnippetSchema.parse(validSnippet)).not.toThrow();
        });

        it('should allow optional description', () => {
            const withDescription = {
                ...validSnippet,
                description: 'Test description',
            };
            expect(() => SnippetSchema.parse(withDescription)).not.toThrow();
        });

        it('should reject empty title', () => {
            const invalidSnippet = {
                ...validSnippet,
                title: '',
            };
            expect(() => SnippetSchema.parse(invalidSnippet)).toThrow();
        });

        it('should reject too long title', () => {
            const invalidSnippet = {
                ...validSnippet,
                title: 'a'.repeat(101),
            };
            expect(() => SnippetSchema.parse(invalidSnippet)).toThrow();
        });
    });

    describe('ConfigSchema', () => {
        const validConfig = {
            theme: 'light',
            editor_preferences: {
                theme: 'vs',
                fontSize: 14,
                tabSize: 2,
                wordWrap: true,
                lineNumbers: true,
                minimap: true,
            },
            recent_snippets: ['123e4567-e89b-12d3-a456-426614174000'],
            favorite_tags: ['test'],
        };

        it('should validate correct config data', () => {
            expect(() => ConfigSchema.parse(validConfig)).not.toThrow();
        });

        it('should reject invalid editor preferences', () => {
            const invalidConfig = {
                ...validConfig,
                editor_preferences: {
                    ...validConfig.editor_preferences,
                    fontSize: 'invalid',
                },
            };
            expect(() => ConfigSchema.parse(invalidConfig)).toThrow();
        });

        it('should reject invalid UUIDs in recent_snippets', () => {
            const invalidConfig = {
                ...validConfig,
                recent_snippets: ['invalid-uuid'],
            };
            expect(() => ConfigSchema.parse(invalidConfig)).toThrow();
        });
    });
}); 