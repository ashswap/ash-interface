import { TOKENS_BETA } from "const/tokens/index";
import IPool, { EPoolType } from "interface/pool";

const TOKENS_MAP = TOKENS_BETA.TOKENS_MAP;
const POOLS_BETA: IPool[] = [
    {
        address:
            "erd1qqqqqqqqqqqqqpgqs6gv0vs22a53rsdl2v935y565sftp0002gesjn5yp7",
        lpToken: TOKENS_MAP["ALP-c18629"],
        tokens: [
            TOKENS_MAP["USDC-350c4e"],
            TOKENS_MAP["USDT-dd271a"],
            TOKENS_MAP["BUSD-d4c014"],
        ],
        type: EPoolType.PlainPool,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqsgakxwh42kf8ahknextfnk3pxdzscjcv2ges826ccg",
        lpToken: TOKENS_MAP["ALP-fe666f"],
        tokens: [TOKENS_MAP["BUSD-d4c014"], TOKENS_MAP["WEGLD-a28c59"]],
        type: EPoolType.PoolV2,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgq8ydk3m6qphjtre6zp889k03mdl0q92nn2ges6rwzk4",
        lpToken: TOKENS_MAP["ALP-55d5c4"],
        tokens: [TOKENS_MAP["USDT-dd271a"], TOKENS_MAP["ASH-e3d1b7"]],
        type: EPoolType.PoolV2,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqdwgcawfkakpaxmyuh50kktsg3ehu2n6z2gesvyuxvj",
        lpToken: TOKENS_MAP["ALP-2c3abb"],
        tokens: [TOKENS_MAP["BUSD-d4c014"], TOKENS_MAP["UTK-14d57d"]],
        type: EPoolType.PoolV2,
    },
];
export default POOLS_BETA;
