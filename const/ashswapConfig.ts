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
            "erd1qqqqqqqqqqqqqpgqy48fl8ck4z5nwjlhnkkqm85ufqrttncprmcqwzldec",
        feeDistributor:
            "erd1qqqqqqqqqqqqqpgq47yvf3lx98f837jcmm4cylnv29re8uryrmcql73mn2",
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
