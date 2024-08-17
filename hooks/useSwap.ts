import { create } from "zustand";

interface SwapTypeState {
  swapType: string;
  setSwapType: (swapType?: string) => void;
}

const useSwapType = create<SwapTypeState>()((set) => ({
  swapType: "",
  setSwapType: (swapType) => set(() => ({ swapType: swapType })),
}));

export { useSwapType };
