import { ENVIRONMENT } from "./env";

const dappContractDevnet = {
    voteEscrowedContract:
        "erd1qqqqqqqqqqqqqpgq4zlda4s332txctamdzm8r2etqt4lvk74rmcqr9frj3",
    feeDistributor:
        "erd1qqqqqqqqqqqqqpgqe0dd4felchnrds3xv8tl338dmkh6lqs2rmcqsxnx4n",
};

const dappContractTestnet = {
    voteEscrowedContract:
        "erd1qqqqqqqqqqqqqpgq9gra9jwhp78smw4urff30rpp67rsgkekj9tsku2v9n",
    feeDistributor:
        "erd1qqqqqqqqqqqqqpgqwe94lqzwwr9yxagkra8lylgk7u3m0r50j9tsw8faw4",
};

const dappContract =
    ENVIRONMENT.NETWORK == "devnet" ? dappContractDevnet : dappContractTestnet;

export const ASHSWAP_CONFIG = {
    ashApiBaseUrl: ENVIRONMENT.ASH_API,
    dappContract
    
} as const;