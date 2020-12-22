FROM node:14.8.0-stretch as builder
WORKDIR /usr/build

# Install app dependencies
COPY package*.json ./
RUN npm install --production

# disable TLS ALPN extension for servers that don't support ALPN grpc-exp extension
RUN rm -rf ./node_modules/grpc
RUN npm install grpc@1.24.4 --build-from-source --grpc_alpn=false --production

# Bundle app source
COPY . .
# Bundle the client code
RUN npm run build-production


# Build final image
FROM node:14.8.0-slim
WORKDIR /usr/app

COPY --from=builder ./usr/build ./

ENV NODE_ENV=production
ENV NPM_CONFIG_PRODUCTION=true
EXPOSE 8088
CMD [ "node", "server.js" ]