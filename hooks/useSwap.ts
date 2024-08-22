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

//To Store The SwapForm values

interface SwapFormState {
  swapForm: {
    from: string;
    to: string;
    amount: string;
    swapType?: string;
  };
  setSwapForm: (swapForm: SwapFormState["swapForm"]) => void;
}

const useSwapForm = create<SwapFormState>((set) => ({
  swapForm: {
    from: "",
    to: "",
    amount: "",
    swapType: "",
  },
  setSwapForm: (swapForm) => set(() => ({ swapForm: swapForm })),
}));

export { useSwapType, useSwapLoading, useSwapForm };
