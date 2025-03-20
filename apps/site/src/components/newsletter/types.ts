export type NewsletterProps<T extends Record<string, unknown>> = {
    ctaID: string;
    submitLabel?: string;
    schema: T;

    includeListIds: number[];
    templateId: number;

    redirectionUrl: string;
    addValuesToParams?: boolean;
    additionalParams?: Record<string, unknown>;
};

export type NewsletterState = "idle" | "loading" | "success" | "error";
