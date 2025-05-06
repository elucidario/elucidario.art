import { create } from "zustand";

export type DsStore = {
    theme: "light" | "dark";
    actions: {
        setTheme: (theme: "light" | "dark") => void;
    };
};

export const useDsStore = create<DsStore>((set) => ({
    theme: "light",
    actions: {
        setTheme: (theme: "light" | "dark") => set({ theme }),
    },
}));

export const useTheme = () => useDsStore((state) => state.theme);

export const useDesignSystemActions = () =>
    useDsStore((state) => state.actions);
