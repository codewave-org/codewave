interface ProgressProps {
  isOpen: boolean;
}

interface ProgressItem {
  id: string;
  title: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
}

const PROGRESS_ITEMS: ProgressItem[] = [
  {
    id: '1',
    title: '两数之和',
    progress: 33,
    status: 'in-progress',
  },
  {
    id: '2',
    title: '三数之和',
    progress: 0,
    status: 'not-started',
  },
  {
    id: '3',
    title: '回文数',
    progress: 100,
    status: 'completed',
  },
];

export function Progress({ isOpen }: ProgressProps) {
  if (!isOpen) return null;

  return (
    <div className="w-80 bg-gray-900 p-4">
      <div className="text-white">
        <h2 className="mb-4 text-lg font-bold">进度</h2>
        <div className="space-y-4">
          {PROGRESS_ITEMS.map((item) => (
            <div key={item.id} className="bg-gray-800 p-3 rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">{item.title}</span>
                <span
                  className={`text-sm ${
                    item.status === 'completed'
                      ? 'text-green-500'
                      : item.status === 'in-progress'
                        ? 'text-blue-500'
                        : 'text-gray-500'
                  }`}
                >
                  {item.status === 'completed'
                    ? '已完成'
                    : item.status === 'in-progress'
                      ? '进行中'
                      : '未开始'}
                </span>
              </div>
              <div className="h-2 w-full bg-gray-700 rounded">
                <div
                  className={`h-full rounded ${
                    item.status === 'completed'
                      ? 'bg-green-500'
                      : item.status === 'in-progress'
                        ? 'bg-blue-500'
                        : 'bg-gray-500'
                  }`}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
              <div className="mt-1 text-right text-sm text-gray-400">{item.progress}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
