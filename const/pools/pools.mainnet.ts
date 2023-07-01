import { TOKENS_MAINNET } from "const/tokens/index";
import IPool, { EPoolType } from "interface/pool";

const TOKENS_MAP = TOKENS_MAINNET.TOKENS_MAP;
const POOLS_MAINNET: IPool[] = [
    {
        address:
            "erd1qqqqqqqqqqqqqpgqdngq580ceg8fsrmk5fad8cckzr2m6d2t2ges46gedp",
        lpToken: TOKENS_MAP["ALP-c12752"],
        tokens: [
            TOKENS_MAP["USDC-bb1e62"],
            TOKENS_MAP["USDT-821a84"],
            TOKENS_MAP["BUSD-2cbb2d"],
        ],
        type: EPoolType.PlainPool,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgq5tyhky2cgatakmjwpdpx5p5zh9keqqm32gesnukatu",
        lpToken: TOKENS_MAP["ALP-d935a5"],
        tokens: [TOKENS_MAP["BUSD-2cbb2d"], TOKENS_MAP["WEGLD-795247"]],
        type: EPoolType.PoolV2,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqn5at779he2gp3tuj4vsmlq7wntdqjq6d2gesftjyd0",
        lpToken: TOKENS_MAP["ALP-c0b453"],
        tokens: [TOKENS_MAP["USDT-821a84"], TOKENS_MAP["ASH-a85626"]],
        type: EPoolType.PoolV2,
    },
];

export default POOLS_MAINNET;
