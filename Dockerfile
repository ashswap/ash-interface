FROM node:20.4.0 AS builder

ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build && yarn export && cp ./out/404.html ./out/ipfs-404.html

FROM node:20.4.0 AS runner
WORKDIR /app
RUN npm i -g serve@14.2.0

COPY --from=builder /app/out ./out

EXPOSE 3000

CMD ["serve", "-l", "tcp://0.0.0.0:3000", "/app/out"]
