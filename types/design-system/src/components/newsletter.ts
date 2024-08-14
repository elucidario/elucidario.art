import type {
    FieldValues,
    SubmitHandler,
    SubmitErrorHandler,
} from "react-hook-form";

import { Fields } from "./form";

export type NewsletterProps = {
    onSubmit: SubmitHandler<FieldValues>;
    onError?: SubmitErrorHandler<FieldValues>;
    submitLabel?: string;
    fields?: Fields;
};
