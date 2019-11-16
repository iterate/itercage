FROM node:10.16.0-alpine

ENV NODE_ENV production

# Install dumb-init
RUN wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_amd64
RUN chmod +x /usr/local/bin/dumb-init

RUN mkdir -p /app/
WORKDIR /app/

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY public public/
COPY src src/

# Build frontend
RUN yarn run build

COPY bin bin/
COPY logger.js .
COPY server.js .
COPY routes.js .
COPY middleware.js .
COPY setup-firebase.js .

EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/dumb-init", "--"]
CMD [ "node", "./bin/www" ]
