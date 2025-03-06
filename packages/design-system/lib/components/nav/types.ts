import { LinkType, LinkProps } from "@/components/typography";

export type NavContextType = {
    expanded: string[];
    setExpanded?: (name: string) => void;
};
export type NavProviderProps = React.PropsWithChildren<
    React.HTMLAttributes<HTMLDivElement> &
        React.AriaAttributes &
        Partial<NavContextType>
>;
export type NavProps = React.PropsWithChildren<
    React.HTMLAttributes<HTMLDivElement> &
        React.AriaAttributes &
        Partial<NavContextType>
>;
export type NavToggleProps = React.PropsWithChildren<
    React.HTMLAttributes<HTMLButtonElement> &
        React.AriaAttributes & {
            name: string;
            icon?: React.ReactNode;
        }
>;
export type NavListProps = React.PropsWithChildren<
    React.HTMLAttributes<HTMLUListElement> & {
        name?: string;
    }
>;
export type NavItemProps = React.PropsWithChildren<
    React.HTMLAttributes<HTMLLIElement> & Partial<LinkType> & Partial<LinkProps>
>;
