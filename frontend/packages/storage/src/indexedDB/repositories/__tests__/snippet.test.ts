import { DatabaseError, NotFoundError, ValidationError } from '../../../core/errors';
import { Snippet } from '../../../core/types';
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
    });

    describe('findAll', () => {
      it('should return all snippets', async () => {
        const results = await repository.findAll();
        expect(results).toHaveLength(snippets.length);
        expect(results).toEqual(expect.arrayContaining(snippets));
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
    });
  });

  describe('error handling', () => {
    it('should handle database connection errors', async () => {
      await connection.disconnect();
      const snippetData = {
        title: 'Test Snippet',
        content: 'Test Content',
        language: 'text',
        tags: ['test'],
      };

      await expect(repository.create(snippetData)).rejects.toThrow(DatabaseError);
    });

    it('should handle transaction errors', async () => {
      // 模拟事务错误
      jest.spyOn(connection, 'transaction').mockRejectedValueOnce(new Error('Transaction failed'));

      const snippetData = {
        title: 'Test Snippet',
        content: 'Test Content',
        language: 'text',
        tags: ['test'],
      };

      await expect(repository.create(snippetData)).rejects.toThrow(DatabaseError);
    });
  });
});
