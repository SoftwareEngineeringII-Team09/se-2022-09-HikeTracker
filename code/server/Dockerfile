FROM node:16 as base

LABEL version="0.0.1"

WORKDIR /app
COPY package*.json ./

# testing target

FROM base as test
RUN npm ci --silent
COPY . .
CMD "npm" "run" "test"

# development target

FROM base as development
RUN npm install --silent
COPY . .
EXPOSE 3001
CMD "npm" "run" "dev"

# prudction target

FROM base as production
RUN npm ci --silent 
COPY . .
EXPOSE 3001
CMD "npm" "run" "start"
