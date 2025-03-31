import { JsonLD, Meta } from "@/components";

import { Brand, OnlineBusiness } from "schema-dts";
import { usePageContext } from "vike-react/usePageContext";

export default function Head() {
    const {
        config: { lang },
    } = usePageContext();

    return (
        <>
            <link
                rel="icon"
                href={`${import.meta.env.BASE_URL}png/format=round-variant=compact.png`}
            />
            <Meta
                name="viewport"
                content="width=device-width, initial-scale=1"
            />
            <Meta property="og:type" content="website" />
            <Meta property="og:locale" content={lang as string} />
            <Meta
                property="og:image:alt"
                content={
                    'Um fundo com gradiente entre diversas cores com os dizeres: "elucidario.art (logo) Revolucione a Gestão de Sua Coleção!", abaixo tem outro logo da marca: "lcdr."'
                }
            />
            <JsonLD<Brand>
                data={{
                    "@context": "https://schema.org",
                    "@type": "Brand",
                    "@id": "https://elucidario.art/#brand",
                    name: "elucidario.art",
                    url: "https://elucidario.art",
                    logo: "https://elucidario.art/png/type=vertical-color=blue-theme=light.png",
                }}
            />
            <JsonLD<OnlineBusiness>
                data={{
                    "@context": "https://schema.org",
                    "@type": "OnlineBusiness",
                    "@id": "https://elucidario.art/#business",
                    founder: {
                        "@id": "https://elucidario.art/#henrique-godinho",
                    },
                    slogan: "Revolucione a Gestão de sua Coleção!",
                    foundingDate: "2024-12-21",
                    name: "elucidario.art",
                    brand: {
                        "@type": "Brand",
                        "@id": "https://elucidario.art/#brand",
                    },
                    keywords: "Gestão de Coleções, Museus, Arte, Cultura",
                    description:
                        "O elucidario.art é um Sistema de Gestão de Coleções em ativo desenvolvimento. Cadastre-se para receber novidades em primeira mão!",
                    url: "https://elucidario.art",
                    logo: "https://elucidario.art/png/type=vertical-color=blue-theme=light.png",
                    sameAs: [
                        "https://www.instagram.com/elucidario.art/",
                        "https://github.com/elucidario",
                    ],
                    contactPoint: {
                        "@type": "ContactPoint",
                        email: "ola@elucidario.art",
                    },
                }}
            />
            <script
                async
                src="https://www.googletagmanager.com/gtag/js?id=G-8KDGCN80JB"
            ></script>
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${import.meta.env.VITE_GA_ID}');
                `,
                }}
            />
        </>
    );
}
