FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm
RUN corepack prepare pnpm@10.0.0 --activate
WORKDIR /lcdr
COPY ./package.json ./pnpm-lock.yaml ./
RUN pnpm install
COPY . /lcdr

FROM base AS build
RUN pnpm build

FROM base AS dev
CMD ["sh", "-c", "pnpm dev"]
