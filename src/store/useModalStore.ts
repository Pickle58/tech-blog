import { create } from "zustand";

interface ModalState {
  isSignInOpen: boolean;
  isSearchOpen: boolean;
  openSignIn: () => void;
  closeSignIn: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  closeAll: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isSearchOpen: false,
  isSignInOpen: false,
  openSignIn: () => set({ isSignInOpen: true, isSearchOpen: false }),
  closeSignIn: () => set({ isSignInOpen: false }),
  openSearch: () => set({ isSearchOpen: true, isSignInOpen: false }),
  closeSearch: () => set({ isSearchOpen: false }),
  closeAll: () => set({ isSearchOpen: false, isSignInOpen: false }),
}));