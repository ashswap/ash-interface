import { TOKENS_BETA2 } from "const/tokens/index";
import IPool, { EPoolType } from "interface/pool";

const TOKENS_MAP = TOKENS_BETA2.TOKENS_MAP;
const POOLS_BETA2: IPool[] = [
    {
        address:
            "erd1qqqqqqqqqqqqqpgqpmpm5wlp6x3r3k6g4eqsawex92tgsck52gesmcykhs",
        lpToken: TOKENS_MAP["ALP-a89380"],
        tokens: [
            TOKENS_MAP["USDC-350c4e"],
            TOKENS_MAP["USDT-dd271a"],
            TOKENS_MAP["BUSD-d4c014"],
        ],
        type: EPoolType.PlainPool,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgq9dwlgpy9jxda7kh9zeumjld0tz39w8up2ges9r6s4g",
        lpToken: TOKENS_MAP["ALP-20e461"],
        tokens: [TOKENS_MAP["BUSD-d4c014"], TOKENS_MAP["WEGLD-a28c59"]],
        type: EPoolType.PoolV2,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqmky28nrxcwh37x0qetff9khpvccp4t5w2geswj8ttu",
        lpToken: TOKENS_MAP["ALP-50c469"],
        tokens: [TOKENS_MAP["USDC-350c4e"], TOKENS_MAP["WEGLD-a28c59"]],
        type: EPoolType.PoolV2,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgq96u35kdgr4j5vqc9caj2tgg63mpc96ws2gesrkdskq",
        lpToken: TOKENS_MAP["ALP-f53874"],
        tokens: [TOKENS_MAP["USDT-58d5d0"], TOKENS_MAP["ASH-e3d1b7"]],
        type: EPoolType.PoolV2,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgq280hzavv72k2tdrdakq4tz64zhwznuln2gesx9a5y7",
        lpToken: TOKENS_MAP["ALP-caeac5"],
        tokens: [TOKENS_MAP["BUSD-d4c014"], TOKENS_MAP["UTK-14d57d"]],
        type: EPoolType.PoolV2,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqq8j8awvqpcptzsnjz0lqlfd02q96zktu2gesgyal9y",
        lpToken: TOKENS_MAP["ALP-097c45"],
        tokens: [TOKENS_MAP["WEGLD-a28c59"], TOKENS_MAP["JWLEGLD-e4b8d3"]],
        type: EPoolType.PlainPool,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqlngl0xwzl3lulpeam4tycq70e83mrr6x2gesf656dj",
        lpToken: TOKENS_MAP["ALP-7f4b3f"],
        tokens: [TOKENS_MAP["USDC-350c4e"], TOKENS_MAP["JWLUSD-3d1fab"]],
        type: EPoolType.PlainPool,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgq24zr42pzmpxrklt04a2tq5qx7ajxyzsh2ges4fdr54",
        lpToken: TOKENS_MAP["ALP-e4391a"],
        tokens: [TOKENS_MAP["WEGLD-a28c59"], TOKENS_MAP["SEGLD-f94c36"]],
        type: EPoolType.LendingPool,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgq4zlgmjruxmp657p6fueh823h7h9rgasd2gestk2sc4",
        lpToken: TOKENS_MAP["ALP-3763b9"],
        tokens: [TOKENS_MAP["SEGLD-f94c36"], TOKENS_MAP["JWLEGLD-e4b8d3"]],
        type: EPoolType.LendingPool,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgq3r7sus3slny8nxf4eh7gdrey7dc073ud2ges36dhrr",
        lpToken: TOKENS_MAP["ALP-2be5ea"],
        tokens: [TOKENS_MAP["JWLEGLD-e4b8d3"], TOKENS_MAP["EPUNKS-50d907"]],
        type: EPoolType.PoolV2,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqxutyaca3w426r6pedg2v3ea587es9d9t2gesk2t977",
        lpToken: TOKENS_MAP["ALP-a2b238"],
        tokens: [TOKENS_MAP["HTM-23a1da"], TOKENS_MAP["JWLHTM-3ed083"]],
        type: EPoolType.PlainPool,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqlkt2rnfg0umtp52vd3rks8u0ddagn7g32ges5p28nd",
        lpToken: TOKENS_MAP["ALP-f5e6d8"],
        tokens: [TOKENS_MAP["USDC-350c4e"], TOKENS_MAP["USDT-58d5d0"]],
        type: EPoolType.PlainPool,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqpu4n98hdaqx87kwrht07jhl6l5rl4h942gesv0tjlw",
        lpToken: TOKENS_MAP["ALP-47b8c2"],
        tokens: [TOKENS_MAP["WEGLD-a28c59"], TOKENS_MAP["PROTEO-6ca7c8"]],
        type: EPoolType.PoolV2,
    },
];
export default POOLS_BETA2;
