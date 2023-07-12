import { ASHSWAP_CONFIG } from "./ashswapConfig";

const _PROPOSALS_CONFIG = {
    "fc:addFarm": "Whitelist farm to receive ASH reward",
    "fr:endProduceRewards": "Stop ASH reward for a farm",
    "fr:startProduceRewards": "Start ASH reward for a farm",
    "fr:createFarm": "Create a new farm",
    "pr:createPool": "Create a new pool",
} as const;

export const PROPOSALS_UNALIAS = {
    fc: ASHSWAP_CONFIG.dappContract.farmController,
    fr: ASHSWAP_CONFIG.dappContract.farmRouter,
    fb: ASHSWAP_CONFIG.dappContract.farmBribe,
    pr: ASHSWAP_CONFIG.dappContract.router,
} as const;
export const PROPOSALS_ALIAS = Object.fromEntries(Object.entries(PROPOSALS_UNALIAS).map(([k, v]) => [v, k as keyof typeof PROPOSALS_UNALIAS]));
export type ProposalTypePrefix = keyof typeof PROPOSALS_UNALIAS;
export type ProposalType = keyof typeof _PROPOSALS_CONFIG;
type Config = {[key in ProposalType]: string};
interface GenericConfig {
    [key: `${ProposalTypePrefix}:${string}`]: string;
}
export const PROPOSALS_CONFIG: GenericConfig & Config = _PROPOSALS_CONFIG;

