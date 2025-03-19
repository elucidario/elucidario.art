import { Head } from "vike-react/Head";
import { JsonLDProps } from "./types";
import { Thing } from "schema-dts";
import { useMemo } from "react";

export function JsonLD<T extends Thing>({ head, data }: JsonLDProps<T>) {
    const script = useMemo(() => {
        return (
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(data),
                }}
            />
        );
    }, []);

    return head ? <Head>{script}</Head> : script;
}
