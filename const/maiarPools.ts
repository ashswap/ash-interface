import IPool from "interface/pool";
import { CHAIN_ID } from "./dappConfig";
import { ENVIRONMENT } from "./env";
import { TOKENS_MAP } from "./tokens";
type MaiarPoolConfig = {
    alpha: IPool[];
    beta: IPool[];
};
const devnet: MaiarPoolConfig = {
    alpha: [
        // {
        //     address:
        //         "erd1qqqqqqqqqqqqqpgqd69cn4nfel93s09jdxxwekafrv528ztzrmcqntvk0z",
        //     lpToken: {
        //         identifier: "LPT-12718c",
        //         symbol: "LPT-12718c",
        //         decimals: 18,
        //         chainId: CHAIN_ID.DEVNET,
        //         name: "Maiar LP",
        //     },
        //     tokens: [TOKENS_MAP["BUSD-104d95"], TOKENS_MAP["RENBTC-61ff58"]],
        //     isMaiarPool: true,
        // },
        // {
        //     address:
        //         "erd1qqqqqqqqqqqqqpgqdsp4a5pxy43452e6uaed4jr9m9xqhh0hrmcqw685su",
        //     lpToken: {
        //         identifier: "LPT-c63e7e",
        //         symbol: "LPT-c63e7e",
        //         decimals: 18,
        //         chainId: CHAIN_ID.DEVNET,
        //         name: "Maiar LP",
        //     },
        //     tokens: [TOKENS_MAP["USDC-89351f"], TOKENS_MAP["AEGLD-3e2d88"]],
        //     isMaiarPool: true,
        // },
        // {
        //     address:
        //         "erd1qqqqqqqqqqqqqpgqteeux9x8p565tqltwz0tvfu7ayc3nk2jrmcqpukfw3",
        //     lpToken: {
        //         identifier: "LPT-e72954",
        //         symbol: "LPT-e72954",
        //         decimals: 18,
        //         chainId: CHAIN_ID.DEVNET,
        //         name: "Maiar LP",
        //     },
        //     tokens: [TOKENS_MAP["USDT-2c4852"], TOKENS_MAP["ASH-a0d8e5"]],
        //     isMaiarPool: true,
        // },
    ],
    beta: [
        // {
        //     address:
        //         "erd1qqqqqqqqqqqqqpgqhkh5meslneg4a5jxelc3uxzyx2h8dhgzrmcqglju3p",
        //     lpToken: {
        //         identifier: "LPT-bb63c8",
        //         symbol: "LPT-bb63c8",
        //         decimals: 18,
        //         chainId: CHAIN_ID.DEVNET,
        //         name: "Maiar LP",
        //     },
        //     tokens: [TOKENS_MAP["WUSDC-232e24"], TOKENS_MAP["RENBTC-a74396"]],
        //     isMaiarPool: true,
        // },
        // {
        //     address:
        //         "erd1qqqqqqqqqqqqqpgqyp36j7apxajzclu72d7d4h5ghhth2a9rrmcqgcfrgs",
        //     lpToken: {
        //         identifier: "LPT-8c4633",
        //         symbol: "LPT-8c4633",
        //         decimals: 18,
        //         chainId: CHAIN_ID.DEVNET,
        //         name: "Maiar LP",
        //     },
        //     tokens: [TOKENS_MAP["USDC-6c5d88"], TOKENS_MAP["AEGLD-f09e97"]],
        //     isMaiarPool: true,
        // },
        // {
        //     address:
        //         "erd1qqqqqqqqqqqqqpgq2wupw4rr4lknm6rl75vcjzdxg48c5gvdrmcqgetg9e",
        //     lpToken: {
        //         identifier: "LPT-96c663",
        //         symbol: "LPT-96c663",
        //         decimals: 18,
        //         chainId: CHAIN_ID.DEVNET,
        //         name: "Maiar LP",
        //     },
        //     tokens: [TOKENS_MAP["USDT-324eda"], TOKENS_MAP["ASH-77a5df"]],
        //     isMaiarPool: true,
        // },
    ],
};

const mainnet: IPool[] = [
    // {
    //     address:
    //         "erd1qqqqqqqqqqqqqpgq7zdt5gur5q38ls97r86cllp8nmg3nm8ztk2ql804ph",
    //     lpToken: {
    //         identifier: "MPT-ad2183",
    //         symbol: "MPT-ad2183",
    //         decimals: 18,
    //         chainId: CHAIN_ID.MAINNET,
    //         name: "Maiar LP",
    //     },
    //     tokens: [TOKENS_MAP["BUSD-7f6b0f"], TOKENS_MAP["RENBTC-9179c8"]],
    //     isMaiarPool: true,
    // },
    // {
    //     address:
    //         "erd1qqqqqqqqqqqqqpgqlgjg5s3slkkzs8yf6x3vgsr4w822q22htk2qs4yg0u",
    //     lpToken: {
    //         identifier: "MPT-0bc9a9",
    //         symbol: "MPT-0bc9a9",
    //         decimals: 18,
    //         chainId: CHAIN_ID.MAINNET,
    //         name: "Maiar LP",
    //     },
    //     tokens: [TOKENS_MAP["USDC-bb1e62"], TOKENS_MAP["AEGLD-a1f5d4"]],
    //     isMaiarPool: true,
    // },
    // {
    //     address:
    //         "erd1qqqqqqqqqqqqqpgqxuhlpjvh0nac70t7l5qlq73glfn86ckatk2qyuu2uz",
    //     lpToken: {
    //         identifier: "MPT-a740ab",
    //         symbol: "MPT-a740ab",
    //         decimals: 18,
    //         chainId: CHAIN_ID.MAINNET,
    //         name: "Maiar LP",
    //     },
    //     tokens: [TOKENS_MAP["USDT-821a84"], TOKENS_MAP["ASH-a85626"]],
    //     isMaiarPool: true,
    // },
]

export const MAIAR_POOLS =
    ENVIRONMENT.NETWORK === "devnet" ? devnet[ENVIRONMENT.ENV] : mainnet;
