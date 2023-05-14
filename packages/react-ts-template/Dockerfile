FROM node:18.15.0-alpine as builder
WORKDIR /build
COPY . ./
RUN npm i
RUN npm run build

FROM nginx:1.23.3 as final-stage
ENV API_HOST=some-api-host.com
ENV API_PORT=9090
ENV NGINX_LISTEN_PORT=80
COPY --from=builder /build/dist/ /usr/share/nginx/html
COPY ./nginx.conf.template /etc/nginx/templates/default.conf.template
