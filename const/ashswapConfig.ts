import { ENVIRONMENT } from "./env";
type DappContracts = {
    voteEscrowedContract: string;
    feeDistributor: string;
    farmController: string;
    farmBribe: string;
    aggregator: string;
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
        aggregator: "erd1qqqqqqqqqqqqqpgqyqsddhthmp7ejpu9z7zwrssa6q4u6cpygeusmeenf7",
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
        aggregator: "",
    },
};

const dappContractMainnet: DappContracts = {
    voteEscrowedContract:
        "erd1qqqqqqqqqqqqqpgqgtf40adcdntc9p4hu2tjt03y4kmhyp7l2gesk22gmt",
    feeDistributor:
        "erd1qqqqqqqqqqqqqpgqga57dwpazjwh0jd3msrd7s98h48wmd7d2gesulkknh",
    farmController: "erd1qqqqqqqqqqqqqpgqa2f6tv4eyta2q0qtrdcfkaew02m993u82ges437skh",
    farmBribe: "erd1qqqqqqqqqqqqqpgq4qgt6f9n82zdfwahdpnesjadwvy5ldnk2geskxx4h0",
    aggregator: "erd1qqqqqqqqqqqqqpgqglgkaxm73j7mhw5u940fsmmncnayxj884fvs54lnr6",
};

const dappContract =
    ENVIRONMENT.NETWORK == "devnet"
        ? dappContractDevnet[ENVIRONMENT.ENV]
        : dappContractMainnet;

export const VE_CONFIG = ENVIRONMENT.NETWORK === "mainnet" ? {
    // main config
    maxLock: 4 * 365 * 24 * 3600,
    minLock: 30 * 60,
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
