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
}

export const ENVIRONMENT: Environment = {
    ASH_API: process.env.NEXT_PUBLIC_ASH_API!,
    ASH_DOMAIN: process.env.NEXT_PUBLIC_ASH_DOMAIN!,
    NETWORK: process.env.NEXT_PUBLIC_NETWORK as Network,
    TESTNET_PASS: process.env.NEXT_PUBLIC_TESTNET_PASS!,
    ASH_GRAPHQL: process.env.NEXT_PUBLIC_ASH_GRAPHQL!,
    ASH_SOCKET: process.env.NEXT_PUBLIC_ASH_SOCKET!,
    ASH_SOCKET_EXTRA: process.env.NEXT_PUBLIC_ASH_SOCKET_EXTRA!,
    ENV: (process.env.NEXT_PUBLIC_ASH_ENV as Env) || "beta",
};
