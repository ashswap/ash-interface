import { TOKENS_BETA } from "const/tokens/index";
import IPool, { EPoolType } from "interface/pool";

const TOKENS_MAP = TOKENS_BETA.TOKENS_MAP;
const POOLS_BETA: IPool[] = [
    {
        address:
            "erd1qqqqqqqqqqqqqpgq3sfgh89vurcdet6lwl4cysqddeyk0rqh2gesqpkk4e",
        lpToken: TOKENS_MAP["ALP-9b7a73"],
        tokens: [
            TOKENS_MAP["USDC-8d4068"],
            TOKENS_MAP["USDT-188935"],
            TOKENS_MAP["BUSD-632f7d"],
        ],
        type: EPoolType.PlainPool,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgq65a4d6rv2czrk3uvfcxan7543geyvdp82ges44d43y",
        lpToken: TOKENS_MAP["ALP-6b7c94"],
        tokens: [TOKENS_MAP["BUSD-632f7d"], TOKENS_MAP["WEGLD-d7c6bb"]],
        type: EPoolType.PoolV2,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgq9flqlgtsek6k5ppcqh0hphzv9vv2dxn62geskve0ly",
        lpToken: TOKENS_MAP["ALP-0e6b1c"],
        tokens: [TOKENS_MAP["USDT-188935"], TOKENS_MAP["ASH-4ce444"]],
        type: EPoolType.PoolV2,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqtrla4ke85vs57e3jlua9dkm0ycgn6n2c2gesa02uuc",
        lpToken: TOKENS_MAP["ALP-3c3066"],
        tokens: [TOKENS_MAP["BUSD-632f7d"], TOKENS_MAP["UTK-a2a792"]],
        type: EPoolType.PoolV2,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqwqrrwk3npn4d26q5f0ltsang08q0fj8w2gesa4karx",
        lpToken: TOKENS_MAP["ALP-b9e453"],
        tokens: [TOKENS_MAP["USDT-188935"], TOKENS_MAP["HTM-fe1f69"]],
        type: EPoolType.PoolV2,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgq6t46575knqqfamnchlfgxvd56x2ymhvf2ges6xpr4s",
        lpToken: TOKENS_MAP["ALP-bf3d53"],
        tokens: [TOKENS_MAP["WEGLD-d7c6bb"], TOKENS_MAP["SEGLD-90b353"]],
        type: EPoolType.LendingPool,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqn4uu4yauhv8pjjvhvgxmhyqk82ftzytq2gesrmrprk",
        lpToken: TOKENS_MAP["ALP-9836b4"],
        tokens: [TOKENS_MAP["WEGLD-d7c6bb"], TOKENS_MAP["HSEGLD-8f2360"]],
        type: EPoolType.LendingPool,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgq3du96js0eu7aa43wqpphh3wy969es5ws2gesx49un4",
        lpToken: TOKENS_MAP["ALP-278df8"],
        tokens: [TOKENS_MAP["WEGLD-d7c6bb"], TOKENS_MAP["LEGLD-3e7182"]],
        type: EPoolType.LendingPool,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgq7ltf5gt22mvg2qvdh0p9nkcxm3jqct5e2gesds2lnw",
        lpToken: TOKENS_MAP["ALP-9471de"],
        tokens: [TOKENS_MAP["ASH-4ce444"], TOKENS_MAP["JWLASH-8bfcd2"]],
        type: EPoolType.PlainPool,
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqxdktu7qkd2ers90vtd9k6xlyysvvmuwh2gessch83r",
        lpToken: TOKENS_MAP["ALP-f881e3"],
        tokens: [TOKENS_MAP["WEGLD-d7c6bb"], TOKENS_MAP["JWLEGLD-761a4f"]],
        type: EPoolType.PlainPool,
    },
];
export default POOLS_BETA;
