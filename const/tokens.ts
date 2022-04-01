
import IPool from 'interface/pool';
import { IToken } from 'interface/token';
import pools from './pool';
export const ASH_TOKEN: IToken = {
    id: "ASH-76f082",
    name: "ASH",
    decimals: 18,
    icon: ""
}
export const VE_ASH_DECIMALS = 18;
const getTokenFromPools = (...pools: IPool[]) => {
    const map = new Map<string, IToken>();
    pools.map(pool => {
        pool.tokens.map(token => {
            map.set(token.id, token);
        })
    });
    return Array.from(map.values());
}
export const IN_POOL_TOKENS = getTokenFromPools(...pools);
export const TOKENS = [...IN_POOL_TOKENS, ASH_TOKEN];
export const TOKENS_MAP = Object.fromEntries(TOKENS.map(t => [t.id, t]));