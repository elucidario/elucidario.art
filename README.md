<h1>
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/elucidario/elucidario.art/refs/heads/main/apps/site/public/svg/type%3Dvertical-color%3Dprimary-theme%3Ddark.svg">
<source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/elucidario/elucidario.art/refs/heads/main/apps/site/public/svg/type%3Dvertical-color%3Dprimary-theme%3Dlight.svg">
<img src="https://raw.githubusercontent.com/elucidario/elucidario.art/refs/heads/main/apps/site/public/svg/type%3Dvertical-color%3Dprimary-theme%3Ddark.svg" alt="Logo elucidario.art" width="296" style="margin-bottom: 16px">
</picture>
</h1>

Sistema de Gestão de Coleções para museus, galerias, acervos e coleções de arte.

![monorepo](https://img.shields.io/badge/monorepo-%230078c8?style=flat-square) ![elucidário.art](https://img.shields.io/website?url=https%3A%2F%2Felucidario.art&up_color=%2346C23A&down_color=%23FD7671&style=flat-square&label=elucidario.art&labelColor=011C3E) ![GitHub last commit](https://img.shields.io/github/last-commit/elucidario/elucidario.art?style=flat-square&labelColor=501028&color=e82070)

## descrição

Em linhas gerais o ***elucidario.art*** é um *Collection Management System*.
A abreviação CMS é majoritariamente conhecida com um outro significado: *Content Management System*, devido a popularidade de plataformas como WordPress, Joomla, Drupal, etc. O ***elucidario.art*** é um CMS para coleções de arte, ou seja, é um sistema de gerenciamento de coleções de arte, ou um *Content Management System* especializado. Portanto utilizaremos a abreviação CMS para nos referirmos ao Elucidário como um *Collection Management System*. Este termo também é utilizado por instituições como [*Collections Trust*](collectionstrust.org.uk/) e [ICOM](https://icom.museum/) para referir-se a esta modalidade de software.

Em suma, o ***elucidario.art*** é um conjunto de funcionalidades para gerenciamento de coleções de arte que utiliza o modelo de dados para aplicações [Linked Art](https://linked.art) para definição das classes principais de conteúdo e se baseia nos procedimentos [Spectrum](https://collectionstrust.org.uk/spectrum/) para definição de seus fluxos de trabalho.

## desenvolvimento

### containers

Para rodar o ambiente de desenvolvimento do ***elucidario.art***, é necessário ter o [Docker](https://www.docker.com/) instalado. Então, basta rodar o seguinte comando na raiz do projeto:

```bash
docker compose up --build
```

Para rodar os componentes isolados, é necessário passar o nome do serviço como argumento para o comando acima:

```bash
docker compose up --build <nome-serviço>
```

Por exemplo, para rodar apenas o site:

```bash
docker compose up --build dev_site
```

Para ver os serviços disponíveis consulte o arquivo [`compose.yaml`](./compose.yaml).

### repositório

O repositório está estruturado em uma arquitetura de mono-repositório, em que os pacotes são distribuídos em subdiretórios na raíz do projeto. Cada pacote é uma funcionalidade, ou micro-serviço, que pode ser utilizado de forma independente. A estrutura de diretórios é a seguinte:

```bash
elucidario
├── core
├── apps
├── packages
├── tools
├── ...
```

O diretório `core` contém o pacote principal do ***elucidario.art***, consiste no núcleo do sistema, onde estão definidos os modelos de dados, as regras de negócio e os fluxos de trabalho. O pacote `@elucidario/core` é o coração do sistema.

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
