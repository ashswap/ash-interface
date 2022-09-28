export type PoolStatsRecord = {
    address: string;
    apr: number;
    timestamp: number | null;
    token_1_admin_fee_usd: number | null;
    token_1_amount: number;
    token_1_amount_usd: number;
    token_1_total_fee_usd: number | null;
    token_2_admin_fee_usd: number | null;
    token_2_amount: number;
    token_2_amount_usd: number;
    token_2_total_fee_usd: number | null;
    token_3_admin_fee_usd: number | null;
    token_3_amount: number;
    token_3_amount_usd: number;
    token_3_total_fee_usd: number | null;
    transaction_count: number | null;
    tvl: number;
    unique_traders: number | null;
    volume_usd: number;
}