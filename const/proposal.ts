import { ASHSWAP_CONFIG } from "./ashswapConfig";

interface Config {
    [key: `${keyof typeof PROPOSALS_UNALIAS}:${string}`]: string
}
export const PROPOSALS_CONFIG: Config = {
    ["fc:addFarm"]: "Whitelist farm to receive ASH reward",
    [`fr:endProduceRewards`]: "Stop ASH reward for a farm",
    [`fr:startProduceRewards`]: "Start ASH reward for a farm",
} as const;

export type ProposalType = keyof typeof PROPOSALS_CONFIG;
export const PROPOSALS_UNALIAS = {
    fc: ASHSWAP_CONFIG.dappContract.farmController,
    fr: ASHSWAP_CONFIG.dappContract.farmRouter,
    fb: ASHSWAP_CONFIG.dappContract.farmBribe,
    pr: ASHSWAP_CONFIG.dappContract.router,
} as const;

export const PROPOSALS_ALIAS = Object.fromEntries(Object.entries(PROPOSALS_UNALIAS).map(([k, v]) => [v, k as keyof typeof PROPOSALS_UNALIAS]));