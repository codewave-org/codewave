import { DatabaseError, NotFoundError, ValidationError } from '../../../core/errors';
import { Snippet, SnippetSchema } from '../../../core/types';
import { DatabaseConnection } from '../../connection';
import { SnippetRepository } from '../snippet';

describe('SnippetRepository', () => {
  let connection: DatabaseConnection;
  let repository: SnippetRepository;
  let dbName: string;

  beforeEach(async () => {
    // 为每个测试用例创建唯一的数据库名称
    dbName = `test_db_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    connection = new DatabaseConnection(dbName);
    await connection.connect();
    repository = new SnippetRepository(connection);
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
    it('should create a new snippet successfully', async () => {
      const snippetData = {
        title: 'Test Snippet',
        content: 'console.log("Hello World");',
        language: 'javascript',
        tags: ['test', 'example'],
      };

      const result = await repository.create(snippetData);

      expect(result).toMatchObject(snippetData);
      expect(result.id).toBeDefined();
      expect(result.created_at).toBeDefined();
      expect(result.updated_at).toBeDefined();

      // 验证是否真的保存到了数据库
      const saved = await repository.findById(result.id);
      expect(saved).toEqual(result);
    });

    it('should throw ValidationError for invalid data', async () => {
      const invalidData = {
        title: '', // 标题不能为空
        content: 'console.log("Hello World");',
        language: 'javascript',
        tags: ['test'],
      };

      await expect(repository.create(invalidData)).rejects.toThrow(ValidationError);
    });

    // 新增：测试数据库错误处理
    it('should handle database errors during creation', async () => {
      // 模拟数据库错误
      jest.spyOn(connection, 'transaction').mockRejectedValueOnce(new Error('DB Error'));

      const snippetData = {
        title: 'Test Snippet',
        content: 'console.log("Hello World");',
        language: 'javascript',
        tags: ['test'],
      };

      await expect(repository.create(snippetData)).rejects.toThrow(DatabaseError);
    });

    // 新增：测试非 Zod 错误的处理
    it('should handle non-Zod validation errors', async () => {
      const error = new Error('Custom validation error');
      jest.spyOn(SnippetSchema, 'parse').mockImplementationOnce(() => {
        throw error;
      });

      const snippetData = {
        title: 'Test Snippet',
        content: 'console.log("Hello World");',
        language: 'javascript',
        tags: ['test'],
      };

      await expect(repository.create(snippetData)).rejects.toThrow(error);
    });
  });

  describe('update', () => {
    let existingSnippet: Snippet;

    beforeEach(async () => {
      existingSnippet = await repository.create({
        title: 'Original Title',
        content: 'Original Content',
        language: 'javascript',
        tags: ['original'],
      });
    });

    it('should update an existing snippet successfully', async () => {
      const updateData = {
        title: 'Updated Title',
        content: 'Updated Content',
        tags: ['updated'],
      };

      const originalUpdatedAt = existingSnippet.updated_at;
      await new Promise((resolve) => setTimeout(resolve, 10));
      const result = await repository.update(existingSnippet.id, updateData);

      expect(result.title).toBe(updateData.title);
      expect(result.content).toBe(updateData.content);
      expect(result.tags).toEqual(updateData.tags);
      expect(result.language).toBe(existingSnippet.language);
      expect(result.created_at).toBe(existingSnippet.created_at);
      expect(new Date(result.updated_at).getTime()).toBeGreaterThan(
        new Date(originalUpdatedAt).getTime()
      );

      // 验证是否真的更新到了数据库
      const saved = await repository.findById(result.id);
      expect(saved).toEqual(result);
    });

    it('should throw NotFoundError for non-existent snippet', async () => {
      const nonExistentId = 'non-existent-id';
      await expect(repository.update(nonExistentId, { title: 'New Title' })).rejects.toThrow(
        NotFoundError
      );
    });

    it('should throw ValidationError for invalid update data', async () => {
      await expect(
        repository.update(existingSnippet.id, { title: '' }) // 标题不能为空
      ).rejects.toThrow(ValidationError);
    });

    // 新增：测试数据库错误处理
    it('should handle database errors during update', async () => {
      // 模拟数据库错误
      jest.spyOn(connection, 'transaction').mockRejectedValueOnce(new Error('DB Error'));

      await expect(repository.update(existingSnippet.id, { title: 'New Title' })).rejects.toThrow(
        DatabaseError
      );
    });

    // 新增：测试非 Zod 错误的处理
    it('should handle non-Zod validation errors during update', async () => {
      const error = new Error('Custom validation error');
      jest.spyOn(SnippetSchema, 'parse').mockImplementationOnce(() => {
        throw error;
      });

      await expect(repository.update(existingSnippet.id, { title: 'New Title' })).rejects.toThrow(
        error
      );
    });
  });

  describe('delete', () => {
    let existingSnippet: Snippet;

    beforeEach(async () => {
      existingSnippet = await repository.create({
        title: 'To Be Deleted',
        content: 'Delete Me',
        language: 'javascript',
        tags: ['delete'],
      });
    });

    it('should delete an existing snippet successfully', async () => {
      await repository.delete(existingSnippet.id);

      // 验证是否真的从数据库中删除
      const result = await repository.findById(existingSnippet.id);
      expect(result).toBeNull();
    });

    it('should throw NotFoundError for non-existent snippet', async () => {
      const nonExistentId = 'non-existent-id';
      await expect(repository.delete(nonExistentId)).rejects.toThrow(NotFoundError);
    });

    // 新增：测试数据库错误处理
    it('should handle database errors during deletion', async () => {
      // 模拟数据库错误
      jest.spyOn(connection, 'transaction').mockRejectedValueOnce(new Error('DB Error'));

      await expect(repository.delete(existingSnippet.id)).rejects.toThrow(DatabaseError);
    });
  });

  describe('find operations', () => {
    let snippets: Snippet[];

    beforeEach(async () => {
      snippets = await Promise.all([
        repository.create({
          title: 'JavaScript Snippet',
          content: 'console.log("Hello");',
          language: 'javascript',
          tags: ['js', 'basic'],
        }),
        repository.create({
          title: 'Python Snippet',
          content: 'print("Hello")',
          language: 'python',
          tags: ['python', 'basic'],
        }),
        repository.create({
          title: 'Another JavaScript',
          content: 'alert("Hi");',
          language: 'javascript',
          tags: ['js', 'alert'],
        }),
      ]);
    });

    describe('findById', () => {
      it('should find snippet by id', async () => {
        const result = await repository.findById(snippets[0].id);
        expect(result).toEqual(snippets[0]);
      });

      it('should return null for non-existent id', async () => {
        const result = await repository.findById('non-existent-id');
        expect(result).toBeNull();
      });

      // 新增：测试数据库错误处理
      it('should handle database errors during findById', async () => {
        // 模拟数据库错误
        jest.spyOn(connection, 'transaction').mockRejectedValueOnce(new Error('DB Error'));

        await expect(repository.findById('some-id')).rejects.toThrow(DatabaseError);
      });
    });

    describe('findAll', () => {
      it('should return all snippets', async () => {
        const results = await repository.findAll();
        expect(results).toHaveLength(snippets.length);
        expect(results).toEqual(expect.arrayContaining(snippets));
      });

      // 新增：测试数据库错误处理
      it('should handle database errors during findAll', async () => {
        // 模拟数据库错误
        jest.spyOn(connection, 'transaction').mockRejectedValueOnce(new Error('DB Error'));

        await expect(repository.findAll()).rejects.toThrow(DatabaseError);
      });
    });

    describe('findByTitle', () => {
      it('should find snippets by exact title match', async () => {
        const results = await repository.findByTitle('JavaScript Snippet');
        expect(results).toHaveLength(1);
        expect(results[0]).toEqual(snippets[0]);
      });

      it('should return empty array for non-matching title', async () => {
        const results = await repository.findByTitle('Non-existent Title');
        expect(results).toHaveLength(0);
      });

      // 新增：测试数据库错误处理
      it('should handle database errors during findByTitle', async () => {
        // 模拟数据库错误
        jest.spyOn(connection, 'transaction').mockRejectedValueOnce(new Error('DB Error'));

        await expect(repository.findByTitle('some-title')).rejects.toThrow(DatabaseError);
      });
    });

    describe('findByLanguage', () => {
      it('should find snippets by language', async () => {
        const results = await repository.findByLanguage('javascript');
        expect(results).toHaveLength(2);
        expect(results).toEqual(expect.arrayContaining([snippets[0], snippets[2]]));
      });

      it('should return empty array for non-matching language', async () => {
        const results = await repository.findByLanguage('ruby');
        expect(results).toHaveLength(0);
      });

      // 新增：测试数据库错误处理
      it('should handle database errors during findByLanguage', async () => {
        // 模拟数据库错误
        jest.spyOn(connection, 'transaction').mockRejectedValueOnce(new Error('DB Error'));

        await expect(repository.findByLanguage('javascript')).rejects.toThrow(DatabaseError);
      });
    });

    describe('findByTag', () => {
      it('should find snippets by tag', async () => {
        const results = await repository.findByTag('basic');
        expect(results).toHaveLength(2);
        expect(results).toEqual(expect.arrayContaining([snippets[0], snippets[1]]));
      });

      it('should return empty array for non-matching tag', async () => {
        const results = await repository.findByTag('non-existent-tag');
        expect(results).toHaveLength(0);
      });

      // 新增：测试数据库错误处理
      it('should handle database errors during findByTag', async () => {
        // 模拟数据库错误
        jest.spyOn(connection, 'transaction').mockRejectedValueOnce(new Error('DB Error'));

        await expect(repository.findByTag('some-tag')).rejects.toThrow(DatabaseError);
      });
    });
  });

  describe('constructor', () => {
    it('should use default connection if not provided', () => {
      const repo = new SnippetRepository();
      expect(repo).toBeInstanceOf(SnippetRepository);
    });
  });

  describe('error handling', () => {
    it('should handle non-DatabaseError transaction errors', async () => {
      // 模拟事务错误
      jest.spyOn(connection, 'transaction').mockRejectedValueOnce(new Error('Transaction failed'));

      await expect(repository.findAll()).rejects.toThrow(DatabaseError);
    });

    it('should handle non-DatabaseError transaction errors in findByTitle', async () => {
      // 模拟事务错误
      jest.spyOn(connection, 'transaction').mockRejectedValueOnce(new Error('Transaction failed'));

      await expect(repository.findByTitle('test')).rejects.toThrow(DatabaseError);
    });

    it('should handle non-DatabaseError transaction errors in findByLanguage', async () => {
      // 模拟事务错误
      jest.spyOn(connection, 'transaction').mockRejectedValueOnce(new Error('Transaction failed'));

      await expect(repository.findByLanguage('javascript')).rejects.toThrow(DatabaseError);
    });

    it('should handle non-DatabaseError transaction errors in findByTag', async () => {
      // 模拟事务错误
      jest.spyOn(connection, 'transaction').mockRejectedValueOnce(new Error('Transaction failed'));

      await expect(repository.findByTag('test')).rejects.toThrow(DatabaseError);
    });

    it('should handle non-DatabaseError transaction errors in create', async () => {
      // 模拟事务错误
      jest.spyOn(connection, 'transaction').mockRejectedValueOnce(new Error('Transaction failed'));

      await expect(
        repository.create({
          title: 'Test Snippet',
          content: 'Test Content',
          language: 'javascript',
          tags: ['test'],
        })
      ).rejects.toThrow(DatabaseError);
    });

    it('should handle non-DatabaseError transaction errors in update', async () => {
      // 创建一个测试片段
      const snippet = await repository.create({
        title: 'Test Snippet',
        content: 'Test Content',
        language: 'javascript',
        tags: ['test'],
      });

      // 模拟事务错误
      jest.spyOn(connection, 'transaction').mockRejectedValueOnce(new Error('Transaction failed'));

      await expect(
        repository.update(snippet.id, {
          title: 'Updated Title',
        })
      ).rejects.toThrow(DatabaseError);
    });

    it('should handle non-DatabaseError transaction errors in delete', async () => {
      // 创建一个测试片段
      const snippet = await repository.create({
        title: 'Test Snippet',
        content: 'Test Content',
        language: 'javascript',
        tags: ['test'],
      });

      // 模拟事务错误
      jest.spyOn(connection, 'transaction').mockRejectedValueOnce(new Error('Transaction failed'));

      await expect(repository.delete(snippet.id)).rejects.toThrow(DatabaseError);
    });

    it('should handle non-DatabaseError transaction errors in findById', async () => {
      // 模拟事务错误
      jest.spyOn(connection, 'transaction').mockRejectedValueOnce(new Error('Transaction failed'));

      await expect(repository.findById('test-id')).rejects.toThrow(DatabaseError);
    });
  });
});
