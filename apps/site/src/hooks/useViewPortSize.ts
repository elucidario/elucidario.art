import { useState, useEffect } from "react";

function getWindowDimensions() {
    const defaultBreakpoints = {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
    };

    // default to mobile for ssr
    const defaultViewport = {
        width: 480,
        height: 800,
        type: "unknown",
        isMobile: false,
        isTablet: false,
        isDesktop: false,
    };

    const { width, height, type, isDesktop, isMobile, isTablet } = (() => {
        if (typeof window !== "undefined") {
            const { innerWidth, innerHeight } = window;
            const viewport = {
                width: innerWidth,
                height: innerHeight,
                isMobile: innerWidth <= defaultBreakpoints.sm && innerWidth > 0,
                isTablet:
                    innerWidth <= defaultBreakpoints.lg &&
                    innerWidth >= defaultBreakpoints.md,
                isDesktop: innerWidth >= defaultBreakpoints.lg,
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
            return defaultViewport;
        }
    })();

    return {
        width,
        height,
        type,
        isDesktop,
        isMobile,
        isTablet,
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
        return () => {
            if (typeof window !== "undefined")
                window.removeEventListener("resize", handleResize);
        };
    }, []);

    return windowDimensions;
}
