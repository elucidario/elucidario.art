import type { VariantProps } from "class-variance-authority";
export type LogoProps<T extends (...args: any) => any> = React.HTMLAttributes<HTMLImageElement> & VariantProps<T>;
