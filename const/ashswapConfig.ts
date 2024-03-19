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
    aggregatorV2: string;
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
            "erd1qqqqqqqqqqqqqpgq3v7zza934936euxk3zg85et4jamqalzmh2usgdgrn2",
        aggregatorV2: "",
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
        aggregator:
            "erd1qqqqqqqqqqqqqpgqqgm4ufxm8pncksv3dt56ura9l7m8900sh2uswmfx7v",
        aggregatorV2: "",
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
    farmRouter:
        "erd1qqqqqqqqqqqqqpgqe0k2j45f3w9krhx2gl0j8fpg2ksepaea4fvssap9nd",
    router: "erd1qqqqqqqqqqqqqpgqjtlmapv42pcga5nglgfrnpqvkq06wdqx4fvsvw6xpt",
    dao: "erd1qqqqqqqqqqqqqpgqvdkft2eq9zh7cu9tkxartshu764tqe7s4fvsaw99xj",
    daoBribe: "erd1qqqqqqqqqqqqqpgqzsmhsv625er2w6w7rel7kmustn3u838f4fvs36jdmc",
    aggregator:
        "erd1qqqqqqqqqqqqqpgqcc69ts8409p3h77q5chsaqz57y6hugvc4fvs64k74v",
    aggregatorV2: "",
};

const dappContractDevnet2: DappContracts = {
    voteEscrowedContract:
        "erd1qqqqqqqqqqqqqpgqw9cpgvfessrch3xyk7qfv75nyfve0vlf2ges4qg8z0",
    feeDistributor:
        "erd1qqqqqqqqqqqqqpgq6hpngdfrkpaxjjmwlhqn3pcrgjawgjjw2gessrusrn",
    farmController:
        "erd1qqqqqqqqqqqqqpgqdpzqrkx5xf6svtlhgc48shr2dph8ug0y2gess4z78s",
    farmBribe: "erd1qqqqqqqqqqqqqpgq65jgpx0q8w7sana8k5pweccuzfrv3ucy2ges44ajcz",
    farmRouter:
        "erd1qqqqqqqqqqqqqpgqxpy9x99pphvgax8kpy626azt6rgpkr7e2gese3fskw",
    router: "erd1qqqqqqqqqqqqqpgqg8nzhgky9w2mj50hhw44u2vnx7d9yzfw2ges2jshtc",
    dao: "erd1qqqqqqqqqqqqqpgqkyd3egsmgsdvjlt8hpql577wqnppn2qx2gesxhrsew",
    daoBribe: "erd1qqqqqqqqqqqqqpgqs88mhhdhnkqumkla0nayz58u45flpea92gesj48vaf",
    aggregator:
        "erd1qqqqqqqqqqqqqpgqzshqdqcdzdl43vhy7p7q8uhc5xzu5x7zh2usyz5kg6",
    aggregatorV2:
        "erd1qqqqqqqqqqqqqpgqqwmpyvgu6htky6a37nvuds4aemzzmw7vh2uscqf7jv",
};

const dappContract =
    ENVIRONMENT.NETWORK == "devnet"
        ? dappContractDevnet[ENVIRONMENT.ENV]
        : ENVIRONMENT.NETWORK == "devnet2"
        ? dappContractDevnet2
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
