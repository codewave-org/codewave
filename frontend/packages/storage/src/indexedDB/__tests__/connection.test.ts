import { IDBPObjectStore } from 'idb';
import { DB_CONFIG } from '../../core/constants';
import { DatabaseError } from '../../core/errors';
import { DatabaseConnection } from '../connection';

type StoreNames = (typeof DB_CONFIG.stores)[keyof typeof DB_CONFIG.stores];

// 添加 structuredClone polyfill
if (typeof structuredClone === 'undefined') {
  (global as { structuredClone?: (obj: unknown) => unknown }).structuredClone = (obj: unknown) =>
    JSON.parse(JSON.stringify(obj));
}

describe('DatabaseConnection', () => {
  let connection: DatabaseConnection;
  let dbName: string;

  beforeEach(() => {
    // 为每个测试用例创建唯一的数据库名称
    dbName = `${DB_CONFIG.name}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    // 创建新的连接实例
    connection = new DatabaseConnection(dbName);
  });

  afterEach(async () => {
    // 清理连接
    await connection.disconnect();
    // 删除测试数据库
    await deleteDatabase(dbName);
    // 等待一段时间确保资源被清理
    await new Promise((resolve) => setTimeout(resolve, 500));
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

  describe('connect', () => {
    it('should connect to database successfully', async () => {
      const db = await connection.connect();
      expect(db).toBeDefined();
      expect(db.name).toBe(dbName);
      expect(db.version).toBe(DB_CONFIG.version);
      expect(connection.isConnected()).toBe(true);
    });

    it('should create object stores on first connection', async () => {
      const db = await connection.connect();
      const storeNames = Array.from(db.objectStoreNames);

      expect(storeNames).toContain(DB_CONFIG.stores.snippets);
      expect(storeNames).toContain(DB_CONFIG.stores.versions);
      expect(storeNames).toContain(DB_CONFIG.stores.tags);
    });

    it('should create indexes for snippet store', async () => {
      const db = await connection.connect();
      const snippetStore = db
        .transaction(DB_CONFIG.stores.snippets)
        .objectStore(DB_CONFIG.stores.snippets);
      const indexNames = Array.from(snippetStore.indexNames);

      expect(indexNames).toContain('title');
      expect(indexNames).toContain('language');
      expect(indexNames).toContain('tags');
    });

    it('should handle connection errors', async () => {
      // 模拟连接错误
      const mockOpen = jest.spyOn(indexedDB, 'open').mockImplementation(() => {
        const request = {
          error: new Error('Simulated connection error'),
          dispatchEvent: jest.fn(),
          addEventListener: jest.fn((type, handler) => {
            if (type === 'error') {
              handler({ target: request });
            }
          }),
          removeEventListener: jest.fn(),
        } as unknown as IDBOpenDBRequest;
        setTimeout(() => request.dispatchEvent(new Event('error')), 0);
        return request;
      });

      await expect(connection.connect()).rejects.toThrow(DatabaseError);
      expect(connection.isConnected()).toBe(false);
      mockOpen.mockRestore();
    });

    it('should handle blocked event', async () => {
      // 模拟数据库被阻塞
      const mockOpen = jest.spyOn(indexedDB, 'open').mockImplementation(() => {
        const request = {
          dispatchEvent: jest.fn(),
          addEventListener: jest.fn((type, handler) => {
            if (type === 'blocked') {
              handler({ target: request });
            }
          }),
          removeEventListener: jest.fn(),
        } as unknown as IDBOpenDBRequest;
        setTimeout(() => request.dispatchEvent(new Event('blocked')), 0);
        return request;
      });

      await expect(connection.connect()).rejects.toThrow('Database blocked');
      expect(connection.isConnected()).toBe(false);
      mockOpen.mockRestore();
    });

    it('should handle blocking event', async () => {
      // 先连接数据库
      await connection.connect();
      expect(connection.isConnected()).toBe(true);

      // 创建一个新的连接来触发 versionchange 事件
      const request = indexedDB.open(dbName, DB_CONFIG.version + 1);

      request.onupgradeneeded = () => {
        // 升级事件会触发原连接的 versionchange 事件
      };

      request.onsuccess = () => {
        const db = request.result;
        db.close();
      };

      // 等待事件处理完成
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 验证连接是否已断开
      expect(connection.isConnected()).toBe(false);

      // 清理
      request.onerror = null;
      request.onupgradeneeded = null;
      request.onsuccess = null;
    });

    it('should handle terminated event', async () => {
      // 先连接数据库
      await connection.connect();
      expect(connection.isConnected()).toBe(true);

      // 模拟数据库被删除
      await deleteDatabase(dbName);

      // 等待事件处理完成
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 验证连接是否已终止
      expect(connection.isConnected()).toBe(false);
    });

    // 新增：测试数据库阻塞时的错误处理
    it('should handle blocked event with error', async () => {
      // 先连接数据库
      await connection.connect();
      expect(connection.isConnected()).toBe(true);

      // 创建一个新的连接并模拟阻塞错误
      const mockOpen = jest.spyOn(indexedDB, 'open').mockImplementation(() => {
        const request = {
          error: new Error('Database blocked'),
          dispatchEvent: jest.fn(),
          addEventListener: jest.fn((type, handler) => {
            if (type === 'blocked') {
              handler({ target: request });
            }
          }),
          removeEventListener: jest.fn(),
        } as unknown as IDBOpenDBRequest;
        setTimeout(() => request.dispatchEvent(new Event('blocked')), 0);
        return request;
      });

      const newConnection = new DatabaseConnection(dbName);
      await expect(newConnection.connect()).rejects.toThrow('Database blocked');
      expect(newConnection.isConnected()).toBe(false);

      mockOpen.mockRestore();
    });

    // 新增：测试数据库意外终止时的错误处理
    it('should handle terminated event with error', async () => {
      // 先连接数据库
      await connection.connect();
      expect(connection.isConnected()).toBe(true);

      // 模拟数据库意外终止
      await connection.disconnect();

      // 等待事件处理完成
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 验证连接是否已终止
      expect(connection.isConnected()).toBe(false);
    });

    // 新增：测试 versionchange 事件处理
    it('should handle versionchange event', async () => {
      // 先连接数据库
      await connection.connect();
      expect(connection.isConnected()).toBe(true);

      // 创建一个新的连接并尝试升级版本
      const request = indexedDB.open(dbName, DB_CONFIG.version + 1);

      // 等待事件处理完成
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 验证原连接是否已断开
      expect(connection.isConnected()).toBe(false);

      // 清理
      request.result?.close();
    });

    // 新增：测试 versionchange 事件处理时的错误
    it('should handle versionchange event with error', async () => {
      // 先连接数据库
      await connection.connect();
      expect(connection.isConnected()).toBe(true);

      // 创建一个新的连接并尝试升级版本，这会触发 versionchange 事件
      const request = indexedDB.open(dbName, DB_CONFIG.version + 1);

      // 等待事件处理完成
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 验证连接是否已断开
      expect(connection.isConnected()).toBe(false);

      // 清理
      request.result?.close();
    });
  });

  describe('disconnect', () => {
    it('should disconnect from database', async () => {
      await connection.connect();
      expect(connection.isConnected()).toBe(true);

      await connection.disconnect();
      expect(connection.isConnected()).toBe(false);
      expect(connection.getDatabase()).toBeNull();
    });

    it('should handle disconnect when not connected', async () => {
      expect(connection.isConnected()).toBe(false);
      await expect(connection.disconnect()).resolves.not.toThrow();
    });
  });

  describe('transaction', () => {
    beforeEach(async () => {
      await connection.connect();
    });

    it('should handle read transaction successfully', async () => {
      const result = await connection.transaction(
        DB_CONFIG.stores.snippets,
        'readonly',
        async (store: IDBPObjectStore<unknown, string[], StoreNames, 'readonly'>) => {
          const count = await store.count();
          return count;
        }
      );
      expect(result).toBe(0);
    });

    it('should handle write transaction successfully', async () => {
      const testData = {
        id: '123',
        title: 'Test Snippet',
        content: 'Test Content',
        language: 'javascript',
        tags: ['test'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await connection.transaction(
        DB_CONFIG.stores.snippets,
        'readwrite',
        async (store: IDBPObjectStore<unknown, string[], StoreNames, 'readwrite'>) => {
          await store.clear(); // 清除之前的数据
          const key = await store.add(testData);
          return key;
        }
      );

      const result = await connection.transaction(
        DB_CONFIG.stores.snippets,
        'readonly',
        async (store: IDBPObjectStore<unknown, string[], StoreNames, 'readonly'>) => {
          const data = await store.get('123');
          return data;
        }
      );

      expect(result).toEqual(testData);
    });

    it('should handle transaction errors', async () => {
      const error = new DatabaseError('Transaction error');
      await expect(
        connection.transaction(DB_CONFIG.stores.snippets, 'readonly', async () => {
          throw error;
        })
      ).rejects.toThrow(error);
    });

    it('should handle non-DatabaseError transaction errors', async () => {
      const error = new Error('Generic error');
      await expect(
        connection.transaction(DB_CONFIG.stores.snippets, 'readonly', async () => {
          throw error;
        })
      ).rejects.toThrow(DatabaseError);
    });

    it('should handle transaction when not connected', async () => {
      await connection.disconnect();
      await expect(
        connection.transaction(DB_CONFIG.stores.snippets, 'readonly', async () => {
          return true;
        })
      ).rejects.toThrow('Database not connected');
    });
  });
});
