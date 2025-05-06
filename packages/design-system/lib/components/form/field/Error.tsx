import { FieldDescription, FieldDescriptionProps } from "./Description";

export type FieldErrorProps = FieldDescriptionProps & {
    error?: string;
};

export function FieldError({ className, error }: FieldErrorProps) {
    return <FieldDescription className={className}>{error}</FieldDescription>;
}
