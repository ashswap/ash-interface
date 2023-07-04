type Network = "mainnet" | "devnet";
type Env = "alpha" | "beta";
// -> test-devnet(for internal testing) || dev-devnet (for users)
interface Environment {
    ASH_API: string;
    ASH_DOMAIN: string;
    NETWORK: Network;
    TESTNET_PASS: string;
    ASH_GRAPHQL: string;
    ASH_SOCKET: string;
    ASH_SOCKET_EXTRA: string;
    ENV: Env;
    LOGIN_TWITTER_LINK: string;
    LOGIN_DISCORD_LINK: string;
    WALLET_CONNECT_V2_PROJECT_ID: string;
    AG_API: string;
    XEXCHANGE_GRAPH_API?: string;
    AG_TOKEN_SECRET: string;
}

const _ENVIRONMENT: Environment = {
    ASH_API: process.env.NEXT_PUBLIC_ASH_API!,
    ASH_DOMAIN: process.env.NEXT_PUBLIC_ASH_DOMAIN!,
    NETWORK: process.env.NEXT_PUBLIC_NETWORK as Network,
    TESTNET_PASS: process.env.NEXT_PUBLIC_TESTNET_PASS!,
    ASH_GRAPHQL: process.env.NEXT_PUBLIC_ASH_GRAPHQL!,
    ASH_SOCKET: process.env.NEXT_PUBLIC_ASH_SOCKET!,
    ASH_SOCKET_EXTRA: process.env.NEXT_PUBLIC_ASH_SOCKET_EXTRA!,
    ENV: (process.env.NEXT_PUBLIC_ASH_ENV as Env) || "beta",
    LOGIN_TWITTER_LINK: process.env.NEXT_PUBLIC_ASH_LOGIN_TWITTER_LINK!,
    LOGIN_DISCORD_LINK: process.env.NEXT_PUBLIC_ASH_LOGIN_DISCORD_LINK!,
    WALLET_CONNECT_V2_PROJECT_ID:
        process.env.NEXT_PUBLIC_ASH_WALLET_CONNECT_V2_PROJECT_ID!,
    AG_API: process.env.NEXT_PUBLIC_AG_API!,
    XEXCHANGE_GRAPH_API: process.env.NEXT_PUBLIC_XEXCHANGE_GRAPH_API,
    AG_TOKEN_SECRET: process.env.NEXT_PUBLIC_AG_TOKEN_SECRET || "",
};

export const ENVIRONMENT = {
    ..._ENVIRONMENT,
    ENABLE_ASHPOINT:
        _ENVIRONMENT.NETWORK == "mainnet" ||
        (_ENVIRONMENT.NETWORK === "devnet" && _ENVIRONMENT.ENV === "alpha"),
    ENABLE_ASHPOINT_SIGN: false,
};
