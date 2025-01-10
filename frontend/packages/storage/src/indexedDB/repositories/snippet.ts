import { IDBPObjectStore } from 'idb';
import { v4 as uuidv4 } from 'uuid';
import { ZodError } from 'zod';
import { DB_CONFIG } from '../../core/constants';
import { DatabaseError, NotFoundError, ValidationError } from '../../core/errors';
import { Snippet, SnippetSchema } from '../../core/types';
import { DatabaseConnection } from '../connection';

type StoreNames = keyof typeof DB_CONFIG.stores;

export class SnippetRepository {
  private connection: DatabaseConnection;
  private storeName: StoreNames;

  constructor(connection?: DatabaseConnection) {
    this.connection = connection || new DatabaseConnection();
    this.storeName = 'snippets';
  }

  async create(snippet: Omit<Snippet, 'id' | 'created_at' | 'updated_at'>): Promise<Snippet> {
    try {
      // 验证数据
      const now = new Date().toISOString();
      const newSnippet: Snippet = {
        ...snippet,
        id: uuidv4(),
        created_at: now,
        updated_at: now,
      };

      try {
        // 验证数据格式
        SnippetSchema.parse(newSnippet);
      } catch (error) {
        if (error instanceof ZodError) {
          throw new ValidationError(error.message);
        }
        throw error;
      }

      // 保存到数据库
      await this.connection.transaction(
        this.storeName,
        'readwrite',
        async (store: IDBPObjectStore<unknown, string[], StoreNames, 'readwrite'>) => {
          await store.add(newSnippet);
        }
      );

      return newSnippet;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError(error instanceof Error ? error.message : 'Failed to create snippet');
    }
  }

  async update(id: string, data: Partial<Omit<Snippet, 'id' | 'created_at'>>): Promise<Snippet> {
    try {
      const snippet = await this.findById(id);
      if (!snippet) {
        throw new NotFoundError(`Snippet with id ${id} not found`);
      }

      const updatedSnippet: Snippet = {
        ...snippet,
        ...data,
        updated_at: new Date().toISOString(),
      };

      try {
        // 验证更新后的数据
        SnippetSchema.parse(updatedSnippet);
      } catch (error) {
        if (error instanceof ZodError) {
          throw new ValidationError(error.message);
        }
        throw error;
      }

      // 保存到数据库
      await this.connection.transaction(
        this.storeName,
        'readwrite',
        async (store: IDBPObjectStore<unknown, string[], StoreNames, 'readwrite'>) => {
          await store.put(updatedSnippet);
        }
      );

      return updatedSnippet;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError(error instanceof Error ? error.message : 'Failed to update snippet');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const exists = await this.findById(id);
      if (!exists) {
        throw new NotFoundError(`Snippet with id ${id} not found`);
      }

      await this.connection.transaction(
        this.storeName,
        'readwrite',
        async (store: IDBPObjectStore<unknown, string[], StoreNames, 'readwrite'>) => {
          await store.delete(id);
        }
      );
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(error instanceof Error ? error.message : 'Failed to delete snippet');
    }
  }

  async findById(id: string): Promise<Snippet | null> {
    try {
      const snippet = await this.connection.transaction(
        this.storeName,
        'readonly',
        async (store: IDBPObjectStore<unknown, string[], StoreNames, 'readonly'>) => {
          return store.get(id) as Promise<Snippet | undefined>;
        }
      );

      return snippet || null;
    } catch (error) {
      throw new DatabaseError(error instanceof Error ? error.message : 'Failed to find snippet');
    }
  }

  async findAll(): Promise<Snippet[]> {
    try {
      const snippets = await this.connection.transaction(
        this.storeName,
        'readonly',
        async (store: IDBPObjectStore<unknown, string[], StoreNames, 'readonly'>) => {
          return store.getAll() as Promise<Snippet[]>;
        }
      );

      return snippets;
    } catch (error) {
      throw new DatabaseError(error instanceof Error ? error.message : 'Failed to find snippets');
    }
  }

  async findByTitle(title: string): Promise<Snippet[]> {
    try {
      const snippets = await this.connection.transaction(
        this.storeName,
        'readonly',
        async (store: IDBPObjectStore<unknown, string[], StoreNames, 'readonly'>) => {
          const index = store.index('title');
          return index.getAll(title) as Promise<Snippet[]>;
        }
      );

      return snippets;
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to find snippets by title'
      );
    }
  }

  async findByLanguage(language: string): Promise<Snippet[]> {
    try {
      const snippets = await this.connection.transaction(
        this.storeName,
        'readonly',
        async (store: IDBPObjectStore<unknown, string[], StoreNames, 'readonly'>) => {
          const index = store.index('language');
          return index.getAll(language) as Promise<Snippet[]>;
        }
      );

      return snippets;
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to find snippets by language'
      );
    }
  }

  async findByTag(tag: string): Promise<Snippet[]> {
    try {
      const snippets = await this.connection.transaction(
        this.storeName,
        'readonly',
        async (store: IDBPObjectStore<unknown, string[], StoreNames, 'readonly'>) => {
          const index = store.index('tags');
          return index.getAll(tag) as Promise<Snippet[]>;
        }
      );

      return snippets;
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to find snippets by tag'
      );
    }
  }
}
