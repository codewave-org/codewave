import { EditorState, Position, Selection, SupportedLanguage } from '@/types/editor';
import { create } from 'zustand';

interface EditorStore extends EditorState {
  setLanguage: (language: SupportedLanguage) => void;
  setCode: (code: string) => void;
  setPosition: (position: Position) => void;
  setSelection: (selection: Selection) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  language: 'cpp',
  code: '',
  setLanguage: (language) => set({ language }),
  setCode: (code) => set({ code }),
  setPosition: (position) => set({ position }),
  setSelection: (selection) => set({ selection }),
}));
