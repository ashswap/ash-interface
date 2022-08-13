import { ENVIRONMENT } from "./env";

const dappContractDevnet = {
    voteEscrowedContract:
        "erd1qqqqqqqqqqqqqpgq4zlda4s332txctamdzm8r2etqt4lvk74rmcqr9frj3",
    feeDistributor:
        "erd1qqqqqqqqqqqqqpgqe0dd4felchnrds3xv8tl338dmkh6lqs2rmcqsxnx4n",
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