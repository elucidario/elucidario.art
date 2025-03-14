import vikeReact from "vike-react/config";
import type { Config } from "vike/types";
import Layout from "@/layouts/Layout";
import Head from "@/layouts/Head";

// Default config (can be overridden by pages)
export default {
    Layout,
    Head,

    // <title>
    title: "elucidario.art | Sistema de Gestão de Coleções",
    stream: true,
    extends: vikeReact,
} satisfies Config;
