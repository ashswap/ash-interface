
import IPool from 'interface/pool';
import { IToken } from 'interface/token';
import pools from './pool';
const getTokenFromPools = (...pools: IPool[]) => {
    const map = new Map<string, IToken>();
    pools.map(pool => {
        pool.tokens.map(token => {
            map.set(token.id, token);
        })
    });
    return Array.from(map.values());
}
export const TOKENS = getTokenFromPools(...pools);
export const ASH_TOKEN: IToken = {
    id: "ASH-550f13",
    name: "ASH",
    decimals: 18,
    icon: ""
}
export const VE_ASH_DECIMALS = 18;