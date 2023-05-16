import { TOKENS_ALPHA } from "const/tokens/index";
import IPool, { EPoolType } from "interface/pool";

const TOKENS_MAP = TOKENS_ALPHA.TOKENS_MAP;
const POOLS_ALPHA: IPool[] = [
    {
        address:
            "erd1qqqqqqqqqqqqqpgq2tfpxjad737gz8y8vk5ccaqucc4lpngprmcq8ee66a",
        lpToken: TOKENS_MAP["ALP-cc035f"],
        tokens: [
            TOKENS_MAP["USDC-fd47e9"],
            TOKENS_MAP["USDT-3e3720"],
            TOKENS_MAP["BUSD-b53884"],
        ],
        type: EPoolType.PlainPool,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgq8naz58m5vvm7054crz0cusx5djeuuhzsrmcq8klglz",
        lpToken: TOKENS_MAP["ALP-543842"],
        tokens: [TOKENS_MAP["WEGLD-578a26"], TOKENS_MAP["AEGLD-581e63"]],
        type: EPoolType.LendingPool,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgq7gj76m2c6yepujznzdy3tn9pdk2mlr2qrmcqp7l7sr",
        lpToken: TOKENS_MAP["ALP-6bb819"],
        tokens: [TOKENS_MAP["AUSD-47f281"], TOKENS_MAP["ALP-cc035f"]],
        type: EPoolType.MetaPool,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqa5q3qa3wgcmykemapza2ynah7mf55c04rmcqkevv5l",
        lpToken: TOKENS_MAP["ALP-193fb4"],
        tokens: [TOKENS_MAP["USDT-3e3720"], TOKENS_MAP["ASH-84eab0"]],
        type: EPoolType.PoolV2,
    },
];

export default POOLS_ALPHA;