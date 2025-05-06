import { InputProps } from "./types";
import { inputVariants } from "./variants";

export function Input({ name, type, className, color, ...props }: InputProps) {
    return (
        <input
            name={name}
            type={type}
            className={inputVariants({ className, color })}
            {...props}
        />
    );
}
