import "./tailwind.css";

import React, { useCallback, useEffect, useMemo, useReducer } from "react";

import type { SystemContextProps, SystemState, SystemAction } from "./types";

import { useViewPortSize } from "@/hooks";

import { SystemActionTypes, Context, defaultContext } from "./Context";

export function SystemProvider({
    children,
    theme,
}: React.PropsWithChildren & SystemContextProps) {
    /**
     *   _______  _______  _______  _______  _______
     *  |       ||       ||   _   ||       ||       |
     *  |  _____||_     _||  |_|  ||_     _||    ___|
     *  | |_____   |   |  |       |  |   |  |   |___
     *  |_____  |  |   |  |       |  |   |  |    ___|
     *   _____| |  |   |  |   _   |  |   |  |   |___
     *  |_______|  |___|  |__| |__|  |___|  |_______|
     */
    const [state, dispatch] = useReducer(
        (state: SystemState, action: SystemAction): SystemState => {
            switch (action.type) {
                case SystemActionTypes.SET_THEME:
                    return {
                        ...state,
                        theme: action.payload.theme || state.theme,
                    };
                default:
                    throw new Error();
            }
        },
        {
            theme: theme || defaultContext.theme,
        },
    );

    const viewPort = useViewPortSize();

    const setTheme = useCallback(
        (theme: SystemState["theme"]) => {
            if (theme === state.theme) return;
            dispatch({
                type: SystemActionTypes.SET_THEME,
                payload: { theme },
            });
        },
        [state.theme],
    );

    /**
     *   __   __  _______  __   __  _______
     *  |  |_|  ||       ||  |_|  ||       |
     *  |       ||    ___||       ||   _   |
     *  |       ||   |___ |       ||  | |  |
     *  |       ||    ___||       ||  |_|  |
     *  | ||_|| ||   |___ | ||_|| ||       |
     *  |_|   |_||_______||_|   |_||_______|
     */

    const props: SystemState = useMemo(
        () => ({
            ...state,
            ...{
                viewPort,
            },
        }),
        [state, viewPort],
    );

    /**
     *   _______  _______  _______  _______  _______  _______  _______
     *  |       ||       ||       ||       ||       ||       ||       |
     *  |    ___||    ___||    ___||    ___||       ||_     _||  _____|
     *  |   |___ |   |___ |   |___ |   |___ |       |  |   |  | |_____
     *  |    ___||    ___||    ___||    ___||      _|  |   |  |_____  |
     *  |   |___ |   |    |   |    |   |___ |     |_   |   |   _____| |
     *  |_______||___|    |___|    |_______||_______|  |___|  |_______|
     */

    useEffect(() => {
        const mode = window.matchMedia("(prefers-color-scheme: dark)");

        if (mode.matches) {
            setTheme("dark");
        } else {
            setTheme("light");
        }

        mode.addEventListener("change", (e) => {
            if (e.matches) {
                setTheme("dark");
            } else {
                setTheme("light");
            }
        });
    }, [setTheme]);

    return <Context.Provider value={props}>{children}</Context.Provider>;
}
