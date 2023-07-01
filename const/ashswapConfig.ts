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
        "erd1qqqqqqqqqqqqqpgqgtf40adcdntc9p4hu2tjt03y4kmhyp7l2gesk22gmt",
    feeDistributor:
        "erd1qqqqqqqqqqqqqpgqga57dwpazjwh0jd3msrd7s98h48wmd7d2gesulkknh",
    farmController:
        "erd1qqqqqqqqqqqqqpgqa2f6tv4eyta2q0qtrdcfkaew02m993u82ges437skh",
    farmBribe: "erd1qqqqqqqqqqqqqpgq4qgt6f9n82zdfwahdpnesjadwvy5ldnk2geskxx4h0",
    farmRouter: "erd1qqqqqqqqqqqqqpgqfacdu4ehev8cyy3lgprvrwg7dfs4xmn32geszgzdku",
    router: "erd1qqqqqqqqqqqqqpgqd9pyk4yc9c5dldkcahud4mwx4hyt9ep82ges6slwq4",
    dao: "erd1qqqqqqqqqqqqqpgqtwj4j5l0f8uh7ldzvq2wdhfu6vztkc0a2geskkkd0g",
    daoBribe: "erd1qqqqqqqqqqqqqpgqwxdqzcgl0q6n0547l3c6qjwygkmrwvgl2geszr8qw9",
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
              minLock: 30 * 60,
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
