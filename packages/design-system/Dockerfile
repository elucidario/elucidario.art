FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm
RUN corepack prepare pnpm@10.0.0 --activate

WORKDIR /lcdr
COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./
COPY . /lcdr

RUN pnpm install -r

WORKDIR /lcdr/packages/design-system

CMD ["pnpm", "dev"]
