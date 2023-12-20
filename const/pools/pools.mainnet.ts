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
    {
        address:
            "erd1qqqqqqqqqqqqqpgqaf8fzwmas77xxr7qwnxd6j3qsctv55e74fvsmvq675",
        lpToken: TOKENS_MAP["ALP-0fe50a"],
        tokens: [TOKENS_MAP["SEGLD-3ad2d0"], TOKENS_MAP["WEGLD-bd4d79"]],
        type: EPoolType.LendingPool,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqhvj3vgwhzg26ghaseae6ehleq0r73xd24fvs358shm",
        lpToken: TOKENS_MAP["ALP-796121"],
        tokens: [TOKENS_MAP["HSEGLD-c13a4e"], TOKENS_MAP["SEGLD-3ad2d0"]],
        type: EPoolType.LendingPool,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqlc8ng44k7q3s7l62cz248nkmhltm8cg64fvsfq2xht",
        lpToken: TOKENS_MAP["ALP-f7dee1"],
        tokens: [TOKENS_MAP["ASH-a642d1"], TOKENS_MAP["JWLASH-f362b9"]],
        type: EPoolType.PlainPool,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqa60cy30kdzzd8mygg20zhe4ppfhrp0tv4fvs9vd4hp",
        lpToken: TOKENS_MAP["ALP-713ae8"],
        tokens: [TOKENS_MAP["WEGLD-bd4d79"], TOKENS_MAP["JWLEGLD-023462"]],
        type: EPoolType.PlainPool,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqpa9yh80fm9zad85phkuhr4cm323my5k94fvsxf5akw",
        lpToken: TOKENS_MAP["ALP-d97011"],
        tokens: [TOKENS_MAP["WEGLD-bd4d79"], TOKENS_MAP["CGO-5e9528"]],
        type: EPoolType.PoolV2,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqcaaahzjqgzhcpqjnlgcn0cx03pr9wg754fvshd6qhv",
        lpToken: TOKENS_MAP["ALP-0ed700"],
        tokens: [TOKENS_MAP["HTM-f51d55"], TOKENS_MAP["JWLHTM-8e3cd5"]],
        type: EPoolType.PlainPool,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqlsgfr6xteusallzcspt3ehp8cewlp3s04fvsjm87cw",
        lpToken: TOKENS_MAP["ALP-2265f4"],
        tokens: [TOKENS_MAP["SEGLD-3ad2d0"], TOKENS_MAP["JWLEGLD-023462"]],
        type: EPoolType.LendingPool,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqs6h95lm3msd0juwc6mkq8u6mpp5fnpvg4fvsq533he",
        lpToken: TOKENS_MAP["ALP-deda92"],
        tokens: [TOKENS_MAP["MEX-455c57"], TOKENS_MAP["JWLMEX-ef8788"]],
        type: EPoolType.PlainPool,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqq4x0g87cg6834h0f7eq4zex473n46ett4fvsg6kvu5",
        lpToken: TOKENS_MAP["ALP-fe21d9"],
        tokens: [TOKENS_MAP["USDC-c76f1f"], TOKENS_MAP["JWLUSD-62939e"]],
        type: EPoolType.PlainPool,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgq69ygvajjlpem5yh7v4qc98au8q5ner0l4fvshc4k5x",
        lpToken: TOKENS_MAP["ALP-20179e"],
        tokens: [TOKENS_MAP["UTK-2f80e9"], TOKENS_MAP["JWLUTK-2a518c"]],
        type: EPoolType.PlainPool,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqhcuaaz7tfndte7w62p2m22xdr605uuye4fvshqzufd",
        lpToken: TOKENS_MAP["ALP-487964"],
        tokens: [TOKENS_MAP["JWLUSD-62939e"], TOKENS_MAP["WSDAI-277fee"]],
        type: EPoolType.PoolV2,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqguf2y57kze3lm5w0h02ax38sfqp95sn64fvsq5qwx9",
        lpToken: TOKENS_MAP["ALP-0f46fa"],
        tokens: [TOKENS_MAP["JWLEGLD-023462"], TOKENS_MAP["EPUNKS-dc0f59"]],
        type: EPoolType.PoolV2,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqt4m0uaamjegpggvzxc8hh22z2r8fgf6v4fvstvetgx",
        lpToken: TOKENS_MAP["ALP-92992e"],
        tokens: [TOKENS_MAP["USDC-c76f1f"], TOKENS_MAP["DNA-b144d1"]],
        type: EPoolType.PoolV2,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgq4hmvs47rnj6n663mteyxyxpw47h2jwsj4fvs74qdvj",
        lpToken: TOKENS_MAP["ALP-19d6c0"],
        tokens: [
            TOKENS_MAP["USDC-c76f1f"],
            TOKENS_MAP["USDT-f8c08c"],
        ],
        type: EPoolType.PlainPool,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqf48ydzn8shr8mnmrvydq2fn9v2afzd3c4fvsk4wglm",
        lpToken: TOKENS_MAP["ALP-8d8415"],
        tokens: [TOKENS_MAP["USDC-c76f1f"], TOKENS_MAP["WEGLD-bd4d79"]],
        type: EPoolType.PoolV2,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqkvfry6tyaagy84pd897krlqc82jhtlpw4fvs7nc60d",
        lpToken: TOKENS_MAP["ALP-25b383"],
        tokens: [TOKENS_MAP["JWLUSD-62939e"], TOKENS_MAP["JWLEGLD-023462"]],
        type: EPoolType.PoolV2,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgq3ed8p278dm5rlt94kflvgsskkp0ap3jj4fvs3lekwu",
        lpToken: TOKENS_MAP["ALP-45512a"],
        tokens: [TOKENS_MAP["USDT-f8c08c"], TOKENS_MAP["WDAI-9eeb54"], TOKENS_MAP["JWLUSD-62939e"]],
        type: EPoolType.PlainPool,
    },
];

export default POOLS_MAINNET;
