FROM node:22-alpine AS build

WORKDIR /app

RUN npm update -g npm && npm install -g pnpm

COPY package.json package-lock.json ./

RUN pnpm install

COPY . .

RUN pnpm build

FROM node:22-alpine

WORKDIR /app
RUN npm update -g npm && npm install -g pnpm

COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./

RUN pnpm install --prod

EXPOSE 3000

CMD ["node", "dist/index.js"]