import React, { useCallback, useEffect, useMemo, useReducer } from "react";

import type {
    SystemContextProps,
    SystemState,
    SystemAction,
} from "@elucidario/types-design-system";

import { merge } from "lodash-es";

import "./tailwind.css";
import { useViewPortSize } from "@/hooks";
import { SystemActionTypes, Context, defaultContext } from "./defaultContext";

export const SystemProvider = ({
    children,
}: React.PropsWithChildren<SystemContextProps>) => {
    /**
     *   _______  _______  _______  _______  _______
     *  |       ||       ||   _   ||       ||       |
     *  |  _____||_     _||  |_|  ||_     _||    ___|
     *  | |_____   |   |  |       |  |   |  |   |___
     *  |_____  |  |   |  |       |  |   |  |    ___|
     *   _____| |  |   |  |   _   |  |   |  |   |___
     *  |_______|  |___|  |__| |__|  |___|  |_______|
     */
    const [state, dispatch] = useReducer<
        React.Reducer<SystemState, SystemAction>
    >(
        (state: SystemState, action: SystemAction): SystemState => {
            switch (action.type) {
                case SystemActionTypes.SET_VARIANT:
                    return {
                        ...state,
                        variant: action.payload.variant || state.variant,
                    };
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
            variant: defaultContext.variant,
            theme: defaultContext.theme,
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
    const { middleHeight } = useMemo(() => {
        return {
            middleHeight:
                viewPort.height -
                ((state.variant === "default" ? 80 : 128) + 32), // Header + Footer
        };
    }, [viewPort.height, state.variant]);

    const props: SystemState = useMemo(
        () =>
            merge({}, state, {
                viewPort,
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
    /**
     * Set middle height to CSS variable --middle-height
     * @link ../../style/theme.ts
     */
    useEffect(() => {
        document.documentElement.style.setProperty(
            "--middle-height",
            `${middleHeight}px`,
        );
    }, [middleHeight]);

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

    /**
     * Set lang, variant and theme from props to state
     */
    // useEffect(() => {
    //     if (variant !== state.variant && variant) {
    //         dispatch({
    //             type: SystemActionTypes.SET_VARIANT,
    //             payload: { variant },
    //         });
    //     }
    //     if (theme !== state.theme && theme) {
    //         dispatch({
    //             type: SystemActionTypes.SET_VARIANT,
    //             payload: { theme },
    //         });
    //     }
    // }, [lang, variant, theme]);

    // TODO remove before PR  [START]
    const debug = {
        viewPort,
        middleHeight,
        // variant,
        // lang,
        state,
    };
    useEffect(() => {
        console.log(debug);
    }, Object.values(debug));
    // TODO remove before PR [END]

    return <Context.Provider value={props}>{children}</Context.Provider>;
};
