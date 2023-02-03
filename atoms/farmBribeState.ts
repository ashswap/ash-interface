import BigNumber from "bignumber.js";
import { TOKENS_MAP } from "const/tokens";
import { FBAccountFarm, FBFarm } from "graphql/type.graphql";
import { TokenAmount } from "helper/token/tokenAmount";
import { selectorFamily } from "recoil";
import { ashswapBaseState } from "./ashswap";
import { tokenMapState } from "./tokensState";

export const fbFarmSelector = selectorFamily<FBFarm | undefined, string>({
    key: 'farm_bribe_farm_selector',
    get: (farmAddress: string) => ({get}) => {
        const farmBribe = get(ashswapBaseState).farmBribe;
        return farmBribe?.farms.find(f => f.address === farmAddress);
    }
});

export const fbTreasuresSelector = selectorFamily<TokenAmount[], string>({
    key: "farm_bribe_treasures_selector",
    get: (farmAddress) => ({get}) => {
        const fbFarm = get(fbFarmSelector(farmAddress));
        return fbFarm?.rewards.map(r => {
            return new TokenAmount(TOKENS_MAP[r.tokenId], r.reserve);
        }) || [];
    }
})

export const fbTotalRewardsUSD = selectorFamily<number, string>({
    key: "farm_bribe_total_rewards_usd_selector",
    get: (farmAddress) => ({get}) => {
        const treasures = get(fbTreasuresSelector(farmAddress));
        const tokenMap = get(tokenMapState);
        return treasures.reduce((sum, r) => sum.plus(r.egld.multipliedBy(tokenMap[r.token.identifier].price)), new BigNumber(0)).toNumber() || 0;
    }
})

export const fbAccountFarmSelector = selectorFamily<FBAccountFarm | undefined, string>({
    key: 'farm_bribe_account_farm_selector',
    get: (farmAddress: string) => ({get}) => {
        const farmBribe = get(ashswapBaseState).farmBribe;
        return farmBribe?.account?.farms.find(f => f.address === farmAddress);
    }
});

export const fbClaimableRewardsSelector = selectorFamily<TokenAmount[], string>({
    key: "farm_bribe_account_rewards_selector",
    get: (farmAddress) => ({get}) => {
        const farm = get(fbAccountFarmSelector(farmAddress));
        return farm?.rewards.map(r => new TokenAmount(TOKENS_MAP[r.tokenId], r.claimable)).filter(t => t.greaterThan(0)) || [];
    }
});

export const fbTotalClaimableUSDSelector = selectorFamily<number, string>({
    key: "farm_bribe_account_farm_total_claimable",
    get: (farmAddress) => ({get}) => {
        const rewards = get(fbClaimableRewardsSelector(farmAddress));
        const tokenMap = get(tokenMapState);
        return rewards.reduce((sum, r) => sum.plus(r.egld.multipliedBy(tokenMap[r.token.identifier].price)), new BigNumber(0)).toNumber() || 0;
    }
})