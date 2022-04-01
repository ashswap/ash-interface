import { ENVIRONMENT } from "const/env";
import { NetworkType } from "./helper/types";

export const dAppName = "Dapp";
export const decimals = 2;
export const denomination = 18;
export const gasPrice = 1000000000;
export const version = 1;
export const gasLimit = 50000;
export const gasPerDataByte = 1500;

export const walletConnectBridge = "https://bridge.walletconnect.org";
export const walletConnectDeepLink =
    "https://maiar.page.link/?apn=com.elrond.maiar.wallet&isi=1519405832&ibi=com.elrond.maiar.wallet&link=https://maiar.com/";

const testnet: NetworkType = {
    id: "testnet",
    name: "Testnet",
    egldLabel: "xEGLD",
    walletAddress: "https://testnet-wallet.elrond.com",
    apiAddress: "https://testnet-api.elrond.com",
    gatewayAddress: "https://testnet-gateway.elrond.com",
    explorerAddress: "http://testnet-explorer.elrond.com/",
};

const devnet: NetworkType = {
    id: "devnet",
    name: "Devnet",
    egldLabel: "dEGLD",
    walletAddress: "https://devnet-wallet.elrond.com",
    apiAddress: "https://devnet-api.elrond.com",
    gatewayAddress: "https://devnet-gateway.elrond.com",
    explorerAddress: "http://devnet-explorer.elrond.com/",
};

export const network = ENVIRONMENT.NETWORK == "devnet" ? devnet : testnet;
