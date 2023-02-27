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
    apiTimeout: '10000'
};

export const DAPP_CONFIG: CustomNetworkType =
    ENVIRONMENT.NETWORK === "devnet"
        ? defaultDevnet
        : fallbackNetworkConfigurations.mainnet;
export const CHAIN_ID = {
    DEVNET: ChainId.Devnet,
    TESTNET: ChainId.Testnet,
    MAINNET: ChainId.Mainnet,
} as const;
