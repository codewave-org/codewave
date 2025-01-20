interface WarningsProps {
  isOpen: boolean;
}

interface Warning {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  line?: number;
  column?: number;
}

const WARNINGS: Warning[] = [
  {
    id: '1',
    message: '第9行：循环条件可能导致无限循环',
    type: 'error',
    line: 9,
  },
  {
    id: '2',
    message: '第8行：未初始化的数组',
    type: 'warning',
    line: 8,
  },
  {
    id: '3',
    message: '建议：考虑使用 vector 代替固定大小数组',
    type: 'info',
  },
];

export function Warnings({ isOpen }: WarningsProps) {
  if (!isOpen) return null;

  return (
    <div className="w-80 bg-gray-900 p-4">
      <div className="text-white">
        <h2 className="mb-4 text-lg font-bold">警告</h2>
        <div className="space-y-3">
          {WARNINGS.map((warning) => (
            <div
              key={warning.id}
              className={`p-3 rounded ${
                warning.type === 'error'
                  ? 'bg-red-900/50'
                  : warning.type === 'warning'
                    ? 'bg-yellow-900/50'
                    : 'bg-blue-900/50'
              }`}
            >
              <div className="flex items-start gap-2">
                <span
                  className={`text-lg ${
                    warning.type === 'error'
                      ? 'text-red-500'
                      : warning.type === 'warning'
                        ? 'text-yellow-500'
                        : 'text-blue-500'
                  }`}
                >
                  {warning.type === 'error' ? '⚠️' : warning.type === 'warning' ? '⚠️' : 'ℹ️'}
                </span>
                <div>
                  <p>{warning.message}</p>
                  {warning.line && (
                    <p className="text-sm text-gray-400 mt-1">
                      位置：第 {warning.line} 行{warning.column && `，第 ${warning.column} 列`}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
