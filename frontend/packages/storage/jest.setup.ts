import 'fake-indexeddb/auto';

// Mock structuredClone if it's not available
if (typeof structuredClone === 'undefined') {
  (global as any).structuredClone = (obj: any) => {
    return JSON.parse(JSON.stringify(obj));
  };
}
