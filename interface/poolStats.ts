export type PoolStatsRecord = {
    /** trading apr base on 24h period*/ 
    apr_day: number;
    /** trading apr base on 30days period*/
    apr_month: number;
    /** trading apr base on 7days period*/
    apr_week: number;
    /** APR base on value of reward token on 24h period - note: -1 ~ infinity */
    emission_apr: number;
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