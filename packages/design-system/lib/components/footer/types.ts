import { VariantProps } from "class-variance-authority";
export type FooterProps<T extends (...args: any) => any> = React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement> & React.AriaAttributes & VariantProps<T>>;
