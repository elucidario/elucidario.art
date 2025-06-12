FROM node:23-alpine AS base
ENV TZ=America/Sao_Paulo
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm
RUN corepack prepare pnpm@10.12.1 --activate
# Instala o Git usando o gerenciador de pacotes apk do Alpine
# apk update: Atualiza a lista de pacotes disponíveis
# apk add git: Instala o pacote git
# rm -rf /var/cache/apk/*: Limpa o cache do apk para reduzir o tamanho da imagem
RUN apk update && apk add git && rm -rf /var/cache/apk/*
WORKDIR /lcdr
COPY ./package.json ./pnpm-lock.yaml ./
COPY . /lcdr
RUN git config --global --add safe.directory /lcdr
RUN pnpm install -r
