import { DatabaseError, ValidationError } from '../../../core/errors';
import { Version, VersionSchema } from '../../../core/types';
import { DatabaseConnection } from '../../connection';
import { VersionRepository } from '../version';

if (typeof structuredClone === 'undefined') {
  (global as { structuredClone?: (obj: unknown) => unknown }).structuredClone = (obj: unknown) =>
    JSON.parse(JSON.stringify(obj));
}

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
        snippet_id: 'invalid-uuid', // 无效的 UUID
        content: 'console.log("Hello World");',
        metadata: {
          changes: ['Initial version'],
          size: -1, // 无效的大小
        },
      };

      await expect(repository.create(invalidData)).rejects.toThrow(ValidationError);
    });

    // 新增：测试非 ValidationError 的错误处理
    it('should handle non-ValidationError during validation', async () => {
      const error = new Error('Custom validation error');
      jest.spyOn(VersionSchema, 'parse').mockImplementationOnce(() => {
        throw error;
      });

      const versionData = {
        snippet_id: '123e4567-e89b-12d3-a456-426614174000',
        content: 'console.log("Hello World");',
        metadata: {
          changes: ['Initial version'],
          size: 100,
        },
      };

      await expect(repository.create(versionData)).rejects.toThrow(error);
    });

    // 新增：测试生成版本号时的错误处理
    it('should handle errors during version number generation', async () => {
      const error = new Error('Failed to generate version number');
      jest.spyOn(repository as VersionRepository, 'findLatestVersion').mockRejectedValueOnce(error);

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

    // 新增：测试计算哈希值时的错误处理
    it('should handle errors during hash calculation', async () => {
      const error = new Error('Failed to calculate hash');
      const originalSubtle = crypto.subtle;
      // @ts-expect-error: 模拟 crypto.subtle
      crypto.subtle = {
        digest: () => Promise.reject(error),
      };

      const versionData = {
        snippet_id: '123e4567-e89b-12d3-a456-426614174000',
        content: 'console.log("Hello World");',
        metadata: {
          changes: ['Initial version'],
          size: 100,
        },
      };

      await expect(repository.create(versionData)).rejects.toThrow(DatabaseError);

      // 恢复原始的 crypto.subtle
      // @ts-expect-error: 模拟 crypto.subtle
      crypto.subtle = originalSubtle;
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
      versions.push(
        await repository.create({
          ...baseData,
          content: 'console.log("Version 2");',
        })
      );
      versions.push(
        await repository.create({
          ...baseData,
          content: 'console.log("Version 3");',
        })
      );
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

      // 新增：测试数据库错误处理
      it('should handle database errors during findById', async () => {
        jest.spyOn(connection, 'transaction').mockRejectedValueOnce(new Error('DB Error'));
        await expect(repository.findById('some-id')).rejects.toThrow(DatabaseError);
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

      // 新增：测试数据库错误处理
      it('should handle database errors during findBySnippetId', async () => {
        jest.spyOn(connection, 'transaction').mockRejectedValueOnce(new Error('DB Error'));
        await expect(repository.findBySnippetId('some-id')).rejects.toThrow(DatabaseError);
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

      // 新增：测试数据库错误处理
      it('should handle database errors during findLatestVersion', async () => {
        jest.spyOn(connection, 'transaction').mockRejectedValueOnce(new Error('DB Error'));
        await expect(repository.findLatestVersion('some-id')).rejects.toThrow(DatabaseError);
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

    it('should handle non-DatabaseError transaction errors in create', async () => {
      // 模拟事务错误
      jest.spyOn(connection, 'transaction').mockRejectedValueOnce(new Error('Transaction failed'));

      await expect(
        repository.create({
          snippet_id: 'test-snippet',
          content: 'Test Content',
          metadata: {
            changes: [],
            size: 100,
            hash: 'test-hash',
          },
        })
      ).rejects.toThrow(DatabaseError);
    });

    it('should handle non-DatabaseError transaction errors in findById', async () => {
      // 模拟事务错误
      jest.spyOn(connection, 'transaction').mockRejectedValueOnce(new Error('Transaction failed'));

      await expect(repository.findById('test-id')).rejects.toThrow(DatabaseError);
    });

    it('should handle non-DatabaseError transaction errors in findBySnippetId', async () => {
      // 模拟事务错误
      jest.spyOn(connection, 'transaction').mockRejectedValueOnce(new Error('Transaction failed'));

      await expect(repository.findBySnippetId('test-snippet')).rejects.toThrow(DatabaseError);
    });

    it('should handle non-DatabaseError transaction errors in findLatestVersion', async () => {
      // 模拟事务错误
      jest.spyOn(connection, 'transaction').mockRejectedValueOnce(new Error('Transaction failed'));

      await expect(repository.findLatestVersion('test-snippet')).rejects.toThrow(DatabaseError);
    });

    it('should handle empty versions array in findLatestVersion', async () => {
      // 模拟空版本列表
      jest.spyOn(repository, 'findBySnippetId').mockResolvedValueOnce([]);

      const result = await repository.findLatestVersion('test-snippet');
      expect(result).toBeNull();
    });

    it('should handle non-DatabaseError transaction errors in generateVersionNumber', async () => {
      // 模拟事务错误
      jest.spyOn(connection, 'transaction').mockRejectedValueOnce(new Error('Transaction failed'));

      // 创建一个新版本，这会触发 generateVersionNumber
      await expect(
        repository.create({
          snippet_id: 'test-snippet',
          content: 'Test Content',
          metadata: {
            changes: [],
            size: 100,
            hash: 'test-hash',
          },
        })
      ).rejects.toThrow(DatabaseError);
    });

    it('should handle non-Zod validation errors in create', async () => {
      // 模拟 crypto.subtle.digest 失败
      const originalSubtle = crypto.subtle;
      // @ts-expect-error: 模拟 crypto.subtle
      crypto.subtle = {
        digest: () => Promise.reject(new Error('Hash calculation failed')),
      };

      await expect(
        repository.create({
          snippet_id: 'test-snippet',
          content: 'Test Content',
          metadata: {
            changes: [],
            size: 100,
          },
        })
      ).rejects.toThrow(DatabaseError);

      // 恢复原始的 crypto.subtle
      // @ts-expect-error: 恢复 crypto.subtle
      crypto.subtle = originalSubtle;
    });
  });

  describe('constructor', () => {
    it('should use default connection if not provided', () => {
      const repo = new VersionRepository();
      expect(repo).toBeInstanceOf(VersionRepository);
    });
  });
});
