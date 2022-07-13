ARG NODE_VERSION=18.5.0
FROM node:${NODE_VERSION}-alpine3.16 as setup

COPY index.js /app/index.js
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

WORKDIR /app

RUN npm install

FROM node:${NODE_VERSION}-alpine3.16 as runner
COPY --from=setup /app/index.js /app/index.js
COPY --from=setup /app/node_modules /app/node_modules

RUN touch /file.js

WORKDIR /app

ENTRYPOINT ["node", "/app/index.js"]
