import { createContext } from "react";

export const NavContext = createContext({
    openMenu: "",
    setOpenMenu: (menu: string) => { },
});
