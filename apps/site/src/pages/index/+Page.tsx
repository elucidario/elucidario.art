import { JSONSchemaType } from "ajv";
import { useMemo } from "react";

import { Features, Header, Heading, Newsletter, Main } from "@/components";
import { cn } from "@/utils";
import { usePageContext } from "vike-react/usePageContext";

type NewsletterFields = {
    name: string;
    organization: string;
    role: string;
    email: string;
};

export default function Page() {
    const schema = useMemo(() => {
        const schema: JSONSchemaType<NewsletterFields> = {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    title: "Nome",
                },
                organization: {
                    type: "string",
                    title: "Organização",
                },
                role: {
                    type: "string",
                    title: "Cargo",
                },
                email: {
                    type: "string",
                    title: "Email",
                    format: "email",
                },
            },
            required: ["name", "email"],
            additionalProperties: false,
        };

        return schema;
    }, []);

    const {
        config: { image },
    } = usePageContext();

    const ctaID = "cta-newsletter";

    return (
        <Main
            metadata={{
                "@context": "https://schema.org",
                "@type": "WebPage",
                name: "elucidario.art - Sistema de Gestão de Coleções",
                description:
                    "O elucidario.art é um Sistema de Gestão de Coleções em ativo desenvolvimento. Cadastre-se para receber novidades em primeira mão!",
                url: "https://elucidario.art",
                inLanguage: "pt-BR",
                potentialAction: {
                    "@type": "RegisterAction",
                    name: "Cadastre-se",
                    target: {
                        "@type": "EntryPoint",
                        urlTemplate: "https://elucidario.art/",
                    },
                },
                image: image ? (image as string) : undefined,
            }}
        >
            <Header color={"secondary"} />
            <Heading
                level={1}
                className={cn("font-mono", "text-center", "mx-4", "relative")}
            >
                Revolucione a Gestão de sua Coleção!
            </Heading>
            <Features
                ctaID={ctaID}
                features={[
                    {
                        title: "Gestão completa de sua Coleção",
                        description:
                            "Crie coleções, adicione itens, relacione com autores, descreva procedimentos de aquisição, empréstimo, conservação e muito mais",
                        cta: "Saiba Mais",
                    },
                    {
                        inverted: true,
                        title: "IA integrada ao sistema",
                        description:
                            "Faça perguntas em linguagem natural: Quantos itens tem em minha coleção? Quais itens tem origem asiática? Como foi realizada a restauração deste quadro?",
                        cta: "Cadastre-se",
                    },
                    {
                        title: "Acesse de qualquer lugar",
                        description:
                            "Aplicativos para computador, celular ou tablet",
                        cta: "Receba Novidades",
                    },
                    {
                        inverted: true,
                        title: "Compatível com outros sistemas",
                        description:
                            "Baseado no Linked-art, modelo de dados interoperável do CIDOC-ICOM",
                        cta: "Conheça",
                    },
                    {
                        title: "Open-source",
                        description:
                            "Auditável, customizável e implantação sob demanda",
                        cta: "Inscreva-se",
                    },
                ]}
            />
            <Newsletter
                ctaID={ctaID}
                schema={schema}
                submitLabel="Enviar"
                includeListIds={[7]}
                templateId={3}
                redirectionUrl="https://elucidario.art/"
                addValuesToParams={true}
            />
        </Main>
    );
}
