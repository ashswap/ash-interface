import IPool from "interface/pool";

const pools: IPool[] = [
    {
        address:
            "erd1qqqqqqqqqqqqqpgqwwap22mm7jyx5hjd7taa3yeeg3qpx9cvj9tsla8rfy",
        lpToken: {
            id: "LPT-c7b5cd",
            icon: "#fff",
            name: "LPT-c7b5cd",
            decimals: 18
        },
        tokens: [
            {
                id: "USDT-90d1e5",
                icon: "#FF005C",
                name: "USDT",
                decimals: 6
            },
            {
                id: "USDC-af9b3b",
                icon: "#FFC10D",
                name: "USDC",
                decimals: 6
            }
        ]
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqtgjy2ag9h8gdgu8lx9840ktdjq0mlls4j9ts8phm7q",
        lpToken: {
            id: "LPT-653fc9",
            icon: "#fff",
            name: "LPT-653fc9",
            decimals: 18
        },
        tokens: [
            {
                id: "USDC-af9b3b",
                icon: "#FFC10D",
                name: "USDC",
                decimals: 6
            },
            {
                id: "WUSDC-d38f26",
                icon: "#54C8EA",
                name: "wUSDC",
                decimals: 6
            }
        ]
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqj4ejy959tw2yw3aq07x5j3lrv3mqxtysj9tsysu5s6",
        lpToken: {
            id: "LPT-7998fb",
            icon: "#fff",
            name: "LPT-7998fb",
            decimals: 18
        },
        tokens: [
            {
                id: "BTC-c2da5f",
                icon: "#FFC10D",
                name: "BTC",
                decimals: 6
            },
            {
                id: "WBTC-e7ca82",
                icon: "#54C8EA",
                name: "wBTC",
                decimals: 6
            }
        ]
    }
];

export default pools;
