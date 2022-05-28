type Network = "testnet" | "devnet";

interface Environment {
    ASH_API: string;
    ASH_DOMAIN: string;
    NETWORK: Network;
}

export const ENVIRONMENT: Environment = {
    ASH_API: process.env.NEXT_PUBLIC_ASH_API!,
    ASH_DOMAIN: process.env.NEXT_PUBLIC_ASH_DOMAIN!,
    NETWORK: process.env.NEXT_PUBLIC_NETWORK as Network,
};
