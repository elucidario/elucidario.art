import { cn } from "@/utils";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ htmlFor, className, children, ...props }: LabelProps) {
    return (
        <label className={cn(className)} htmlFor={htmlFor} {...props}>
            {children}
        </label>
    );
}
