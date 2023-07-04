import { ENVIRONMENT } from "./env";
type DappContracts = {
    voteEscrowedContract: string;
    feeDistributor: string;
    farmController: string;
    farmBribe: string;
    farmRouter: string;
    router: string;
    dao: string;
    daoBribe: string;
    aggregator: string;
};
type DappContractConfig = {
    alpha: DappContracts;
    beta: DappContracts;
};
const dappContractDevnet: DappContractConfig = {
    beta: {
        voteEscrowedContract:
            "erd1qqqqqqqqqqqqqpgqynvujuhqhrn6qxf3cl49dmnpxt8mqqzc2gespkqv78",
        feeDistributor:
            "erd1qqqqqqqqqqqqqpgqqxxm63jzwrwyyzc0qaawcxv8zfrpe4je2geshjzzwf",
        farmController:
            "erd1qqqqqqqqqqqqqpgq89qwwl0rw5vr9ej9uu76ycladefeg8d72ges7l09uv",
        farmBribe:
            "erd1qqqqqqqqqqqqqpgqug6hxflvk0yglgcvdhe40hv45tzzaxf42geslxp3gp",
        farmRouter:
            "erd1qqqqqqqqqqqqqpgqgnk6usl4ekqnlqv4aeh3fvsxddz64tfg2ges4tlpax",
        router: "erd1qqqqqqqqqqqqqpgqmj4lt9xd87fvafnyjwut66palhnpdr5v2gesvjepfr",
        dao: "erd1qqqqqqqqqqqqqpgqpdafdulu42f6g8pn9pavufgmdkltnctf2gesh48l44",
        daoBribe:
            "erd1qqqqqqqqqqqqqpgqqdt2ckhgn3yw6qxskawmywc98dv5jegg2ges40ygkh",
        aggregator:
            "erd1qqqqqqqqqqqqqpgqqtaru570tfcq4fwer9nlnzl6n4afp4yzh2uswv2vkh",
    },
    alpha: {
        voteEscrowedContract:
            "erd1qqqqqqqqqqqqqpgqpuwncrs3j78vqglvyap6h4ds7e3snmqsrmcqglmses",
        feeDistributor:
            "erd1qqqqqqqqqqqqqpgqc20uz6mfwmplrslsddczqy0e8xd7p7awrmcqr7kqy8",
        farmController:
            "erd1qqqqqqqqqqqqqpgqyejz40vrxfk9p2q2dsc5mztxp84z3ylhrmcqqaakpa",
        farmBribe:
            "erd1qqqqqqqqqqqqqpgqlppad3qcy4l6d562m5pr0ahqpkncyp4crmcqxmltg3",
        farmRouter:
            "erd1qqqqqqqqqqqqqpgqu7ysq4tqhfdmltnfl8fu0jjguwfvy5n8rmcqtt0n36",
        router: "erd1qqqqqqqqqqqqqpgq0u00t004x7mfr7dxj0c7774aktpnc7zurmcqj59q8d",
        dao: "erd1qqqqqqqqqqqqqpgq8ktcklq3qvmwpjchvadp6fm6apnn6crlrmcqegtnt3",
        daoBribe:
            "erd1qqqqqqqqqqqqqpgq7qpg3085qdweu3wx9tphq2t5gwz2mf4xrmcqagprme",
        aggregator: "",
    },
};

const dappContractMainnet: DappContracts = {
    voteEscrowedContract:
        "erd1qqqqqqqqqqqqqpgq58elfqng8edp0z83pywy3825vzhawfqp4fvsaldek8",
    feeDistributor:
        "erd1qqqqqqqqqqqqqpgqjrlge5rgml6d48tjgu3afqvems88lqzw4fvs9f7lhs",
    farmController:
        "erd1qqqqqqqqqqqqqpgqzhm689ehkacadr7elzkc3z70h6cqmz0q4fvsftax5t",
    farmBribe: "erd1qqqqqqqqqqqqqpgqgulmfcu8prrv2pmx3nqn5stqu3c42fsz4fvsa9rwdl",
    farmRouter: "",
    router: "",
    dao: "",
    daoBribe: "",
    aggregator:
        "erd1qqqqqqqqqqqqqpgqjm9xl2s2v5r6lvranfaa84pkmqcz43e04fvs7h8ljn",
};

const dappContract =
    ENVIRONMENT.NETWORK == "devnet"
        ? dappContractDevnet[ENVIRONMENT.ENV]
        : dappContractMainnet;

export const VE_CONFIG =
    ENVIRONMENT.NETWORK === "mainnet"
        ? {
              // main config
              maxLock: 4 * 365 * 24 * 3600,
              minLock: 7 * 24 * 3600,
              // for BoY
              // maxLock: 2 * 7 * 24 * 3600,
              // minLock: 12 * 60 * 60,
          }
        : ENVIRONMENT.ENV === "alpha"
        ? {
              // for alpha test
              maxLock: 4 * 365 * 24 * 3600,
              minLock: 60 * 60,
          }
        : {
              // beta
              maxLock: 4 * 365 * 24 * 3600,
              minLock: 30 * 60,
          };

export const ASHSWAP_CONFIG = {
    ashApiBaseUrl: ENVIRONMENT.ASH_API,
    dappContract,
    farmWeightVoteDelay:
        ENVIRONMENT.NETWORK === "devnet" && ENVIRONMENT.ENV === "alpha"
            ? 3600
            : 10 * 24 * 3600,
} as const;
