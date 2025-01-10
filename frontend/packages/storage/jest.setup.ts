import 'fake-indexeddb/auto';

// Mock structuredClone if it's not available
if (typeof structuredClone === 'undefined') {
  (global as any).structuredClone = (obj: any) => {
    return JSON.parse(JSON.stringify(obj));
  };
}

// Add TextEncoder and TextDecoder to global
if (typeof TextEncoder === 'undefined') {
  (global as any).TextEncoder = class TextEncoder {
    encode(str: string): Uint8Array {
      const arr = new Uint8Array(str.length);
      for (let i = 0; i < str.length; i++) {
        arr[i] = str.charCodeAt(i);
      }
      return arr;
    }
  };
}

if (typeof TextDecoder === 'undefined') {
  (global as any).TextDecoder = class TextDecoder {
    decode(arr: Uint8Array): string {
      return String.fromCharCode.apply(null, Array.from(arr));
    }
  };
}

// Mock crypto
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (arr: Uint8Array): Uint8Array => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    },
    subtle: {
      digest: async (_algorithm: string, data: ArrayBuffer): Promise<ArrayBuffer> => {
        // 简单的哈希实现，仅用于测试
        const view = new Uint8Array(data);
        let hash = 0;
        for (let i = 0; i < view.length; i++) {
          hash = (hash << 5) - hash + view[i];
          hash = hash & hash;
        }
        const result = new Uint8Array(32); // SHA-256 produces 32 bytes
        const hashView = new DataView(result.buffer);
        hashView.setInt32(0, hash);
        return result.buffer;
      },
    },
  },
});
