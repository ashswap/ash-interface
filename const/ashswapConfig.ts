import { ENVIRONMENT } from "./env";
type DappContracts = {
    voteEscrowedContract: string;
    feeDistributor: string;
};
type DappContractConfig = {
    alpha: DappContracts;
    beta: DappContracts;
};
const dappContractDevnet: DappContractConfig = {
    beta: {
        voteEscrowedContract:
            "erd1qqqqqqqqqqqqqpgqemp4a6mud6kh4x5dflql53uyzs9jrz5ermcq8a5f5v",
        feeDistributor:
            "erd1qqqqqqqqqqqqqpgq4dkwq6fjvr9yuaxj3tpanuul9dy2kvl3rmcq7rseul",
    },
    alpha: {
        voteEscrowedContract:
            "erd1qqqqqqqqqqqqqpgquy2s8dm5k66xu2wvxwvqlfccqy3ke9xermcqx5wqsn",
        feeDistributor:
            "erd1qqqqqqqqqqqqqpgqcgnps9r7g7ywql70s0eusddfue8lgsaurmcqx5yd3w",
    },
};

const dappContractMainnet: DappContracts = {
    voteEscrowedContract: "",
    feeDistributor: "",
};

const dappContract =
    ENVIRONMENT.NETWORK == "devnet"
        ? dappContractDevnet[ENVIRONMENT.ENV]
        : dappContractMainnet;

export const VE_CONFIG = {
    // main config
    // maxLock: 4 * 365 * 24 * 3600,
    // minLock: 7 * 24 * 3600,
    // for BoY
    maxLock: 2 * 7 * 24 * 3600,
    minLock: ENVIRONMENT.ENV === 'alpha' ? 10 * 60 : 12 * 60 * 60
}

export const ASHSWAP_CONFIG = {
    ashApiBaseUrl: ENVIRONMENT.ASH_API,
    dappContract,
} as const;
