import { useEffect, useState } from "react";

export function useMousePosition() {
    const [position, setPosition] = useState({
        mouseX: 0,
        mouseY: 0,
        percentX: 0,
        percentY: 0,
    });

    useEffect(() => {
        function handleMouseMove(event: { clientX: any; clientY: any }) {
            setPosition({
                mouseX: event.clientX,
                mouseY: event.clientY,
                percentX: Math.round((event.clientX / window.innerWidth) * 100),
                percentY: Math.round(
                    (event.clientY / window.innerHeight) * 100,
                ),
            });
        }
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return position;
}
