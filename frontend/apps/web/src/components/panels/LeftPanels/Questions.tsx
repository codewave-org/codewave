interface QuestionsProps {
  isOpen: boolean;
}

export function Questions({ isOpen }: QuestionsProps) {
  if (!isOpen) return null;

  return (
    <div className="w-80 bg-gray-900 p-4">
      <div className="text-white">
        <h2 className="mb-4 text-lg font-bold">两数之和</h2>
        <div className="space-y-2">
          <p>给定一个整数数组 nums 和一个整数目标值 target，</p>
          <p>请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标。</p>
          <div className="mt-4">
            <h3 className="text-md font-bold mb-2">示例：</h3>
            <pre className="bg-gray-800 p-2 rounded">
              输入：nums = [2,7,11,15], target = 9 输出：[0,1]
            </pre>
          </div>
          <div className="mt-4">
            <h3 className="text-md font-bold mb-2">提示：</h3>
            <ul className="list-disc list-inside">
              <li>2 ≤ nums.length ≤ 10⁴</li>
              <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
              <li>-10⁹ ≤ target ≤ 10⁹</li>
              <li>只会存在一个有效答案</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
