import { usePageContext } from "vike-react/usePageContext";
import { Main, Heading, Image } from "@/components";

export default function Page() {
    const { is404 } = usePageContext();

    return (
        <Main className="h-screen flex flex-col items-center justify-center gap-10">
            <Heading level={1} className="font-mono">
                {is404
                    ? "404 - Página não encontrada"
                    : "500 - Erro interno do servidor"}
            </Heading>
            <Image src="gif/cat.gif" alt="Um gato fofo" width={300} />
        </Main>
    );
}
