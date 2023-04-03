import { ENVIRONMENT } from "./env";
type DappContracts = {
    voteEscrowedContract: string;
    feeDistributor: string;
    farmController: string;
    farmBribe: string;
    farmRouter: string;
    router: string;
    dao: string;
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
        farmRouter: "",
        router: "",
        dao: "",
    },
    alpha: {
        voteEscrowedContract:
            "erd1qqqqqqqqqqqqqpgqq6r337l0pvkueyvwpse4e5spg04pq845rmcqgud55c",
        feeDistributor:
            "erd1qqqqqqqqqqqqqpgqvx9kzdpcmrr0mars67wgepujdeq2r598rmcq0lpmrx",
        farmController:
            "erd1qqqqqqqqqqqqqpgq3749x3fhdm72keje2tursqd3k2esd4crrmcqntaekq",
        farmBribe:
            "erd1qqqqqqqqqqqqqpgq44uafwyxv5ncq9255kxlql9lezd7ca4xrmcqtymttd",
        farmRouter:
            "erd1qqqqqqqqqqqqqpgq22qa7s9lksqq5wey8fp7lyv9qtv9jgn7rmcq9spes3",
        router: "erd1qqqqqqqqqqqqqpgqqymfgp22r5gxwsnfvukj5fe7ne4r4ht6rmcq52x3sa",
        dao: "erd1qqqqqqqqqqqqqpgqek6qun6xkvm0n5308vtqe69mhzxxchemrmcqaltmfu"
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
