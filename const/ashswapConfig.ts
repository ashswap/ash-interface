import { ENVIRONMENT } from "./env";

const dappContractDevnet = {
    voteEscrowedContract:
        "erd1qqqqqqqqqqqqqpgq2gu29l3m3g2pyg8g5y9ga5q0yxg366vxzh0qf3vars",
    feeDistributor:
        "erd1qqqqqqqqqqqqqpgqhvsksal2fne9xadva8wdk23ty9juft40zh0qfhx6kg",
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