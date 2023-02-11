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
            "erd1qqqqqqqqqqqqqpgqh9xd98pe9h465j468sthawmqsjsk2hazrmcq60qw03",
        feeDistributor:
            "erd1qqqqqqqqqqqqqpgqypagz2qyxuqgxckhuzqqdxq0rsc9khsyrmcqctcn4t",
        farmController: "erd1qqqqqqqqqqqqqpgqgv76spde87ul9f0psv8en0t767mel2q7rmcqv75vw9",
        farmBribe: "erd1qqqqqqqqqqqqqpgq8fwcyssfxrpv0ef22zdwgszc2hcsyqckrmcq945tw4",
    },
    alpha: {
        voteEscrowedContract:
            "erd1qqqqqqqqqqqqqpgq5xjphmtheu87zpcgvt3v6wkwlg0sfvzjrmcqzu363p",
        feeDistributor:
            "erd1qqqqqqqqqqqqqpgqheeffqc8atf5xrx5k4lrzd35d3sp3ukmrmcqsj4fzm",
        farmController:
            "erd1qqqqqqqqqqqqqpgq4ljdjsuguhfr5xjvhnaj2qk63nqhyrjgrmcqst8z0r",
        farmBribe:
            "erd1qqqqqqqqqqqqqpgqufy2dxja0dpp4c8dn59cuz6v67xw7sf9rmcqe0s4as",
    },
};

const dappContractMainnet: DappContracts = {
    voteEscrowedContract:
        "erd1qqqqqqqqqqqqqpgq0679eygvlua6wxaqvvdgy3k6kjahk7a4tk2qpwlv8z",
    feeDistributor:
        "erd1qqqqqqqqqqqqqpgqg6c8dasj4nnyqn7m97vd4a234rd4ypd4tk2qxxw9qw",
    farmController: "",
    farmBribe: "",
};

const dappContract =
    ENVIRONMENT.NETWORK == "devnet"
        ? dappContractDevnet[ENVIRONMENT.ENV]
        : dappContractMainnet;

export const VE_CONFIG = ENVIRONMENT.ENV === "alpha" ? {
    // for alpha test
    maxLock: 4 * 365 * 24 * 3600,
    minLock: 10 * 60,
} : {
    // main config
    maxLock: 4 * 365 * 24 * 3600,
    minLock: 7 * 24 * 3600,
    // for BoY
    // maxLock: 2 * 7 * 24 * 3600,
    // minLock: 12 * 60 * 60,

};

export const ASHSWAP_CONFIG = {
    ashApiBaseUrl: ENVIRONMENT.ASH_API,
    dappContract,
} as const;
