import { IESDTInfo } from "helper/token/token";

export type TokenStatsRecord = {
    change_percentage_day: number;
    change_percentage_hour: number;
    change_percentage_week: number;
    liquidity: number;
    price: number;
    token_id: string;
    transaction_count: number;
    volume: number;
    // added from client
    token?: IESDTInfo;
};