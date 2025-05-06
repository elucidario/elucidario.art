import { createContext, useContext } from "react";
import { MenuContextType } from "./types";

export const MenuContext = createContext<MenuContextType>({
    isActive: () => false,
});

export function useMenuContext() {
    return useContext(MenuContext);
}
