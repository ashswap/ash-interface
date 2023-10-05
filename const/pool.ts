import { IESDTInfo } from "helper/token/token";
import IPool from "interface/pool";
import { ENVIRONMENT } from "./env";

import { TOKENS_MAP } from "./tokens";
import { WRAPPED_EGLD } from "./wrappedEGLD";
import { POOLS_ALPHA, POOLS_BETA, POOLS_BETA2, POOLS_MAINNET } from "./pools";

const _POOLS =
    ENVIRONMENT.ENV === "alpha"
        ? POOLS_ALPHA
        : ENVIRONMENT.NETWORK === "devnet"
        ? POOLS_BETA
        : ENVIRONMENT.NETWORK === "devnet2"
        ? POOLS_BETA2
        : POOLS_MAINNET;

const pools = _POOLS.map((p) => {
    // verify all tokens which present in the pool
    p.tokens.map((t) => {
        if (!t) throw new Error("Invalid token identifier in pool");
    });
    if (!p.lpToken) {
        throw new Error("Invalid token identifier in pool");
    }
    return p;
});

export const POOLS_MAP_ADDRESS = Object.fromEntries(
    pools.map((p) => [p.address, p])
);
export const POOLS_MAP_LP = Object.fromEntries(
    pools.map((p) => [p.lpToken.identifier, p])
);
const getTokenFromPools = (...pools: IPool[]) => {
    const map = new Map<string, IESDTInfo>();
    let useWEGLD = false;
    pools.map((pool) => {
        pool.tokens.map((token) => {
            useWEGLD = useWEGLD || WRAPPED_EGLD.wegld === token.identifier;
            map.set(token.identifier, token);
        });
    });
    return [
        ...(useWEGLD ? [TOKENS_MAP["EGLD"]] : []),
        ...Array.from(map.values()),
    ];
};

export const IN_POOL_TOKENS = getTokenFromPools(...pools);
export const IN_POOL_TOKENS_MAP = Object.fromEntries(
    IN_POOL_TOKENS.map((t) => [t.identifier, t])
);
export default pools;
