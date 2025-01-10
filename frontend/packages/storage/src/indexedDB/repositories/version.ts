import { IDBPObjectStore } from 'idb';
import { v4 as uuidv4 } from 'uuid';
import { ZodError } from 'zod';
import { DB_CONFIG } from '../../core/constants';
import { DatabaseError, ValidationError } from '../../core/errors';
import { Version, VersionSchema } from '../../core/types';
import { DatabaseConnection } from '../connection';

type StoreNames = keyof typeof DB_CONFIG.stores;

export interface VersionDiff {
    added: string[];
    removed: string[];
    changed: string[];
}

export class VersionRepository {
    private connection: DatabaseConnection;
    private storeName: StoreNames;

    constructor(connection?: DatabaseConnection) {
        this.connection = connection || new DatabaseConnection();
        this.storeName = 'versions';
    }

    /**
     * 创建新版本
     * @param version 版本数据（不包含 id、时间戳和版本号）
     * @returns 创建的版本
     */
    async create(
        version: Omit<Version, 'id' | 'created_at' | 'updated_at' | 'version_number'>
    ): Promise<Version> {
        try {
            // 生成版本号
            const versionNumber = await this.generateVersionNumber(version.snippet_id);

            // 计算内容哈希
            const hash = await this.calculateHash(version.content);

            // 创建新版本对象
            const now = new Date().toISOString();
            const newVersion: Version = {
                ...version,
                id: uuidv4(),
                created_at: now,
                updated_at: now,
                version_number: versionNumber,
                metadata: {
                    ...version.metadata,
                    hash,
                },
            };

            // 验证数据
            try {
                VersionSchema.parse(newVersion);
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
                    await store.add(newVersion);
                }
            );

            return newVersion;
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            throw new DatabaseError(error instanceof Error ? error.message : 'Failed to create version');
        }
    }

    /**
     * 根据 ID 查找版本
     * @param id 版本 ID
     * @returns 版本数据或 null
     */
    async findById(id: string): Promise<Version | null> {
        try {
            const version = await this.connection.transaction(
                this.storeName,
                'readonly',
                async (store: IDBPObjectStore<unknown, string[], StoreNames, 'readonly'>) => {
                    return store.get(id) as Promise<Version | undefined>;
                }
            );

            return version || null;
        } catch (error) {
            throw new DatabaseError(error instanceof Error ? error.message : 'Failed to find version');
        }
    }

    /**
     * 根据代码片段 ID 查找所有版本
     * @param snippetId 代码片段 ID
     * @returns 版本列表
     */
    async findBySnippetId(snippetId: string): Promise<Version[]> {
        try {
            const versions = await this.connection.transaction(
                this.storeName,
                'readonly',
                async (store: IDBPObjectStore<unknown, string[], StoreNames, 'readonly'>) => {
                    const index = store.index('snippet_id');
                    return index.getAll(snippetId) as Promise<Version[]>;
                }
            );

            return versions;
        } catch (error) {
            throw new DatabaseError(
                error instanceof Error ? error.message : 'Failed to find versions by snippet ID'
            );
        }
    }

    /**
     * 获取代码片段的最新版本
     * @param snippetId 代码片段 ID
     * @returns 最新版本或 null
     */
    async findLatestVersion(snippetId: string): Promise<Version | null> {
        try {
            const versions = await this.findBySnippetId(snippetId);
            if (versions.length === 0) {
                return null;
            }

            // 按版本号降序排序
            versions.sort((a, b) => b.version_number - a.version_number);
            return versions[0];
        } catch (error) {
            throw new DatabaseError(
                error instanceof Error ? error.message : 'Failed to find latest version'
            );
        }
    }

    /**
     * 生成新的版本号
     * @param snippetId 代码片段 ID
     * @returns 新版本号
     */
    private async generateVersionNumber(snippetId: string): Promise<number> {
        try {
            const latestVersion = await this.findLatestVersion(snippetId);
            return latestVersion ? latestVersion.version_number + 1 : 1;
        } catch (error) {
            throw new DatabaseError(
                error instanceof Error ? error.message : 'Failed to generate version number'
            );
        }
    }

    /**
     * 计算内容的哈希值
     * @param content 内容
     * @returns 哈希值
     */
    private async calculateHash(content: string): Promise<string> {
        // 使用 Web Crypto API 计算 SHA-256 哈希
        const encoder = new TextEncoder();
        const data = encoder.encode(content);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
} 