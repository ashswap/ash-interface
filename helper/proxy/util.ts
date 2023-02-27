import { AccountInfoSliceNetworkType } from "@multiversx/sdk-dapp/types";
import { getNetworkConfig } from "@multiversx/sdk-dapp/utils";
import {
    ApiNetworkProvider,
    ProxyNetworkProvider,
} from "@multiversx/sdk-network-providers/out";
import MultiversXProxyProvider from "./multiversXProxyProvider";

let proxyProvider: ProxyNetworkProvider | null = null;
export const getProxyNetworkProvider = () => {
    const network: AccountInfoSliceNetworkType = getNetworkConfig();
    if (!proxyProvider) {
        proxyProvider = new ProxyNetworkProvider(network.apiAddress, {
            timeout: +network.apiTimeout,
        });
    }
    return proxyProvider;
};
let apiProvider: ApiNetworkProvider | null = null;
export const getApiNetworkProvider = () => {
    const network: AccountInfoSliceNetworkType = getNetworkConfig();
    if (!apiProvider) {
        apiProvider = new ApiNetworkProvider(network.apiAddress, {
            timeout: +network.apiTimeout,
        });
    }
    return apiProvider;
};

let MVXProxyProvider: MultiversXProxyProvider | null = null;
export const getMVXProxyProvider = () => {
    const network: AccountInfoSliceNetworkType = getNetworkConfig();
    if (!MVXProxyProvider) {
        MVXProxyProvider = new MultiversXProxyProvider(network.apiAddress, {
            timeout: +network.apiTimeout,
        });
    }
    return MVXProxyProvider;
};
