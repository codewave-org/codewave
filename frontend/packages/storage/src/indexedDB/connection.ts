import { openDB, type IDBPDatabase, type IDBPObjectStore } from 'idb';
import { DB_CONFIG } from '../core/constants';
import { DatabaseError } from '../core/errors';

type TransactionMode = 'readonly' | 'readwrite' | 'versionchange';
type StoreNames = (typeof DB_CONFIG.stores)[keyof typeof DB_CONFIG.stores];

export class DatabaseConnection {
  private db: IDBPDatabase | null = null;
  private dbName: string;

  constructor(dbName?: string) {
    this.dbName = dbName || DB_CONFIG.name;
  }

  async connect(): Promise<IDBPDatabase> {
    try {
      this.db = await openDB(this.dbName, DB_CONFIG.version, {
        upgrade(db: IDBPDatabase) {
          // 数据库升级逻辑
          if (!db.objectStoreNames.contains(DB_CONFIG.stores.snippets)) {
            const snippetStore = db.createObjectStore(DB_CONFIG.stores.snippets, {
              keyPath: 'id',
            });
            snippetStore.createIndex('title', 'title', { unique: false });
            snippetStore.createIndex('language', 'language', { unique: false });
            snippetStore.createIndex('tags', 'tags', { unique: false, multiEntry: true });
          }

          if (!db.objectStoreNames.contains(DB_CONFIG.stores.versions)) {
            const versionStore = db.createObjectStore(DB_CONFIG.stores.versions, {
              keyPath: 'id',
            });
            versionStore.createIndex('snippet_id', 'snippet_id', { unique: false });
            versionStore.createIndex('created_at', 'created_at', { unique: false });
          }

          if (!db.objectStoreNames.contains(DB_CONFIG.stores.tags)) {
            const tagStore = db.createObjectStore(DB_CONFIG.stores.tags, {
              keyPath: 'id',
            });
            tagStore.createIndex('name', 'name', { unique: true });
          }
        },
        blocked: () => {
          // 处理数据库被阻塞
          throw new DatabaseError('Database blocked');
        },
        blocking: () => {
          // 处理此连接阻塞其他连接
          this.disconnect();
        },
        terminated: () => {
          // 处理连接意外终止
          this.db = null;
        },
      });

      // 添加事件监听器
      this.db.addEventListener('versionchange', () => {
        this.disconnect();
      });

      this.db.addEventListener('close', () => {
        this.db = null;
      });

      return this.db;
    } catch (error) {
      this.db = null;
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to connect to database'
      );
    }
  }

  async disconnect(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  async transaction<T, M extends TransactionMode = TransactionMode>(
    storeName: StoreNames,
    mode: M,
    callback: (store: IDBPObjectStore<unknown, string[], StoreNames, M>) => Promise<T>
  ): Promise<T> {
    if (!this.db) {
      throw new DatabaseError('Database not connected');
    }

    const tx = this.db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);

    try {
      const result = await callback(store as IDBPObjectStore<unknown, string[], StoreNames, M>);
      await tx.done;
      return result;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError(error instanceof Error ? error.message : 'Transaction failed');
    }
  }

  isConnected(): boolean {
    return this.db !== null;
  }

  getDatabase(): IDBPDatabase | null {
    return this.db;
  }
}
