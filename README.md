<h1>
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/elucidario/elucidario.art/refs/heads/main/apps/site/public/svg/type%3Dvertical-color%3Dprimary-theme%3Ddark.svg">
<source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/elucidario/elucidario.art/refs/heads/main/apps/site/public/svg/type%3Dvertical-color%3Dprimary-theme%3Dlight.svg">
<img src="https://raw.githubusercontent.com/elucidario/elucidario.art/refs/heads/main/apps/site/public/svg/type%3Dvertical-color%3Dprimary-theme%3Ddark.svg" alt="Logo elucidario.art" width="296" style="margin-bottom: 16px">
</picture>
</h1>

![monorepo](https://img.shields.io/badge/monorepo-%230078c8?style=flat-square) ![elucidário.art](https://img.shields.io/website?url=https%3A%2F%2Felucidario.art&up_color=%2346C23A&down_color=%23FD7671&style=flat-square&label=elucidario.art&labelColor=011C3E) ![GitHub last commit](https://img.shields.io/github/last-commit/elucidario/elucidario.art?style=flat-square&labelColor=501028&color=e82070)

Sistema de Gestão de Coleções para Museus, Centros-Culturais, Centros de Memória, organizações ou pessoas que possuam acervo ou coleções de itens mistos.

Para mais informações visite o site [elucidario.art](https://elucidario.art?utm_source=github_readme).

## desenvolvimento

### containers

Para rodar o ambiente de desenvolvimento do ***elucidario.art***, é necessário ter o [Docker](https://www.docker.com/) instalado.

```bash
docker compose up --build <nome-serviço> // ver em compose.yaml
```

### repositório

O repositório está estruturado em uma arquitetura de mono-repositório, em que os pacotes são distribuídos em subdiretórios na raíz do projeto. Cada pacote é uma funcionalidade, que pode ser utilizado de forma independente. A estrutura de diretórios é a seguinte:

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

No diretório `apps`, se encontram as aplicações, como um ambiente de desenvolvimento completo utilizando Docker para testes locais e o site do ***elucidario.art*** disponível em <https://elucidario.art/>. Os pacotes nesta pasta seguem o padrão de nome `@elucidario/app-<nome-pacote>`.

Em `tools` estão os scripts e ferramentas auxiliares para o desenvolvimento do ***elucidario.art***. Os pacotes nesta pasta seguem o padrão de nome `@elucidario/tool-<nome-pacote>`.

Todos os pacotes nos diretórios `apps` e `packages`, e o `core` devem ser construídos levando em conta as seguintes boas práticas de design, ou técnicas de programação, quando aplicáveis:

- **a11y (*accessibility*)** - quando aplicável o pacote deve seguir as regras de acessibilidade apropriadas para o contexto;
- **i10n (*localization*)** - quando aplicável o pacote deve implementar o suporte a localização dos idiomas português, espanhol e inglês, seguindo esta ordem de prioridade;
- **i18n (*internationalization*)** - quando aplicável o pacote deve implementar o suporte a internacionalização, e o processo de localização deve ser devidamente documentado;

## CI

### [`changeset-check.yaml`](./.github/workflows/changeset-check.yaml)

Verifica se a PR possui um arquivo [`changeset`](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md) e se o mesmo foi modificado.

### [`version.yaml`](./.github/workflows/version.yaml)

Incrementa a versão dos pacotes modificados.

### [`deploy-site.yaml`](./.github/workflows/deploy-site.yaml)

Faz o deploy do site do ***elucidario.art***.
