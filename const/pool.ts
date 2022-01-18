import IPool from "interface/pool";
import IconBTC from "assets/images/btc-icon.png";
import IconWBTC from "assets/images/wbtc-icon.png";
import IconUSDC from "assets/images/usdc-icon.png";
import IconWUSDC from "assets/images/wusdc-icon.png";
import IconUSDT from "assets/images/usdt-icon.png";

const pools: IPool[] = [
    {
        address:
            "erd1qqqqqqqqqqqqqpgqe7dz06rpw9gqsehj98z8jg4nfrr8d797j9ts2sw3xu",
        lpToken: {
            id: "LPT-be757f",
            icon: "#fff",
            name: "LPT-be757f",
            decimals: 18
        },
        tokens: [
            {
                id: "USDC-9b5c1e",
                icon: IconUSDC,
                name: "USDC",
                decimals: 6,
                coingeckoId: "usd-coin"
            },
            {
                id: "USDT-991037",
                icon: IconUSDT,
                name: "USDT",
                decimals: 6,
                coingeckoId: "tether"
            }
        ]
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgq367a0agl7dyz24ncxapfjuzjt37nxn5ej9tshzfu0q",
        lpToken: {
            id: "LPT-499a71",
            icon: "#fff",
            name: "LPT-499a71",
            decimals: 18
        },
        tokens: [
            {
                id: "USDC-9b5c1e",
                icon: IconUSDC,
                name: "USDC",
                decimals: 6,
                coingeckoId: "usd-coin"
            },
            {
                id: "WUSDC-7dc0a2",
                icon: IconWUSDC,
                name: "wUSDC",
                decimals: 6,
                coingeckoId: "usd-coin"
            }
        ]
    },
    {
        address:
            "erd1qqqqqqqqqqqqqpgqd6t8hv4pxum3vx54u9x55jpxanxh7krlj9tsyx8nx7",
        lpToken: {
            id: "LPT-8e866f",
            icon: "#fff",
            name: "LPT-8e866f",
            decimals: 18
        },
        tokens: [
            {
                id: "BTC-599587",
                icon: IconBTC,
                name: "BTC",
                decimals: 6,
                coingeckoId: "bitcoin"
            },
            {
                id: "WBTC-901728",
                icon: IconWBTC,
                name: "wBTC",
                decimals: 6,
                coingeckoId: "wrapped-bitcoin",
            }
        ]
    }
];

export default pools;
