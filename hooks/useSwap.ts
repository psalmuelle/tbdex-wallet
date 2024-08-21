import { create } from "zustand";

//To Set The Swap Type To (On-ramp, Off-ramp, Forex)
interface SwapTypeState {
  swapType: string;
  setSwapType: (swapType?: string) => void;
}

const useSwapType = create<SwapTypeState>()((set) => ({
  swapType: "on-ramp",
  setSwapType: (swapType) => set(() => ({ swapType: swapType })),
}));

// To Set The Loading State of The GetOfferings Button and the Offering Component
interface SwapLoadingState {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const useSwapLoading = create<SwapLoadingState>()((set) => ({
  isLoading: false,
  setIsLoading: (isLoading) => set(() => ({ isLoading: isLoading })),
}));

export { useSwapType, useSwapLoading };
