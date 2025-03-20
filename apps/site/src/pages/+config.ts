import vikeReact from "vike-react/config";
import type { Config } from "vike/types";
import Layout from "@/layouts/Layout";
import Head from "@/layouts/Head";

// Default config (can be overridden by pages)
export default {
    Layout,
    Head,

    lang: "pt-BR",
    title: "elucidario.art | Sistema de Gestão de Coleções",
    image: "/png/lcdr-banner.webp",
    description:
        "O elucidario.art é um Sistema de Gestão de Coleções em ativo desenvolvimento. Cadastre-se para receber novidades em primeira mão!",
    stream: true,
    extends: vikeReact,
    prerender: true,
    htmlAttributes: {
        class: "scroll-smooth",
    },
} satisfies Config;
