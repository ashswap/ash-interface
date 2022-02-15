
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