export type TxStatsRecord = {
    transaction_hash: string;
    name: "swap" | "add_liquidity" | "remove_liquidity";
    /** aka account/wallet */
    caller: string;
    total_value: number;
    // add/remove liquidity data
    first_token_id: string;
    /** in wei format */
    first_token_amount: string;
    second_token_id: string;
    /** in wei format */
    second_token_amount: string;
    // swap data
    token_in: string;
    token_out: string;
    token_amount_in: string;
    token_amount_out: string;

    timestamp: number;
    
}