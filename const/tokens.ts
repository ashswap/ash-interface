import { ESDT, IESDTInfo } from "helper/token/token";
import { ENVIRONMENT } from "./env";
import {
    TOKENS_ALPHA,
    TOKENS_BETA,
    TOKENS_BETA2,
    TOKENS_MAINNET,
} from "const/tokens/index";

export const VE_ASH_DECIMALS = 18;

const TOKENS_CONFIG =
    ENVIRONMENT.NETWORK === "devnet"
        ? ENVIRONMENT.ENV === "alpha"
            ? TOKENS_ALPHA
            : TOKENS_BETA
        : ENVIRONMENT.NETWORK === "devnet2"
        ? TOKENS_BETA2
        : TOKENS_MAINNET;
export const NON_LP_TOKENS = TOKENS_CONFIG.TOKENS;
export const TOKENS = [...TOKENS_CONFIG.TOKENS, ...TOKENS_CONFIG.LP_TOKENS];
export const TOKENS_MAP = TOKENS_CONFIG.TOKENS_MAP;
export const LP_TOKENS = TOKENS_CONFIG.LP_TOKENS;
export const LP_TOKENS_MAP = Object.fromEntries(
    LP_TOKENS.map((t) => [t.identifier, t])
);
export const ASH_TOKEN: IESDTInfo = TOKENS_MAP.ASH;
export const ASH_ESDT = new ESDT(TOKENS_MAP.ASH);
