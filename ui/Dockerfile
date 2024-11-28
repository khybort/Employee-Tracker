FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

FROM base AS build

RUN yarn build

FROM nginx:alpine AS production

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

FROM base AS development

EXPOSE 3000

CMD ["yarn", "start"]
