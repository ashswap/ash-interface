import { ENVIRONMENT } from "./env";

const dappContractDevnet = {
    voteEscrowedContract:
        "erd1qqqqqqqqqqqqqpgqhtkdam0zga9zyva0ykjyv8s6pqn6apfyj9tsvsj7xj",
    feeDistributor:
        "erd1qqqqqqqqqqqqqpgqq5axhcjsfwgjdd4zrxf57s73tffjn6gjj9tsm4dt7k",
};

const dappContractTestnet = {
    voteEscrowedContract:
        "erd1qqqqqqqqqqqqqpgqvrc0x026cf44kktc7jhw6mgtpu9d5cw2j9tsfxnjta",
    feeDistributor:
        "erd1qqqqqqqqqqqqqpgqsnzeqs8q2gu5plt9ge9fu9nul0g8m7d9j9tss4r9cn",
};

const dappContract =
    ENVIRONMENT.NETWORK == "devnet" ? dappContractDevnet : dappContractTestnet;

export const ASHSWAP_CONFIG = {
    ashApiBaseUrl: ENVIRONMENT.ASH_API,
    dappContract
    
} as const;