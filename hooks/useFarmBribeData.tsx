import { FARMS_MAP } from "const/farms";
import { POOLS_MAP_LP } from "const/pool";
import { TOKENS } from "const/tokens";
import { TokenAmount } from "helper/token/tokenAmount";
import { useMemo } from "react";

const useFarmBribeData = (farmAddress: string) => {
    const pool = useMemo(() => {
        const lp = FARMS_MAP[farmAddress].farming_token_id;
        return POOLS_MAP_LP[lp];
    }, [farmAddress]);

    const rewards = useMemo(() => {
        return TOKENS.map(t => new TokenAmount(t, 10000000));
    }, []);

    const claimableRewards = useMemo(() => {
        return TOKENS.map(t => new TokenAmount(t, 1000000000));
    }, []);

    return {
        pool,
        rewards,
        claimableRewards
    }
}

export default useFarmBribeData;