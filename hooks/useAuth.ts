import { create } from "zustand";
import { Web5 } from "@web5/api";

interface AuthState {
  userDID: string;
  web5: Web5 | null;
  setUserDID: (userDID?: string) => void;
  setUserWeb5: (web5?: Web5) => void;
}

const useAuth = create<AuthState>()((set) => ({
  userDID: "",
  web5: null,
  setUserDID: (userDID) => set(() => ({ userDID: userDID })),
  setUserWeb5: (web5) => set(() => ({ web5: web5 })),
}));

export default useAuth;
