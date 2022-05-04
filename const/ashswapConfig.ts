import { ENVIRONMENT } from "./env";

const dappContractDevnet = {
    voteEscrowedContract:
        "erd1qqqqqqqqqqqqqpgq8vfyudw2dwj7l3npn5p2z0e9eqvkls44zh0q0gu6uq",
    feeDistributor:
        "erd1qqqqqqqqqqqqqpgqk55jfyn99wnhx7jcwyvw5gysva5kkxqqzh0qgmqsc5",
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