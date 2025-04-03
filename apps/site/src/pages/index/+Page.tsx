import { JSONSchemaType } from "ajv";
import { useMemo } from "react";

import {
    Features,
    Header,
    Heading,
    Newsletter,
    Main,
    Image,
    Link,
    Text,
    Section,
} from "@/components";
import { cn } from "@/utils";
import { usePageContext } from "vike-react/usePageContext";
import { Person } from "schema-dts";

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

    const links = [
        {
            href: "https://hgod.in/",
            title: "Sites",
        },
        {
            href: "https://linkedin.com/in/hgodinho/",
            title: "LinkedIn",
        },
        {
            href: "https://github.com/hgodinho",
            title: "GitHub",
        },
        {
            href: "http://lattes.cnpq.br/0325402816569874",
            title: "Lattes",
        },
    ];

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
            <Section<Person>
                className={cn(
                    "min-h-screen",
                    "bg-light",
                    "dark:bg-dark",
                    "flex",
                    "flex-col",
                    "gap-4",
                    "lg:gap-10",
                    "items-center",
                    "justify-center",
                    "px-4",
                    "pt-4",
                    "pb-16",
                )}
                metadata={{
                    "@context": "https://schema.org",
                    "@type": "Person",
                    "@id": "https://elucidario.art/#henrique-godinho",
                    name: "Henrique Godinho",
                    contactPoint: {
                        "@type": "ContactPoint",
                        email: "henrique@elucidario.art",
                    },
                    sameAs: links.map(({ href }) => href),
                }}
            >
                <Heading level={2} className={cn("text-center", "font-mono")}>
                    desenvolvido por
                </Heading>
                <div
                    className={cn(
                        "rounded-4xl",

                        "border",
                        "border-primary-light",
                        "dark:border-primary-dark",

                        "h-fit",
                        "md:w-11/12",
                        "lg:w-3/5",

                        "items-center",
                        "justify-center",

                        "shadow-2xl",
                        "shadow-secondary-light",
                        "dark:shadow-secondary-dark",

                        "flex",
                        "flex-col",
                        "md:flex-row",
                    )}
                    style={{
                        background:
                            "radial-gradient(transparent 4px, var(--color-primary-light, #ffffff) 16px) 0 0 / 8px 8px",
                    }}
                >
                    <div
                        className={cn(
                            "h-fit",
                            "w-fit",
                            "pt-8",
                            "px-8",
                            "flex",
                            "flex-col",
                            "gap-4",
                            "w-fit",
                            "lg:min-w-60",
                            "justify-center",
                            "items-center",
                        )}
                    >
                        <Image
                            src={"webp/henrique-godinho.webp"}
                            width={300}
                            height={300}
                            alt="Henrique Godinho"
                            className={cn(
                                "size-fit",
                                "max-w-60",
                                "max-h-60",
                                "rounded-full",
                            )}
                        />
                        <Heading
                            level={3}
                            className={cn("text-center", "font-mono")}
                        >
                            Henrique Godinho
                        </Heading>
                        <Text className={cn("space-x-2")}>
                            <Link
                                href={"mailto:henrique@elucidario.art"}
                                className={cn(
                                    "font-mono",
                                    "text-sm",
                                    "lg:text-base",
                                )}
                            >
                                {"henrique@elucidario.art"}
                            </Link>
                        </Text>
                        <Text className={cn("space-x-2", "text-center")}>
                            {links.map(({ href, title }) => (
                                <Link
                                    key={title}
                                    href={href}
                                    external={href.includes("http")}
                                    className={cn(
                                        "font-mono",
                                        "text-sm",
                                        "lg:text-base",
                                    )}
                                >
                                    {title}
                                </Link>
                            ))}
                        </Text>
                    </div>
                    <div
                        className={cn(
                            "w-full",
                            "lg:w-3/5",
                            "py-8",
                            "px-8",
                            "flex",
                            "flex-col",
                            "gap-4",
                            "lg:text-lg",
                        )}
                    >
                        <Text>
                            Mestre em Organização do Conhecimento e MBA em
                            Engenharia de Software pela USP, dedica sua pesquisa
                            ao desenvolvimento de soluções que facilitam a
                            organização, o acesso e a distribuição da informação
                            em instituições culturais, culminando na criação do{" "}
                            <strong>
                                Modelo de Dados para Organização e Representação
                                da Informação Museológica
                            </strong>{" "}
                            (MDORIM), a espinha dorsal do{" "}
                            <strong>elucidario.art</strong>. Com pós-graduação
                            em Comunicação e Design Digital pela ESPM-SP e
                            bacharelado em Artes Visuais pela Belas Artes,
                            agrega ao projeto uma sensibilidade estética e
                            funcional, garantindo uma experiência de usuário
                            intuitiva e envolvente.{" "}
                        </Text>
                        <Text>
                            Com experiência em desenvolvimento de projetos
                            digitais, a frente da comunicação da Casa Museu Ema
                            Klabin por mais de 10 anos, criou diversos projetos
                            incluindo o{" "}
                            <Link
                                target="_blank"
                                href="https://emaklabin.org.br/explore"
                            >
                                Explore a Coleção!,
                            </Link>{" "}
                            que integra conhecimento técnico em desenvolvimento
                            de software com expertise em organização da
                            informação.
                        </Text>
                    </div>
                </div>
            </Section>
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
