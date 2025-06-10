import fs from "fs";
import path from "path";

export function readNestedFiles(dir: string): string[] {
    let content: string[] = []; // Array para armazenar o conteúdo dos arquivos

    try {
        // Verifica se o caminho fornecido é realmente um diretório
        if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
            console.warn(
                `Atenção: O diretório "${dir}" não existe ou não é um diretório.`,
            );
            return []; // Retorna array vazio se não for um diretório válido
        }

        // Lê todos os itens (arquivos e subdiretórios) dentro do diretórioOrigem
        const dirItems = fs.readdirSync(dir);

        // Itera sobre cada item encontrado no diretório
        for (const item of dirItems) {
            // Cria o caminho completo para o item
            const fullPath = path.join(dir, item);

            // Obtém informações sobre o item (para saber se é arquivo ou diretório)
            const statItem = fs.statSync(fullPath);

            if (statItem.isFile()) {
                // Se for um arquivo, lê o seu conteúdo
                try {
                    const fileContent = fs.readFileSync(fullPath, "utf8");
                    // Adiciona o conteúdo do arquivo ao nosso array de resultados
                    content.push(fileContent);
                } catch (err) {
                    console.error(
                        `Erro ao ler o arquivo "${fullPath}":`,
                        (err as Error).message,
                    );
                    // Pode optar por continuar ou parar, aqui vamos continuar
                }
            } else if (statItem.isDirectory()) {
                // Se for um diretório, chama a função recursivamente para este subdiretório
                const subDirItems = readNestedFiles(fullPath);
                // Adiciona os conteúdos retornados da chamada recursiva ao array principal
                // Usamos o operador spread (...) para mesclar os arrays
                content = [...content, ...subDirItems];
            }
        }
    } catch (err) {
        console.error(
            `Erro ao processar o diretório "${dir}":`,
            (err as Error).message,
        );
        // Em caso de erro geral (ex: permissão negada para ler o diretório), retorna array vazio
        return [];
    }

    return content; // Retorna o array com todos os conteúdos
}
