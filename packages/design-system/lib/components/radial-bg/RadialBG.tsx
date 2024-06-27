import { useMousePosition } from "@/hooks";
import { cn } from "@/utils";
import { RadialBGProps } from "@elucidario/types-design-system";

export function RadialBG({ className, ...props }: RadialBGProps) {
    const { mouseX, mouseY } = useMousePosition();
    return (
        <div
            className={cn("radial-bg", "h-full", "w-full", "bg-white/50", className)}
            style={{
                background: `radial-gradient(circle at ${mouseX}px ${mouseY}px, var(--lcdr-blue), var(--lcdr-pink)) `,
            }}
            {...props}
        />
    );
}
