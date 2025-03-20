export type ImageProps = Omit<
    React.ImgHTMLAttributes<HTMLImageElement>,
    "alt" | "width" | "height"
> & {
    alt: string;
    width: number;
    height: number;
};
