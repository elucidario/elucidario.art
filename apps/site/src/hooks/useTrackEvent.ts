export function useTrackEvent() {
    const trackEvent = (eventName: string, data: unknown) => {
        if (typeof window !== "undefined") {
            // @ts-expect-error - gtag is a global function
            window.gtag("event", eventName, data);
        }
    };

    return trackEvent;
}
