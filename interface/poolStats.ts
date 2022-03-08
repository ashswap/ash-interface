export type PoolStatsRecord = {
    apr_day: number;
    apr_month: number;
    apr_week: number;
    pool_address: string;
    ratio: number;
    timestamp: number;
    token_1_amount: number;
    token_1_value_locked: number;
    token_2_amount: number;
    token_2_value_locked: number;
    total_value_locked: number;
    usd_volume: number;
    volume: number;
};