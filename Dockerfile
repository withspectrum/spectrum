FROM node:12 AS builder
WORKDIR /usr/src/spectrum
COPY package.json yarn.lock ./
RUN yarn
COPY . .

FROM builder AS builder-hyperion
RUN yarn --cwd ./hyperion
RUN yarn run build:hyperion
RUN yarn --cwd ./build-hyperion

FROM node:12 AS hyperion
COPY --from=builder-hyperion /usr/src/spectrum/build-hyperion /usr/src/spectrum-hyperion
WORKDIR /usr/src/spectrum-hyperion
CMD ["yarn", "run", "start"]
