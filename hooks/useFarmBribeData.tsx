import { fbAccountFarmSelector } from "atoms/farmBribeState";
import { FARMS_MAP } from "const/farms";
import { POOLS_MAP_LP } from "const/pool";
import { TOKENS_MAP } from "const/tokens";
import { TokenAmount } from "helper/token/tokenAmount";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";

const useFarmBribeData = (farmAddress: string) => {
    const fbAccountFarm = useRecoilValue(fbAccountFarmSelector(farmAddress));
    const pool = useMemo(() => {
        const lp = FARMS_MAP[farmAddress].farming_token_id;
        return POOLS_MAP_LP[lp];
    }, [farmAddress]);

    const claimableRewards = useMemo(() => {
        return fbAccountFarm?.rewards.map(r => new TokenAmount(TOKENS_MAP[r.tokenId], r.claimable)) || [];
    }, [fbAccountFarm]);

    return {
        pool,
        claimableRewards,
    }
}

export default useFarmBribeData;