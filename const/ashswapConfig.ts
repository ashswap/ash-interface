import { ENVIRONMENT } from "./env";

const dappContractDevnet = {
    voteEscrowedContract:
        "erd1qqqqqqqqqqqqqpgq5zj4cjyeafshqw08dagp6unn0q5nen65rmcqtnmwda",
    feeDistributor:
        "erd1qqqqqqqqqqqqqpgqg8zcrgrpaapn5k9yd5ll5m7a2wz8mhkkrmcqvclsfu",
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