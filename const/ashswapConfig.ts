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
            "erd1qqqqqqqqqqqqqpgqmvv8hpzg2d6fc5z9tcm8p2aes7qve26krmcqpw84n5",
        feeDistributor:
            "erd1qqqqqqqqqqqqqpgqylsfrzwl65ez8d34lqzu8zxks6vnua3trmcq6cr5v4",
        farmController: "",
        farmBribe: "",
    },
    alpha: {
        voteEscrowedContract:
            "erd1qqqqqqqqqqqqqpgqgnfxzj8uru99wu5ka5wqezc6ee65tcu3rmcq454jzx",
        feeDistributor:
            "erd1qqqqqqqqqqqqqpgqsrh7z3lrnqjzf3qclsxsktqa7l0usnq8rmcqkh7q83",
        farmController:
            "erd1qqqqqqqqqqqqqpgqtujf3ds0payf9uxwsstll07n4496ehzdrmcqk464y2",
        farmBribe:
            "erd1qqqqqqqqqqqqqpgqlywawcdkftxxmpvghvvmw4kewxy59cvfrmcqxcvht9",
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

export const VE_CONFIG = {
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
