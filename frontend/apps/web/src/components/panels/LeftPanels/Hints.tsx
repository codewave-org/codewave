interface HintsProps {
  isOpen: boolean;
}

export function Hints({ isOpen }: HintsProps) {
  if (!isOpen) return null;

  return (
    <div className="w-80 bg-gray-900 p-4">
      <div className="text-white">
        <h2 className="mb-4 text-lg font-bold">提示</h2>
        <div className="space-y-4">
          <div className="bg-gray-800 p-3 rounded">
            <h3 className="font-bold mb-2">提示 1</h3>
            <p>
              一个简单的暴力方法是使用两个循环。但是这样的时间复杂度是 O(n²)，有没有更好的方法？
            </p>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <h3 className="font-bold mb-2">提示 2</h3>
            <p>
              我们可以使用哈希表来优化查找效率。对于每个数 x，我们可以直接查找 target - x 是否存在。
            </p>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <h3 className="font-bold mb-2">提示 3</h3>
            <p>
              使用哈希表，我们可以将查找时间从 O(n) 降低到 O(1)。这样整体的时间复杂度就是 O(n)。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
