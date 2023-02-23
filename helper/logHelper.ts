import { getAddress } from "@elrondnetwork/dapp-core/utils";
import axios from "axios";
import { ENVIRONMENT } from "const/env";
import storage from "./storage";

async function getAshAuthen(address: string, ts: number) {
    const key = `${process.env.NEXT_PUBLIC_ASH_LOG_API_KEY}:${address}-${ts}`;
    const hashBuffer = await crypto.subtle.digest("SHA-256", Buffer.from(key));
    const hashArr = Array.from(new Uint8Array(hashBuffer));
    const encode = hashArr.map((b) => b.toString(16).padStart(2, "0")).join("");
    return encode;
}

async function getAshVerifyObj() {
    return {
        wallet: await getAddress(),
        ts: Date.now(),
    };
}

const logApi = axios.create();
logApi.interceptors.request.use(async (config) => {
    const verifyObj = await getAshVerifyObj();
    const ashAuth = await getAshAuthen(verifyObj.wallet, verifyObj.ts);
    const verify = Buffer.from(JSON.stringify(verifyObj)).toString("base64");
    config.headers = {
        ...config.headers,
        "X-ASH-authen": ashAuth,
        "X-ASH-verify": verify,
        "X-ASH-SIGNING": ENVIRONMENT.ENABLE_ASHPOINT_SIGN ? storage.local.getItem("ashpointOwners")?.[verifyObj.wallet]?.signature : undefined,
        // "ngrok-skip-browser-warning": "FU_NGROK"
    };
    config.baseURL = process.env.NEXT_PUBLIC_ASH_LOG_API;
    return config;
});

export default logApi;
