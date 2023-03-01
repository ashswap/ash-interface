import { ENVIRONMENT } from "./env";
type DappContracts = {
    voteEscrowedContract: string;
    feeDistributor: string;
    farmController: string;
    farmBribe: string;
};
type DappContractConfig = {
    alpha: DappContracts;
    beta: DappContracts;
};
const dappContractDevnet: DappContractConfig = {
    beta: {
        voteEscrowedContract:
            "erd1qqqqqqqqqqqqqpgqszgrd5u7v32m4p7dkqqu0jzks7xhcvxy2gesyrxlpd",
        feeDistributor:
            "erd1qqqqqqqqqqqqqpgqx94lrsf0psrql406m58xtuf2zj2pt8ht2ges8zkm95",
        farmController: "erd1qqqqqqqqqqqqqpgqdqn69j46a98gc4s9f8ckzp2nhswhyggq2gesptr8l8",
        farmBribe: "erd1qqqqqqqqqqqqqpgqjjldc9dwrx970l4mvlv2v9kfcj0k2w7p2gesphc4cd",
    },
    alpha: {
        voteEscrowedContract:
            "erd1qqqqqqqqqqqqqpgqsa5zpwjthqqq24v62lq7uuv9ex44fxdrrmcqd0nf0c",
        feeDistributor:
            "erd1qqqqqqqqqqqqqpgqcr8xthnutlnx75rrjl32243xwn5exnpmrmcqegj70z",
        farmController:
            "erd1qqqqqqqqqqqqqpgqzs3msdeag5qredsyjm0jw9t6gued2n3armcqql9x0q",
        farmBribe:
            "erd1qqqqqqqqqqqqqpgqhxh8vhw5hq3qqrsa9yfsjkf9ya0qqqxprmcqrqu9zs",
    },
};

const dappContractMainnet: DappContracts = {
    voteEscrowedContract:
        "erd1qqqqqqqqqqqqqpgq58elfqng8edp0z83pywy3825vzhawfqp4fvsaldek8",
    feeDistributor:
        "erd1qqqqqqqqqqqqqpgqjrlge5rgml6d48tjgu3afqvems88lqzw4fvs9f7lhs",
    farmController: "erd1qqqqqqqqqqqqqpgqzhm689ehkacadr7elzkc3z70h6cqmz0q4fvsftax5t",
    farmBribe: "erd1qqqqqqqqqqqqqpgqgulmfcu8prrv2pmx3nqn5stqu3c42fsz4fvsa9rwdl",
};

const dappContract =
    ENVIRONMENT.NETWORK == "devnet"
        ? dappContractDevnet[ENVIRONMENT.ENV]
        : dappContractMainnet;

export const VE_CONFIG = ENVIRONMENT.NETWORK === "mainnet" ? {
    // main config
    maxLock: 4 * 365 * 24 * 3600,
    minLock: 7 * 24 * 3600,
    // for BoY
    // maxLock: 2 * 7 * 24 * 3600,
    // minLock: 12 * 60 * 60,

} : ENVIRONMENT.ENV === "alpha" ? {
    // for alpha test
    maxLock: 4 * 365 * 24 * 3600,
    minLock: 30 * 60,
} : {
    // beta
    maxLock: 4 * 365 * 24 * 3600,
    minLock: 30 * 60,
};

export const ASHSWAP_CONFIG = {
    ashApiBaseUrl: ENVIRONMENT.ASH_API,
    dappContract,
    farmWeightVoteDelay: 10 * 24 * 3600,
} as const;
