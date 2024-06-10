import React, { createContext, useEffect, useMemo, useReducer } from "react";

import type {
    SystemContextProvider,
    SystemContextProps,
    SystemState,
    SystemAction,
} from "@elucidario/types-design-system";
import { SystemActionTypes } from "./SystemActionTypes";

import { merge } from "lodash-es";

import "./tailwind.css";
import { useViewPortSize } from "@/hooks";

export const SystemContext = createContext<SystemContextProvider>({
    lang: "pt-BR",
});

export const SystemProvider = ({
    children,
    lang,
}: React.PropsWithChildren<{}> & SystemContextProps) => {
    const [state, dispatch] = useReducer(
        (state: SystemState, action: SystemAction) => {
            switch (action.type) {
                case SystemActionTypes.SET_LANG:
                    return { ...state, lang: action.payload };
                default:
                    throw new Error();
            }
        },
        {
            lang,
        },
    );

    const viewPort = useViewPortSize();

    const { middleHeight } = useMemo(() => {
        return {
            middleHeight: viewPort.height - (80 + 32), // Header + Footer
            // - 2 * 16, // Grid gap
        };
    }, [viewPort.height]);

    const props: SystemState = merge({}, state, {
        viewPort,
    });

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
        console.log({ viewPort, middleHeight });
    }, [viewPort]);

    return (
        <SystemContext.Provider value={props}>
            {children}
        </SystemContext.Provider>
    );
};
