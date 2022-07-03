import { ENVIRONMENT } from "./env";

const dappContractDevnet = {
    voteEscrowedContract:
        "erd1qqqqqqqqqqqqqpgq5zj4cjyeafshqw08dagp6unn0q5nen65rmcqtnmwda",
    feeDistributor:
        "erd1qqqqqqqqqqqqqpgqg8zcrgrpaapn5k9yd5ll5m7a2wz8mhkkrmcqvclsfu",
};

const dappContractTestnet = {
    voteEscrowedContract:
        "erd1qqqqqqqqqqqqqpgqhtkdam0zga9zyva0ykjyv8s6pqn6apfyj9tsvsj7xj",
    feeDistributor:
        "erd1qqqqqqqqqqqqqpgqq5axhcjsfwgjdd4zrxf57s73tffjn6gjj9tsm4dt7k",
};

const dappContract =
    ENVIRONMENT.NETWORK == "devnet" ? dappContractDevnet : dappContractTestnet;

export const ASHSWAP_CONFIG = {
    ashApiBaseUrl: ENVIRONMENT.ASH_API,
    dappContract
    
} as const;