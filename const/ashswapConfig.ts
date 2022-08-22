import { ENVIRONMENT } from "./env";

const dappContractDevnet = {
    voteEscrowedContract:
        "erd1qqqqqqqqqqqqqpgqy48fl8ck4z5nwjlhnkkqm85ufqrttncprmcqwzldec",
    feeDistributor:
        "erd1qqqqqqqqqqqqqpgq47yvf3lx98f837jcmm4cylnv29re8uryrmcql73mn2",
};

const dappContractTestnet = {
    voteEscrowedContract:
        "erd1qqqqqqqqqqqqqpgqq0sk3fgasyuch0nf9lspx0ygc2038hl3j9tsufvhcp",
    feeDistributor:
        "erd1qqqqqqqqqqqqqpgqfyhu3tk6y7f8ugxqtrzcjm06delxe9hxj9tsz29z2j",
};

const dappContract =
    ENVIRONMENT.NETWORK == "devnet" ? dappContractDevnet : dappContractTestnet;

export const ASHSWAP_CONFIG = {
    ashApiBaseUrl: ENVIRONMENT.ASH_API,
    dappContract
    
} as const;