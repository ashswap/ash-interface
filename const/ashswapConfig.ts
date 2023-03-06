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
            "erd1qqqqqqqqqqqqqpgqf452zdf0tsrd5usj5nvelp7jpp6ju28crmcq0yuklh",
        feeDistributor:
            "erd1qqqqqqqqqqqqqpgqn968dydf7wmlds54d7xnk0nymz2077klrmcqcvj38v",
        farmController:
            "erd1qqqqqqqqqqqqqpgq020wtp2wjmgr2u4ndthg6g48ftarkp9zrmcq7chnyp",
        farmBribe:
            "erd1qqqqqqqqqqqqqpgqdvqlfmxfz945hp8ymflxm7ux9yhek6zjrmcqa0y9jz",
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
    minLock: 60 * 60,
} : {
    // beta
    maxLock: 4 * 365 * 24 * 3600,
    minLock: 30 * 60,
};

export const ASHSWAP_CONFIG = {
    ashApiBaseUrl: ENVIRONMENT.ASH_API,
    dappContract,
    farmWeightVoteDelay: ENVIRONMENT.NETWORK === "devnet" && ENVIRONMENT.ENV === "alpha" ? 3600 : 10 * 24 * 3600,
} as const;
