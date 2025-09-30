import { CodeLanguage } from '@/types/algorithm';

export interface CodeLanguageOption {
  id: CodeLanguage;
  label: string;
  prismLanguage: string;
  description?: string;
}

export const CODE_LANGUAGES: CodeLanguageOption[] = [
  { id: 'javascript', label: 'JavaScript', prismLanguage: 'javascript' },
  { id: 'java', label: 'Java', prismLanguage: 'java' },
  { id: 'cpp', label: 'C++', prismLanguage: 'cpp' },
  { id: 'csharp', label: 'C#', prismLanguage: 'csharp' },
  { id: 'c', label: 'C', prismLanguage: 'c' },
  { id: 'python', label: 'Python', prismLanguage: 'python' },
];
