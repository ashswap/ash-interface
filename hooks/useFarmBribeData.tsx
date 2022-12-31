import { fbAccountFarmSelector, fbFarmSelector } from "atoms/farmBribeState";
import { fcAccountFarmSelector, fcFarmSelector } from "atoms/farmControllerState";
import { tokenMapState } from "atoms/tokensState";
import BigNumber from "bignumber.js";
import { FARMS_MAP } from "const/farms";
import { POOLS_MAP_LP } from "const/pool";
import { TOKENS, TOKENS_MAP } from "const/tokens";
import { toEGLDD, toWei } from "helper/balance";
import { TokenAmount } from "helper/token/tokenAmount";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";

const useFarmBribeData = (farmAddress: string) => {
    const fcFarm = useRecoilValue(fcFarmSelector(farmAddress));
    const fbFarm = useRecoilValue(fbFarmSelector(farmAddress));
    const fbAccountFarm = useRecoilValue(fbAccountFarmSelector(farmAddress));
    const fcAccountFarm = useRecoilValue(fcAccountFarmSelector(farmAddress));
    const tokenMap = useRecoilValue(tokenMapState);
    const pool = useMemo(() => {
        const lp = FARMS_MAP[farmAddress].farming_token_id;
        return POOLS_MAP_LP[lp];
    }, [farmAddress]);

    const rewards = useMemo(() => {
        if(!fbFarm || !fcFarm) return [];
        return fbFarm.rewards.map(r => {
            const amt = new BigNumber(r.rewardPerVote).multipliedBy(fcFarm.votedPoint.slope);
            return new TokenAmount(TOKENS_MAP[r.tokenId], amt.div(10**18));
        });
    }, [fbFarm, fcFarm]);

    // const claimableRewards = useMemo(() => {
    //     if(!fbFarm || !fcFarm || !fbAccountFarm || !fcAccountFarm) return [];
    //     const results: TokenAmount[] = [];
    //     fbFarm.rewards.map(r => {
    //         const fbReward = fbAccountFarm.rewards.find(rw => rw.tokenId === r.tokenId)
    //         if(fbReward && fbReward.lastUserClaim < r.activePeriod && fcAccountFarm.lastUserVote < r.activePeriod){
    //             const amt = new BigNumber(fcFarm.votedPoint.slope).multipliedBy(r.rewardPerVote).div(10**18);
    //             results.push(new TokenAmount(TOKENS_MAP[r.tokenId], amt));
    //         }
    //     });

    //     console.log(results);
    //     return results;
    // }, [fbFarm, fcFarm, fbAccountFarm, fcAccountFarm]);

    const claimableRewards = useMemo(() => {
        return fbAccountFarm?.rewards.map(r => new TokenAmount(TOKENS_MAP[r.tokenId], r.claimable)) || [];
    }, [fbAccountFarm]);

    const totalTreasureUSD = useMemo(() => {
        return rewards.reduce((sum, r) => {
            return sum.plus(r.egld.multipliedBy(tokenMap[r.token.identifier]?.price || 0));
        }, new BigNumber(0)).toNumber();
    }, [rewards, tokenMap]);

    return {
        pool,
        rewards,
        claimableRewards,
        totalTreasureUSD
    }
}

export default useFarmBribeData;