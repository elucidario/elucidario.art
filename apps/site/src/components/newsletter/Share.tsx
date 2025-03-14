import { useEffect, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";

import { SubmitHandler } from "react-hook-form";

import { Form } from "@/components/form";
import { cn } from "@/utils";

import type { NewsletterProps, NewsletterState } from "./types";
import { Heading } from "../typography";

export function Share<T extends Record<string, unknown>>({
    ctaRef,
    schema,
    submitLabel,
    includeListIds,
    templateId,
    redirectionUrl,
    addValuesToParams,
    additionalParams,
}: NewsletterProps<T>) {
    const [state, setState] = useState<NewsletterState>("idle");

    const handleSubmit: SubmitHandler<T> = (data) => {
        setState("loading");

        const redirUrl = `${redirectionUrl}${
            addValuesToParams
                ? `?${new URLSearchParams({ ...(data as Record<string, string>), ...(additionalParams as Record<string, string>) })}`
                : ""
        }`;

        const options = {
            method: "POST",
            url: "https://api.brevo.com/v3/contacts/doubleOptinConfirmation",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                "api-key": import.meta.env.VITE_BREVO_TOKEN,
            },
            data: {
                attributes: {
                    NOME: data.name,
                    JOB_TITLE: data.role,
                    ORGANIZATION: data.organization,
                },
                email: data.email,

                includeListIds,
                templateId,
                redirectionUrl: redirUrl,
            },
        };

        axios
            .request(options)
            .then(() => {
                setState("success");
            })
            .catch((error) => {
                console.error("Newsletter Error", { error });
                setState("error");
            });
    };

    useEffect(() => {
        if (["success", "error"].includes(state)) {
            const timeout = setTimeout(() => {
                setState("idle");
            }, 5000);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [state]);

    return (
        <section
            ref={ctaRef}
            id="cta-newsletter"
            className={cn(
                "bg-primary-light",
                "dark:bg-primary-dark",
                "lg:py-64",
                "px-4",
                "flex",
                "flex-col",
                "items-center",
                "justify-center",
                "border-b-4",
                "border-light",
                "dark:border-dark",
                "h-screen",
                "z-10",
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
                    "gap-10",
                    "shadow-2xl",
                    "shadow-secondary-light",
                    "dark:shadow-secondary-dark",
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
                    <AnimatePresence>
                        {(() => {
                            switch (state) {
                                case "idle":
                                    return (
                                        <motion.div exit={{ opacity: 0 }}>
                                            <Heading
                                                level={3}
                                                className={cn("font-mono")}
                                            >
                                                Que tal indicar um amigo?
                                            </Heading>
                                            <p className={cn("text-lg")}>
                                                Compartilhe o link e ajude a
                                                divulgar o elucidario.art!
                                            </p>
                                        </motion.div>
                                    );

                                case "loading":
                                    return (
                                        <Heading
                                            level={3}
                                            className={cn("font-mono")}
                                            exit={{ opacity: 0 }}
                                        >
                                            Enviando...
                                        </Heading>
                                    );

                                case "success":
                                    return (
                                        <Heading
                                            level={3}
                                            className={cn("font-mono")}
                                            exit={{ opacity: 0 }}
                                        >
                                            Confira seu e-mail para confirmar o
                                            cadastro.
                                        </Heading>
                                    );

                                case "error":
                                    return (
                                        <Heading
                                            level={3}
                                            className={cn("font-mono")}
                                            exit={{ opacity: 0 }}
                                        >
                                            Houve um erro ao enviar o
                                            formulário.
                                        </Heading>
                                    );
                            }
                        })()}
                    </AnimatePresence>
                </div>
                <div
                    className={cn(
                        "w-full",
                        "lg:w-3/5",
                        "flex",
                        "flex-col",
                        "gap-4",
                        "overflow-auto",
                    )}
                >
                    <Form
                        schema={schema}
                        submitLabel={submitLabel}
                        onValid={handleSubmit}
                        disabled={["loading", "error"].includes(state)}
                    />
                </div>
            </div>
        </section>
    );
}
