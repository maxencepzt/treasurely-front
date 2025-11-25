ARG NODE_VERSION=20.18.3
ARG NGINX_VERSION=1.27.3

FROM node:${NODE_VERSION}-alpine AS treasurely_development
WORKDIR /sae5-01-front
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./index.html ./index.html
COPY ./vite.config.ts ./vite.config.ts
COPY ./public ./public/
COPY tsconfig.json ./
COPY tsconfig.app.json ./
COPY tsconfig.node.json ./
RUN set -eux; \
    npm install
VOLUME ["./node_modules"]
EXPOSE 5173
CMD [ "npm", "run", "dev", "--", "--host" ]

FROM treasurely_development AS treasurely_build
COPY ./src/ ./src/
RUN set -eux; \
    npm run build

FROM nginx:${NGINX_VERSION}-alpine AS treasurely_prod
COPY ./docker/nginx/default.conf /etc/nginx/conf.d/default.conf
WORKDIR /sae5-01-front
COPY --from=treasurely_build /sae5-01-front/dist /sae5-01-front/build