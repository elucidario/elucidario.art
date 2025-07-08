# Contribuindo

## Dependencias

- [Docker](https://www.docker.com)
- [gh cli](https://cli.github.com)
- [node](https://nodejs.org/pt)
- [pnpm](https://pnpm.io/pt/)

As versões do `node` e `pnpm` estão definidas no `Dockerfile` e em `package.json#/packageManager`, respectivamente - elas serão configuradas automaticamente.

## Pull Request Process

1. Cada Pull Request deve ser feita a partir da branch `dev` e deve ser nomeada seguindo o padrão `feat/<nome-da-funcionalidade>` ou `fix/<nome-do-bug>`, onde `<nome-da-funcionalidade>` ou `<nome-do-bug>` é uma descrição curta e clara da funcionalidade ou bug que está sendo implementado ou corrigido.
2. A Pull Request deve ser revisada e aprovada por pelo menos um membro da equipe antes de ser mesclada.
3. A Pull Request deve ser mesclada na branch `dev` e não deve ser mesclada diretamente na branch `main`.
4. Cada nova funcionalidade deve ter um changeset, execute `pnpm changeset:add` e siga os prompts
5. O changelog será criado no diretório `.changeset` e deve ser commitado na branch.
6. As alterações devem ser commitadas no nível raiz com o script pnpm `pnpm commit` ou `pnpm commit:no-verify` (que ignora o processo de verificação de tipo e lint) e seguir os prompts.

Uma maneira fácil de realizar as etapas 4, 5 e 6 é executar o comando:

```sh
pnpm changeset:add && git add .changeset/* && pnpm commit
```

Que irá rodar os comandos sequencialmente.

## Desenvolvimento

### containers

Para rodar o ambiente de desenvolvimento do ***elucidario.art***, é necessário ter o [Docker](https://www.docker.com/) instalado.

```bash
docker compose up --build <nome-serviço> // ver em compose.yaml
```

Os testes podem ser rodados da seguinte forma:

```bash
docker compose run -it --build <nome-serviço>-test pnpm test // ver testes disponíveis em compose.yaml
```

---

### repositório

O repositório está estruturado em uma arquitetura de [mono-repositório](https://pnpm.io/pt/workspaces), em que os pacotes são distribuídos em subdiretórios na raíz do projeto. Cada pacote é uma funcionalidade que pode ser utilizado de forma independente. A estrutura de diretórios é a seguinte:

```bash
elucidario
├── apps
├── core
├── frontend
├── packages
├── tools
├── ...
```

O diretório `core` contém o pacote principal do ***elucidario.art***, consiste no núcleo do sistema, onde estão definidos os modelos, serviços, apis e casos de uso. O pacote `@elucidario/core` é o coração do sistema.

O diretório `packages` contém os pacotes que podem ser reutilizados, tanto por outros pacotes, como por aplicações. Todos os pacotes definidos nesta pasta seguem o padrão de nome `@elucidario/pkg-<nome-pacote>`.

No diretório `apps`, o site do ***elucidario.art*** disponível em <https://elucidario.art/>. Os pacotes nesta pasta seguem o padrão de nome `@elucidario/app-<nome-pacote>`.

Em `tools` estão os scripts e ferramentas auxiliares para o desenvolvimento do ***elucidario.art***. Os pacotes nesta pasta seguem o padrão de nome `@elucidario/tool-<nome-pacote>`.

---

### A11y, I18n & i10n

Todos os pacotes nos diretórios `apps` e `packages`, e o `core` devem ser construídos levando em conta as seguintes boas práticas de design, ou técnicas de programação, quando aplicáveis:

- **a11y (*accessibility*)** - quando aplicável o pacote deve seguir as regras de acessibilidade apropriadas para o contexto;
- **i18n (*internationalization*)** - quando aplicável o pacote deve implementar o suporte a internacionalização, e o processo de localização deve ser devidamente documentado;
- **i10n (*localization*)** - quando aplicável o pacote deve implementar o suporte a localização dos idiomas português, espanhol e inglês, seguindo esta ordem de prioridade;

---
