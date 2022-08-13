import { selectorFamily } from "recoil";
import { ashswapBaseState } from "./ashswap";

export const blockShardQuery = selectorFamily({
    key: "blockchain_shard_query",
    get: (shard: string) => ({get}) => {
        const base = get(ashswapBaseState);
        return base.blockchain.blockShards?.find(s => s.shard === shard);
    }
})