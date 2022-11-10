FROM node:16 as base

LABEL version="0.0.1"

WORKDIR /app
COPY package*.json ./

# testing target

FROM base as test
RUN npm ci --silent
RUN mkdir node_modules/.cache && chmod -R 777 node_modules/.cache
COPY . .
CMD "npm" "test"

# development target

FROM base as development
RUN npm install --silent
RUN mkdir node_modules/.cache && chmod -R 777 node_modules/.cache
COPY . .
EXPOSE 3000
CMD "npm" "start"
