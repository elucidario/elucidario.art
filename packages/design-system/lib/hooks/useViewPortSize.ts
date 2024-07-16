import { useState, useEffect } from "react";

import { theme } from "@/style";

function getWindowDimensions() {
    const breakpoints = (() => {
        const {
            screens: { sm, md, lg, xl },
        } = theme as {
            screens: {
                sm: string | number;
                md: string | number;
                lg: string | number;
                xl: string | number;
            };
        };
        return {
            sm: parseInt(sm as string),
            md: parseInt(md as string),
            lg: parseInt(lg as string),
            xl: parseInt(xl as string),
        };
    })();

    const { width, height, type, isDesktop, isMobile, isTablet } = (() => {
        if (typeof window !== "undefined") {
            const { innerWidth, innerHeight } = window;
            const viewport = {
                width: innerWidth,
                height: innerHeight,
                isMobile: innerWidth <= breakpoints.sm && innerWidth >= 0,
                isTablet:
                    innerWidth <= breakpoints.lg &&
                    innerWidth >= breakpoints.md,
                isDesktop: innerWidth >= breakpoints.lg,
            };
            return {
                ...viewport,
                type: viewport.isMobile
                    ? "mobile"
                    : viewport.isTablet
                        ? "tablet"
                        : viewport.isDesktop
                            ? "desktop"
                            : "unknown",
            };
        } else {
            // default to mobile for ssr
            return {
                width: 480,
                height: 800,
                type: "mobile",
                isMobile: true,
                isTablet: false,
                isDesktop: false,
            };
        }
    })();

    return {
        width,
        height,
        type,
        isDesktop,
        isMobile,
        isTablet,
        breakpoints,
    };
}

export function useViewPortSize() {
    const [windowDimensions, setWindowDimensions] = useState(
        getWindowDimensions(),
    );

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }
        if (typeof window !== "undefined")
            window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowDimensions;
}
