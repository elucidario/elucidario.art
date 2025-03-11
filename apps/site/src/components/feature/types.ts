import { VariantProps } from "class-variance-authority";
import { featureVariants } from "./variants";

export type FeatureProps = React.HTMLAttributes<HTMLDivElement> & {
    title: string;
    description: React.ReactNode;
    cta?: React.ReactNode;
    ctaRef?: React.RefObject<HTMLDivElement | null>;
} & VariantProps<typeof featureVariants>;

export type FeaturesProps = React.HTMLAttributes<HTMLDivElement> & {
    features: FeatureProps[];
    ctaRef?: FeatureProps["ctaRef"];
};
