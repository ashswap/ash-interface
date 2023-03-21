import BigNumber from "bignumber.js";
import { ENVIRONMENT } from "const/env";
import { TOKENS_MAP } from "const/tokens";
import { FBAccountFarm, FBFarm } from "graphql/type.graphql";
import { TokenAmount } from "helper/token/tokenAmount";
import { selectorFamily } from "recoil";
import { ashswapBaseState } from "./ashswap";
import { fcFarmSelector } from "./farmControllerState";
import { tokenMapState } from "./tokensState";
const PRECISION = new BigNumber(1e18);

export const fbFarmSelector = selectorFamily<FBFarm | undefined, string>({
    key: 'farm_bribe_farm_selector',
    get: (farmAddress: string) => ({get}) => {
        const farmBribe = get(ashswapBaseState).farmBribe;
        return farmBribe?.farms.find(f => f.address === farmAddress);
    }
});

export const fbCurrentRoundTreasuresSelector = selectorFamily<TokenAmount[], string>({
    key: "farm_bribe_total_treasures_allocation_current_round_selector",
    get: (farmAddress) => ({get}) => {
        const fbFarm = get(fbFarmSelector(farmAddress));
        return fbFarm?.rewards.map(r => {
            return new TokenAmount(TOKENS_MAP[r.tokenId], r.reserve);
        }) || [];
    }
})

export const fbTreasuresSelector = selectorFamily<TokenAmount[], string>({
    key: "farm_bribe_total_availabel_treasures_selector",
    get: (farmAddress) => ({get}) => {
        const fbFarm = get(fbFarmSelector(farmAddress));
        const fcFarm = get(fcFarmSelector(farmAddress));
        return fbFarm?.rewards.map(r => {
            const currentAlloc = new BigNumber(r.rewardPerVote).multipliedBy(fcFarm?.votedPoint.bias || 0).idiv(PRECISION);
            const available = new BigNumber(r.total).minus(r.claimed);
            const nextWeek = available.minus(currentAlloc);
            return new TokenAmount(TOKENS_MAP[r.tokenId], nextWeek.gt(10) ? nextWeek : 0);
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

export const fbHasBribe = selectorFamily<boolean, string>({
    key: "farm_bribe_has_bribe_selector",
    get: (farmAddress) => ({get}) => {
        const treasures = get(fbTreasuresSelector(farmAddress));
        // if total treasures in wei units is less than 10 -> should be ignored
        return !!treasures?.some((r) => r.raw.gt(10)) && ENVIRONMENT.NETWORK !== "mainnet";
    }
})