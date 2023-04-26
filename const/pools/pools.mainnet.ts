import { TOKENS_MAINNET } from "const/tokens/index";
import IPool, { EPoolType } from "interface/pool";

const TOKENS_MAP = TOKENS_MAINNET.TOKENS_MAP;
const POOLS_MAINNET: IPool[] = [
    {
        address:
            "erd1qqqqqqqqqqqqqpgqs8p2v9wr8j48vqrmudcj94wu47kqra3r4fvshfyd9c",
        lpToken: TOKENS_MAP["ALP-afc922"],
        tokens: [
            TOKENS_MAP["USDC-c76f1f"],
            TOKENS_MAP["USDT-f8c08c"],
            TOKENS_MAP["BUSD-40b57e"],
        ],
        type: EPoolType.PlainPool,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgq5l05l0ts4lphdktx33apl0ss9rzf4r244fvsva6j53",
        lpToken: TOKENS_MAP["ALP-5f9191"],
        tokens: [TOKENS_MAP["BUSD-40b57e"], TOKENS_MAP["WEGLD-bd4d79"]],
        type: EPoolType.PoolV2,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqn7969pvzaatp8p9yu6u5h2ce2gyw0x9j4fvsplvthl",
        lpToken: TOKENS_MAP["ALP-2d0cf8"],
        tokens: [TOKENS_MAP["USDT-f8c08c"], TOKENS_MAP["ASH-a642d1"]],
        type: EPoolType.PoolV2,
    },
];

export default POOLS_MAINNET;
