import { Features, Header, Heading, JsonLD, Newsletter } from "@/components";
import { cn } from "@/utils";
import { JSONSchemaType } from "ajv";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useMemo, useRef, useState } from "react";

type NewsletterFields = {
    name: string;
    organization: string;
    role: string;
    email: string;
};

export default function Page() {
    const ctaRef = useRef<HTMLDivElement>(null);

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

    const [y, setY] = useState(0);

    const { scrollYProgress } = useScroll({
        target: ctaRef,
        offset: ["end end", "start start"],
    });

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        setY(latest);
    });

    return (
        <>
            <JsonLD
                data={{
                    "@context": "https://schema.org",
                    type: "OnlineBusiness",
                    email: "ola@elucidario.art",
                    name: "elucidario.art",
                    keywords: "Gestão de Coleções, Museus, Arte, Cultura",
                    description:
                        "O elucidario.art é um Sistema de Gestão de Coleções em ativo desenvolvimento. Cadastre-se para receber novidades em primeira mão!",
                    url: "https://elucidario.art",
                    logo: "https://elucidario.art/png/type=vertical, color=blue, theme=light.png",
                    sameAs: [
                        "https://www.instagram.com/elucidario.art/",
                        "https://github.com/elucidario",
                    ],
                }}
            />
            <Header color={"secondary"} theme={y > 0 ? "dark" : undefined} />
            <Heading
                level={1}
                className={cn("font-mono", "text-center", "mx-4", "relative")}
            >
                Revolucione a Gestão de sua Coleção
            </Heading>
            <Features
                ctaRef={ctaRef}
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
                ctaRef={ctaRef}
                schema={schema}
                submitLabel="Enviar"
                includeListIds={[7]}
                templateId={3}
                redirectionUrl="https://elucidario.art/"
                addValuesToParams={true}
            />
        </>
    );
}
