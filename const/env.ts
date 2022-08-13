type Network = "testnet" | "devnet";

interface Environment {
    ASH_API: string;
    ASH_DOMAIN: string;
    NETWORK: Network;
    TESTNET_PASS: string;
    ASH_GRAPHQL: string;
}

export const ENVIRONMENT: Environment = {
    ASH_API: process.env.NEXT_PUBLIC_ASH_API!,
    ASH_DOMAIN: process.env.NEXT_PUBLIC_ASH_DOMAIN!,
    NETWORK: process.env.NEXT_PUBLIC_NETWORK as Network,
    TESTNET_PASS: process.env.NEXT_PUBLIC_TESTNET_PASS!,
    ASH_GRAPHQL: process.env.NEXT_PUBLIC_ASH_GRAPHQL!
};
