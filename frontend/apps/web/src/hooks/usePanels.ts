import { create } from 'zustand';

export type PanelType = 'questions' | 'hints' | 'testrun' | 'chat' | 'progress' | 'warnings';
export type PanelSide = 'left' | 'right';

export interface PanelState {
  activePanel: {
    left: PanelType | null;
    right: PanelType | null;
  };
  togglePanel: (side: PanelSide, panel: PanelType) => void;
  closePanel: (side: PanelSide) => void;
}

export const usePanels = create<PanelState>((set) => ({
  activePanel: {
    left: null,
    right: null,
  },
  togglePanel: (side, panel) =>
    set((state) => ({
      activePanel: {
        ...state.activePanel,
        [side]: state.activePanel[side] === panel ? null : panel,
      },
    })),
  closePanel: (side) =>
    set((state) => ({
      activePanel: {
        ...state.activePanel,
        [side]: null,
      },
    })),
}));
