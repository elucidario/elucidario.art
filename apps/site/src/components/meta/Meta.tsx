import { Head } from "vike-react/Head";
import { MetaProps } from "./types";

export function Meta({ head, ...props }: MetaProps) {
    return head ? (
        <Head>
            <meta {...props} />
        </Head>
    ) : (
        <meta {...props} />
    );
}
