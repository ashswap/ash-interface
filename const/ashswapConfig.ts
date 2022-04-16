import { ENVIRONMENT } from "./env";

const dappContractDevnet = {
    voteEscrowedContract:
        "erd1qqqqqqqqqqqqqpgqtfc7rpl9dkfhkgt27ncw6p8tay8fpmffrmcqrmv22m",
    feeDistributor:
        "erd1qqqqqqqqqqqqqpgqfx4sx79slh2pr8vvszgs50l4vx9968uyrmcqaw6uf9",
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