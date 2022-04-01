type Network = "testnet" | "devnet";

interface Environment {
    ASH_API: string;
    NETWORK: Network;
}

export const ENVIRONMENT: Environment = {
    ASH_API: process.env.NEXT_PUBLIC_ASH_API!,
    NETWORK: process.env.NEXT_PUBLIC_NETWORK as Network,
};
