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
            "erd1qqqqqqqqqqqqqpgqynvujuhqhrn6qxf3cl49dmnpxt8mqqzc2gespkqv78",
        feeDistributor:
            "erd1qqqqqqqqqqqqqpgqqxxm63jzwrwyyzc0qaawcxv8zfrpe4je2geshjzzwf",
        farmController: "erd1qqqqqqqqqqqqqpgq89qwwl0rw5vr9ej9uu76ycladefeg8d72ges7l09uv",
        farmBribe: "erd1qqqqqqqqqqqqqpgqqy409d9r8g0m3fx44pu0533wwzne8pnxrmcqrpec8e",
    },
    alpha: {
        voteEscrowedContract:
            "erd1qqqqqqqqqqqqqpgqwj9l857wjzlg3rzq3mjw924pstzwxat3rmcq74wcdr",
        feeDistributor:
            "erd1qqqqqqqqqqqqqpgqnc8n6c2mu2ndvl72ctmsjjdllgdrqgssrmcq2dmt3p",
        farmController:
            "erd1qqqqqqqqqqqqqpgq9yyf4p6rga59hzpfzvgm0y8zz3e3fcarrmcq4vjhpz",
        farmBribe:
            "erd1qqqqqqqqqqqqqpgqgy9lkq5470d4xlrf50d2nscpwelt4jsfrmcq96zrhv",
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
