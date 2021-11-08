import IPool from "interface/pool";

const pools: IPool[] = [
    {
        id: "1",
        tokens: [
            {
                id: "1",
                icon: "#FF005C",
                name: "USDT",
            },
            {
                id: "2",
                icon: "#FFC10D",
                name: "USDC",
            },
        ]
    },
    {
        id: "2",
        tokens: [
            {
                id: "1",
                icon: "#FF005C",
                name: "USDT",
            },
            {
                id: "3",
                icon: "#54C8EA",
                name: "DAI",
            },
        ]
    },
    {
        id: "3",
        tokens: [
            {
                id: "2",
                icon: "#FFC10D",
                name: "USDC",
            },
            {
                id: "3",
                icon: "#54C8EA",
                name: "DAI",
            },
        ]
    },
    {
        id: "4",
        tokens: [
            {
                id: "4",
                icon: "#FFC10D",
                name: "wNEAR",
            },
            {
                id: "5",
                icon: "#54C8EA",
                name: "cNEAR",
            },
        ]
    },
    {
        id: "5",
        tokens: [
            {
                id: "6",
                icon: "#FFC10D",
                name: "cETH",
            },
            {
                id: "7",
                icon: "#54C8EA",
                name: "nETH",
            },
        ]
    },
    {
        id: "6",
        tokens: [
            {
                id: "8",
                icon: "#FFC10D",
                name: "cEGLD",
            },
            {
                id: "9",
                icon: "#54C8EA",
                name: "wEGLD",
            },
        ]
    }
]

export default pools