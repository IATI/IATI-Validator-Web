# Multistage Angular build, taken from:
# https://medium.com/@avatsaev/create-efficient-angular-docker-images-with-multi-stage-builds-907e2be3008d

# To be adapted in the cluster or runtime config:
# - the file src/env.js is injected in the container
#   via cluster/deploy/properties/env.js to inform the client about the server to contact
# ----------

### STAGE 1: Build ###

# We label our stage as ‘builder’
FROM node:8-alpine as validator-front-end-builder

# Optional --build-arg location= <path> to run the app from a different path on the server (exclude starting /)
# Optional --build-arg NODE_ENV= <env> to build a different environment (default prod).
ARG location=
ARG NODE_ENV=prod

COPY package.json package-lock.json ./

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i && mkdir /ng-app && cp -R ./node_modules ./ng-app

WORKDIR /ng-app

COPY . .

## Build the angular app in production mode and store the artifacts in dist folder
RUN $(npm bin)/ng build -e $NODE_ENV --base-href=/$location

### STAGE 2: Setup ###

FROM nginx:alpine

# Optional --build-arg location=<path> to run the app from a different path on the server
ARG location=

COPY nginx.conf /tmp
RUN envsubst '$location' < /tmp/nginx.conf > /etc/nginx/conf.d/default.conf && rm /tmp/nginx.conf

## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=validator-front-end-builder /ng-app/dist /usr/share/nginx/html/$location

CMD ["nginx", "-g", "daemon off;"]
