import { useEffect, useState } from "react";

export function useMousePosition(ref?: React.RefObject<HTMLElement | null>) {
    const [position, setPosition] = useState({
        mouseX: 0,
        mouseY: 0,
        percentX: 0,
        percentY: 0,
    });

    useEffect(() => {
        function handleMouseMove(event: MouseEvent) {
            const bounds = ref?.current?.getBoundingClientRect();
            const x = bounds ? event.clientX - bounds.left : event.clientX;
            const y = bounds ? event.clientY - bounds.top : event.clientY;
            setPosition({
                mouseX: x,
                mouseY: y,
                percentX: Math.round((x / window.innerWidth) * 100),
                percentY: Math.round((y / window.innerHeight) * 100),
            });
        }
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [ref]);

    return position;
}
