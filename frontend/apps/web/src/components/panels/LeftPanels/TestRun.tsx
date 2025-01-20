interface TestRunProps {
  isOpen: boolean;
}

export function TestRun({ isOpen }: TestRunProps) {
  if (!isOpen) return null;

  return (
    <div className="w-80 bg-gray-900 p-4">
      <div className="text-white">
        <h2 className="mb-4 text-lg font-bold">测试用例</h2>
        <div className="space-y-4">
          <div className="bg-gray-800 p-3 rounded">
            <h3 className="font-bold mb-2">测试用例 1</h3>
            <pre className="bg-gray-700 p-2 rounded text-sm">
              输入：nums = [2,7,11,15], target = 9 输出：[0,1]
            </pre>
            <button
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              onClick={() => {
                /* TODO: 运行测试 */
              }}
            >
              运行
            </button>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <h3 className="font-bold mb-2">测试用例 2</h3>
            <pre className="bg-gray-700 p-2 rounded text-sm">
              输入：nums = [3,2,4], target = 6 输出：[1,2]
            </pre>
            <button
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              onClick={() => {
                /* TODO: 运行测试 */
              }}
            >
              运行
            </button>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <h3 className="font-bold mb-2">测试用例 3</h3>
            <pre className="bg-gray-700 p-2 rounded text-sm">
              输入：nums = [3,3], target = 6 输出：[0,1]
            </pre>
            <button
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              onClick={() => {
                /* TODO: 运行测试 */
              }}
            >
              运行
            </button>
          </div>
          <button
            className="w-full mt-4 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            onClick={() => {
              /* TODO: 运行所有测试 */
            }}
          >
            运行所有测试
          </button>
        </div>
      </div>
    </div>
  );
}
