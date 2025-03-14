import { Head } from "vike-react/Head";
import { JsonLDProps } from "./types";

export function JsonLD({ data }: JsonLDProps) {
    return (
        <Head>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(data),
                }}
            />
        </Head>
    );
}
