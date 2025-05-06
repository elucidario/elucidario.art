import { VariantProps } from "class-variance-authority";
import { menuListVariants, menuSeparatorVariants } from "./variants";

export type MenuItemProps = {
    label: string;
    path: string;
    icon?: React.ReactNode;
    onClick?: () => void;
} & React.LiHTMLAttributes<HTMLLIElement>;

export type SubmenuProps = MenuItemProps;

export type MenuContextType = {
    isActive: (href: string) => boolean;
};

export type MenuProps = {
    active?: string;
    theme?: "light" | "dark";
    home?: string;
    social?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

export type MenuListProps = React.HtmlHTMLAttributes<HTMLUListElement> &
    VariantProps<typeof menuListVariants>;

export type MenuSeparatorProps = React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof menuSeparatorVariants>;
