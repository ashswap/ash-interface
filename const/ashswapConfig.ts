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
            "erd1qqqqqqqqqqqqqpgqjha3wpatzxhxl7auezw0q8wxrzfu72q8rmcqrk27vs",
        feeDistributor:
            "erd1qqqqqqqqqqqqqpgqjlq6fp98nnl68r9swez37juky3l33p8qrmcqh3863x",
    },
};

const dappContractMainnet: DappContracts = {
    voteEscrowedContract:
        "",
    feeDistributor:
        "",
};

const dappContract =
    ENVIRONMENT.NETWORK == "devnet"
        ? dappContractDevnet[ENVIRONMENT.ENV]
        : dappContractMainnet;

export const ASHSWAP_CONFIG = {
    ashApiBaseUrl: ENVIRONMENT.ASH_API,
    dappContract,
} as const;
