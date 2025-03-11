import { Logo, Features, Heading } from "@/components";
import { useSystemProvider } from "@/provider";
import { cn } from "@/utils";
import { useRef } from "react";

export default function Page() {
    const { theme } = useSystemProvider();

    const ctaRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <header
                className={cn(
                    "pb-10",
                    "px-4",
                    "lg:sticky",
                    "top-0",
                    "flex",
                    "flex-col",
                    "gap-8",
                    "items-center",
                    "justify-between",
                    "z-20",
                    "bg-lcdr-light/70",
                    "dark:bg-lcdr-dark/90",
                )}
            >
                <Logo
                    type="horizontal"
                    theme={theme}
                    color="primary"
                    className={cn("pt-10", "max-w-[250px]", "lg:max-w-[500px]")}
                />
                <Heading level={1} className={cn("font-mono", "text-center")}>
                    Revolucione a Gestão de sua Coleção
                </Heading>
            </header>
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
            <div
                ref={ctaRef}
                className={cn(
                    "py-24",
                    "bg-primary-light",
                    "dark:bg-primary-dark",
                    "lg:py-64",
                    "px-4",
                    "flex",
                    "flex-col",
                    "items-center",
                    "border-b-4",
                    "border-light",
                    "dark:border-dark",
                )}
            >
                <div
                    className={cn(
                        "border-4",
                        "border-dark",
                        "dark:border-light",
                        "bg-light",
                        "dark:bg-dark",
                        "text-dark",
                        "dark:text-light",
                        "rounded-xl",
                        "max-w-4/5",
                        "lg:max-w-3/5",
                        "p-8",
                        "w-full",
                        "min-h-96",
                        "flex",
                        "flex-col",
                        "lg:flex-row",
                        "gap-4",
                    )}
                >
                    <div
                        className={cn(
                            "w-full",
                            "lg:w-2/5",
                            "flex",
                            "flex-col",
                            "gap-4",
                            "justify-center",
                        )}
                    >
                        <Heading level={3} className={cn("font-mono")}>
                            Cadastre-se e receba novidades em primeira mão!
                        </Heading>
                        <p className={cn("text-lg")}>
                            Ao cadastrar-se você concorda em entrar para a lista
                            de acesso antecipado e, em receber benefícios
                            exclusivos.
                        </p>
                    </div>
                    <div className={cn("w-full", "lg:w-3/5")}>ola mundo</div>
                </div>
            </div>
        </>
    );
}
