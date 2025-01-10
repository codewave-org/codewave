import { DatabaseError, ValidationError } from '../../../core/errors';
import { Version } from '../../../core/types';
import { DatabaseConnection } from '../../connection';
import { VersionRepository } from '../version';

describe('VersionRepository', () => {
    let connection: DatabaseConnection;
    let repository: VersionRepository;
    let dbName: string;

    beforeEach(async () => {
        // 为每个测试用例创建唯一的数据库名称
        dbName = `test_db_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        connection = new DatabaseConnection(dbName);
        await connection.connect();
        repository = new VersionRepository(connection);
    });

    afterEach(async () => {
        await connection.disconnect();
        // 删除测试数据库
        await deleteDatabase(dbName);
        // 等待一段时间确保资源被清理
        await new Promise((resolve) => setTimeout(resolve, 100));
    });

    async function deleteDatabase(name: string) {
        return new Promise<void>((resolve, reject) => {
            const request = indexedDB.deleteDatabase(name);
            let completed = false;

            request.onerror = () => {
                if (!completed) {
                    completed = true;
                    reject(new Error('Error deleting database'));
                }
            };

            request.onblocked = () => {
                // 等待其他连接关闭
                setTimeout(() => {
                    if (!completed) {
                        completed = true;
                        resolve();
                    }
                }, 100);
            };

            request.onsuccess = () => {
                if (!completed) {
                    completed = true;
                    resolve();
                }
            };
        });
    }

    describe('create', () => {
        it('should create a new version successfully', async () => {
            const versionData = {
                snippet_id: '123e4567-e89b-12d3-a456-426614174000',
                content: 'console.log("Hello World");',
                metadata: {
                    changes: ['Initial version'],
                    size: 100,
                },
            };

            const result = await repository.create(versionData);

            // 验证基本字段
            expect(result).toMatchObject({
                snippet_id: versionData.snippet_id,
                content: versionData.content,
                version_number: 1,
                metadata: {
                    changes: versionData.metadata.changes,
                    size: versionData.metadata.size,
                },
            });

            // 验证自动生成的字段
            expect(result.id).toBeDefined();
            expect(result.created_at).toBeDefined();
            expect(result.updated_at).toBeDefined();
            expect(result.metadata.hash).toBeDefined();
            expect(result.metadata.hash!.length).toBeGreaterThan(0);

            // 验证是否真的保存到了数据库
            const saved = await repository.findById(result.id);
            expect(saved).toEqual(result);
        });

        it('should generate correct version numbers', async () => {
            const baseData = {
                snippet_id: '123e4567-e89b-12d3-a456-426614174000',
                content: 'console.log("Hello World");',
                metadata: {
                    changes: ['Initial version'],
                    size: 100,
                },
            };

            const version1 = await repository.create(baseData);
            expect(version1.version_number).toBe(1);

            const version2 = await repository.create(baseData);
            expect(version2.version_number).toBe(2);

            const version3 = await repository.create(baseData);
            expect(version3.version_number).toBe(3);
        });

        it('should calculate content hash correctly', async () => {
            const content = 'console.log("Hello World");';
            const versionData = {
                snippet_id: '123e4567-e89b-12d3-a456-426614174000',
                content,
                metadata: {
                    changes: ['Initial version'],
                    size: content.length,
                },
            };

            const version1 = await repository.create(versionData);
            const version2 = await repository.create(versionData);

            // 相同内容应该有相同的哈希值
            expect(version1.metadata.hash).toBe(version2.metadata.hash);

            // 不同内容应该有不同的哈希值
            const version3 = await repository.create({
                ...versionData,
                content: 'console.log("Different content");',
            });
            expect(version3.metadata.hash).not.toBe(version1.metadata.hash);
        });

        it('should throw ValidationError for invalid data', async () => {
            const invalidData = {
                snippet_id: 'invalid-uuid',  // 无效的 UUID
                content: 'console.log("Hello World");',
                metadata: {
                    changes: ['Initial version'],
                    size: -1,  // 无效的大小
                },
            };

            await expect(repository.create(invalidData)).rejects.toThrow(ValidationError);
        });
    });

    describe('find operations', () => {
        let versions: Version[];

        beforeEach(async () => {
            // 确保版本按顺序创建
            const baseData = {
                snippet_id: '123e4567-e89b-12d3-a456-426614174000',
                content: 'console.log("Hello World");',
                metadata: {
                    changes: ['Initial version'],
                    size: 100,
                },
            };

            // 按顺序创建版本
            versions = [];
            versions.push(await repository.create(baseData));
            versions.push(await repository.create({
                ...baseData,
                content: 'console.log("Version 2");',
            }));
            versions.push(await repository.create({
                ...baseData,
                content: 'console.log("Version 3");',
            }));
        });

        describe('findById', () => {
            it('should find version by id', async () => {
                const result = await repository.findById(versions[0].id);
                expect(result).toEqual(versions[0]);
            });

            it('should return null for non-existent id', async () => {
                const result = await repository.findById('non-existent-id');
                expect(result).toBeNull();
            });
        });

        describe('findBySnippetId', () => {
            it('should find all versions for a snippet', async () => {
                const results = await repository.findBySnippetId(versions[0].snippet_id);
                expect(results).toHaveLength(versions.length);
                // 按版本号排序后比较
                const sortedResults = [...results].sort((a, b) => a.version_number - b.version_number);
                expect(sortedResults).toEqual(versions);
            });

            it('should return empty array for non-existent snippet id', async () => {
                const results = await repository.findBySnippetId('non-existent-id');
                expect(results).toHaveLength(0);
            });
        });

        describe('findLatestVersion', () => {
            it('should find the latest version for a snippet', async () => {
                const result = await repository.findLatestVersion(versions[0].snippet_id);
                expect(result).toEqual(versions[2]); // 最后创建的版本
            });

            it('should return null for non-existent snippet id', async () => {
                const result = await repository.findLatestVersion('non-existent-id');
                expect(result).toBeNull();
            });
        });
    });

    describe('error handling', () => {
        it('should handle database connection errors', async () => {
            await connection.disconnect();
            const versionData = {
                snippet_id: '123e4567-e89b-12d3-a456-426614174000',
                content: 'console.log("Hello World");',
                metadata: {
                    changes: ['Initial version'],
                    size: 100,
                },
            };

            await expect(repository.create(versionData)).rejects.toThrow(DatabaseError);
        });

        it('should handle transaction errors', async () => {
            // 模拟事务错误
            jest.spyOn(connection, 'transaction').mockRejectedValueOnce(new Error('Transaction failed'));

            const versionData = {
                snippet_id: '123e4567-e89b-12d3-a456-426614174000',
                content: 'console.log("Hello World");',
                metadata: {
                    changes: ['Initial version'],
                    size: 100,
                },
            };

            await expect(repository.create(versionData)).rejects.toThrow(DatabaseError);
        });
    });
}); 