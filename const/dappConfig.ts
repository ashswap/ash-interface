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

const fallbackConfig: CustomNetworkType =
    ENVIRONMENT.NETWORK === "mainnet"
        ? fallbackNetworkConfigurations.mainnet
        : fallbackNetworkConfigurations.devnet;

const urls: CustomNetworkType = {
    apiAddress: process.env.NEXT_PUBLIC_MVX_API || fallbackConfig.apiAddress,
    explorerAddress:
        process.env.NEXT_PUBLIC_MVX_EXPLORER || fallbackConfig.explorerAddress,
    walletAddress:
        process.env.NEXT_PUBLIC_MVX_WALLET || fallbackConfig.walletAddress,
};

const defaultDevnet: CustomNetworkType = {
    ...fallbackNetworkConfigurations.devnet,
    ...urls,
    apiTimeout: "10000",
};

const defaultDevnet2: CustomNetworkType = {
    ...fallbackNetworkConfigurations.devnet,
    ...urls,
    apiTimeout: "10000",
    id: "devnet2",
};

const defaultMainnet: CustomNetworkType = {
    ...fallbackNetworkConfigurations.mainnet,
    ...urls,
};

const _DAPP_CONFIG: CustomNetworkType =
    ENVIRONMENT.NETWORK === "devnet"
        ? defaultDevnet
        : ENVIRONMENT.NETWORK === "devnet2"
        ? defaultDevnet2
        : defaultMainnet;
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
