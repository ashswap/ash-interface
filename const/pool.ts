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
    }
]

export default pools