FROM node:14.18.0 AS builder
ARG NETWORK=testnet
ARG SENTRY_AUTH_TOKEN
ARG TESTNET_PASS
ENV NEXT_PUBLIC_TESTNET_PASS=${TESTNET_PASS}
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-concurrency 1
COPY . .
COPY .env.${NETWORK} .env
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

FROM node:14.18.0 AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["yarn", "start"]
