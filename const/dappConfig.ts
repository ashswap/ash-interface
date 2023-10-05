import { CustomNetworkType } from "@multiversx/sdk-dapp/types";
import { fallbackNetworkConfigurations } from "@multiversx/sdk-dapp/constants";
import { ENVIRONMENT } from "./env";
import { ChainId } from "helper/token/token";
export const gasPrice = 1000000000;
export const version = 1;
export const gasLimit = 600000000;
export const maxGasLimit = 600000000;
export const gasLimitBuffer = 1.2;
export const gasPerDataByte = 1500;
export const shardId = 1;
export const blockTimeMs = 6000;

let defaultDevnet: CustomNetworkType = {
    ...fallbackNetworkConfigurations.devnet,
    apiTimeout: "10000",
};

let defaultDevnet2: CustomNetworkType = {
    ...fallbackNetworkConfigurations.devnet,
    apiTimeout: "10000",
    apiAddress: "https://devnet2-api.multiversx.com",
    explorerAddress: "http://devnet2-explorer.multiversx.com",
    id: "devnet2",
    walletAddress: "https://devnet2-wallet.multiversx.com",
};

const _DAPP_CONFIG: CustomNetworkType =
    ENVIRONMENT.NETWORK === "devnet"
        ? defaultDevnet
        : ENVIRONMENT.NETWORK === "devnet2"
        ? defaultDevnet2
        : fallbackNetworkConfigurations.mainnet;
export const DAPP_CONFIG: CustomNetworkType = {
    ..._DAPP_CONFIG,
    walletConnectV2ProjectId: ENVIRONMENT.WALLET_CONNECT_V2_PROJECT_ID,
};
export const CHAIN_ID = {
    DEVNET: ChainId.Devnet,
    DEVNET2: ChainId.Devnet2,
    TESTNET: ChainId.Testnet,
    MAINNET: ChainId.Mainnet,
} as const;
