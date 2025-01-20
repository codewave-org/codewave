import { useEditorStore } from '@/stores/editorStore';
import type { SupportedLanguage } from '@/types/editor';

const SUPPORTED_LANGUAGES: { value: SupportedLanguage; label: string }[] = [
  { value: 'cpp', label: 'C++' },
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
];

export function LanguageSelector() {
  const { language, setLanguage } = useEditorStore();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
      className="bg-gray-700 text-white px-3 py-1 rounded-md"
      aria-label="选择编程语言"
    >
      {SUPPORTED_LANGUAGES.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
