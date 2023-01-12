FROM node:16 as base

LABEL version="0.0.1"

ARG NODE_ENV
ARG NODEMAILER_EMAIL
ARG NODEMAILER_PASSWORD
ARG PORT
ARG CLIENT_PORT
ARG TZ

ENV NODE_ENV ${NODE_ENV}
ENV NODEMAILER_EMAIL $NODEMAILER_EMAIL
ENV NODEMAILER_PASSWORD $NODEMAILER_PASSWORD
ENV PORT $PORT
ENV CLIENT_PORT $CLIENT_PORT
ENV TZ $TZ

WORKDIR /app
COPY package*.json ./

# testing targets

FROM base as test
RUN npm ci --silent
COPY . .
CMD "npm" "run" "test:all"

FROM base as unit
RUN npm ci --silent
COPY . .
CMD "npm" "run" "test"

FROM base as integration
RUN npm ci --silent
COPY . .
CMD "npm" "run" "integration"

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
