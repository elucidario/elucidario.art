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

## Contribuição

Ver: [CONTRIBUTING.md](./CONTRIBUTING.MD)

## CI

### [`changeset-check.yaml`](./.github/workflows/changeset-check.yaml)

Verifica se a PR possui um arquivo [`changeset`](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md), e se o mesmo foi modificado.

### [`version.yaml`](./.github/workflows/version.yaml)

Incrementa a versão dos pacotes modificados.

### [`deploy-site.yaml`](./.github/workflows/deploy-site.yaml)

Faz o deploy do site do ***elucidario.art***.
