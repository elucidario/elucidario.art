import { VariantProps } from "class-variance-authority";
import { featureVariants } from "./variants";

export type FeatureProps = React.HTMLAttributes<HTMLDivElement> & {
    title: string;
    description: React.ReactNode;
    ctaID?: string;
    cta?: React.ReactNode;
} & VariantProps<typeof featureVariants>;

export type FeaturesProps = React.HTMLAttributes<HTMLDivElement> & {
    features: FeatureProps[];
    ctaID?: FeatureProps["ctaID"];
};
