import { ENVIRONMENT } from "./env";
type DappContracts = {
    voteEscrowedContract: string;
    feeDistributor: string;
};
type DappContractConfig = {
    dev: DappContracts;
    test: DappContracts;
};
const dappContractDevnet: DappContractConfig = {
    dev: {
        voteEscrowedContract:
            "erd1qqqqqqqqqqqqqpgqy48fl8ck4z5nwjlhnkkqm85ufqrttncprmcqwzldec",
        feeDistributor:
            "erd1qqqqqqqqqqqqqpgq47yvf3lx98f837jcmm4cylnv29re8uryrmcql73mn2",
    },
    test: {
        voteEscrowedContract:
            "erd1qqqqqqqqqqqqqpgqjha3wpatzxhxl7auezw0q8wxrzfu72q8rmcqrk27vs",
        feeDistributor:
            "erd1qqqqqqqqqqqqqpgqjlq6fp98nnl68r9swez37juky3l33p8qrmcqh3863x",
    },
};

const dappContractTestnet: DappContracts = {
    voteEscrowedContract:
        "erd1qqqqqqqqqqqqqpgq5k6v7gnfg4had300gskm99xdr2ks0lk7j9tsxqs4mx",
    feeDistributor:
        "erd1qqqqqqqqqqqqqpgq8l06u6vxt29c4dq77dq3633rx4qn43urj9tsh36lns",
};

const dappContract =
    ENVIRONMENT.NETWORK == "devnet"
        ? dappContractDevnet[ENVIRONMENT.ENV]
        : dappContractTestnet;

export const ASHSWAP_CONFIG = {
    ashApiBaseUrl: ENVIRONMENT.ASH_API,
    dappContract,
} as const;
