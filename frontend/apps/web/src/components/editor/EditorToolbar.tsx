import { LanguageSelector } from './LanguageSelector';

export function EditorToolbar() {
  return (
    <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
      <div className="flex items-center gap-4">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          onClick={() => {
            /* TODO: 运行代码 */
          }}
        >
          运行
        </button>
        <button
          className="px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
          onClick={() => {
            /* TODO: 保存代码 */
          }}
        >
          保存
        </button>
      </div>
      <div className="flex items-center gap-4">
        <LanguageSelector />
        <button
          className="px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
          onClick={() => {
            /* TODO: 格式化代码 */
          }}
        >
          格式化
        </button>
      </div>
    </div>
  );
}
