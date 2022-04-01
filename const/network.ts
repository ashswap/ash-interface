import { ENVIRONMENT } from "./env";

export const gasPrice = 1000000000;
export const version = 1;
export const gasLimit = 600000000;
export const gasPerDataByte = 1500;
export const shardId = 1;
export const blockTimeMs = 6000;

const testnet = {
    id: "T",
    name: "Testnet",
    egldLabel: "xEGLD",
    walletAddress: "https://testnet-wallet.elrond.com",
    apiAddress: "https://testnet-api.elrond.com",
    gatewayAddress: "https://testnet-gateway.elrond.com",
    explorerAddress: "http://testnet-explorer.elrond.com",
    ashApiBaseUrl: "https://api-devnet.ashswap.io",
};

const devnet = {
    id: "D",
    name: "Devnet",
    egldLabel: "dEGLD",
    walletAddress: "https://devnet-wallet.elrond.com",
    apiAddress: "https://devnet-api.elrond.com",
    gatewayAddress: "https://devnet-gateway.elrond.com",
    explorerAddress: "http://devnet-explorer.elrond.com",
    ashApiBaseUrl: "https://api-devnet.ashswap.io",
};

export const network = ENVIRONMENT.NETWORK == "devnet" ? devnet : testnet;

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

export const dappContract =
    ENVIRONMENT.NETWORK == "devnet" ? dappContractDevnet : dappContractTestnet;
