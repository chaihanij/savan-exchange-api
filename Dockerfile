FROM node:22-alpine AS BUILD

WORKDIR /app

RUN npm update -g npm && npm install -g pnpm

COPY package.json package-lock.json ./

RUN pnpm install