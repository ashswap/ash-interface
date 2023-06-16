import { fetcher } from "helper/common";
import useSWR, { SWRConfiguration } from "swr"
const COINGECKO_API = "https://api.coingecko.com";
const useCoingeckoPrice = (ids: string[], vsCurrencies: string[] = ['usd'], config: SWRConfiguration = {}) => {
    const price = useSWR<Record<string, {usd: number}>>(ids.length > 0 ? `${COINGECKO_API}/api/v3/simple/price?ids=${ids}&vs_currencies=${vsCurrencies}` : null, fetcher, {...config, fallbackData: {}});
    return price;
}

export default useCoingeckoPrice;