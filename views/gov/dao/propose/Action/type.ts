import { Interaction } from "@multiversx/sdk-core/out";
import React from "react";

export type WithDynamicRef<U = unknown, T = {}> = T & {dynamicRef: React.Ref<U>}
export type DAOFormRefMethods = {
    generateInteractions: () => Interaction[];
}
export type DAOMeta = {
    title: string;
    description: string;
    discussionLink: string;
}
interface PoolParams {
    lp_token_name: string;
    lp_token_ticker: string;
    pool_type?: number;
    tokens: Array<{token: string, rate: string}>;
}
export interface PoolV1Params extends PoolParams {
    initial_amp_factor: number;
    swap_fee_percent: number;
    admin_fee_percent: number;
    protocols?: Array<{
        token: string;
        underlying: string;
        address: string;
        function: string;
        arguments: string[];
    }>
}
export interface PoolV2Params extends PoolParams {
    a: string;
    gamma: string;
    mid_fee: string;
    out_fee: string;
    allowed_extra_profit: string;
    fee_gamma: string;
    adjustment_step: string;
    admin_fee: string;
    ma_half_time: number;
    initial_price: string;
}

export interface FarmParams {
    token_name: string;
    token_ticker: string;
    farming_token_id: string;
    division_safety_constant: string;
}