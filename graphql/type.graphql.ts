
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
export class Blockchain {
    __typename?: 'Blockchain';
    blockShards?: Nullable<BlockShard[]>;
}

export class BlockShard {
    __typename?: 'BlockShard';
    hash: string;
    epoch: string;
    nonce: string;
    prevHash: string;
    proposer: string;
    pubKeyBitmap: string;
    round: number;
    shard: string;
    size: number;
    sizeTxs: number;
    stateRootHash: string;
    timestamp: number;
    txCount: number;
    gasConsumed: number;
    gasRefunded: number;
    gasPenalized: number;
    maxGasLimit: string;
}

export abstract class IQuery {
    __typename?: 'IQuery';

    abstract blockchain(): Blockchain | Promise<Blockchain>;

    abstract leaderboard(): Nullable<Nullable<LeaderBoard>[]> | Promise<Nullable<Nullable<LeaderBoard>[]>>;

    abstract cheating(): Nullable<Nullable<Cheating>[]> | Promise<Nullable<Nullable<Cheating>[]>>;

    abstract boyStatistic(address?: Nullable<string>): Nullable<BoyStatistic> | Promise<Nullable<BoyStatistic>>;

    abstract farmBribe(address?: Nullable<string>): FarmBribe | Promise<FarmBribe>;

    abstract farmController(address?: Nullable<string>): FarmController | Promise<FarmController>;

    abstract farms(address: string): Nullable<Farm[]> | Promise<Nullable<Farm[]>>;

    abstract feeDistributor(address: string): FeeDistributor | Promise<FeeDistributor>;

    abstract governance(): Governance | Promise<Governance>;

    abstract liquidity(): Nullable<Nullable<number[]>[]> | Promise<Nullable<Nullable<number[]>[]>>;

    abstract pools(pool_address?: Nullable<string>): Nullable<Nullable<Pool>[]> | Promise<Nullable<Nullable<Pool>[]>>;

    abstract liquidityDistribution(pool_addresses?: Nullable<string>): Nullable<Nullable<LiquidityDistribution>[]> | Promise<Nullable<Nullable<LiquidityDistribution>[]>>;

    abstract poolTransaction(pool_address?: Nullable<string>, limit?: Nullable<number>, offset?: Nullable<number>): Nullable<Nullable<PoolTransaction>[]> | Promise<Nullable<Nullable<PoolTransaction>[]>>;

    abstract rewarder(): Rewarder | Promise<Rewarder>;

    abstract ashSupply(): string | Promise<string>;

    abstract tokens(token_ids?: Nullable<string>): Nullable<Token[]> | Promise<Nullable<Token[]>>;

    abstract tokenTransactions(token_id?: Nullable<string>, limit?: Nullable<number>, offset?: Nullable<number>): Nullable<Nullable<TokenTransacion>[]> | Promise<Nullable<Nullable<TokenTransacion>[]>>;

    abstract volume(): Nullable<Nullable<number[]>[]> | Promise<Nullable<Nullable<number[]>[]>>;

    abstract votingEscrows(address: string): Nullable<VotingEscrow[]> | Promise<Nullable<VotingEscrow[]>>;
}

export class LeaderBoard {
    __typename?: 'LeaderBoard';
    ash_farming_reward_amount?: Nullable<Nullable<number>[]>;
    ash_farming_reward_in_usd?: Nullable<Nullable<number>[]>;
    cheating_level?: Nullable<number>;
    gov_claimable_token_amount?: Nullable<number>;
    gov_claimable_token_in_usd?: Nullable<number>;
    gov_staked_amount?: Nullable<number>;
    gov_staked_in_usd?: Nullable<number>;
    lp_token_amount?: Nullable<Nullable<number>[]>;
    lp_token_in_usd?: Nullable<Nullable<number>[]>;
    lp_token_staked_amount?: Nullable<Nullable<number>[]>;
    lp_token_staked_in_usd?: Nullable<Nullable<number>[]>;
    record_id?: Nullable<number>;
    timestamp?: Nullable<number>;
    token_amount?: Nullable<Nullable<number>[]>;
    token_in_usd?: Nullable<Nullable<number>[]>;
    total_value_in_usd?: Nullable<number>;
    wallet_address?: Nullable<string>;
}

export class Cheating {
    __typename?: 'Cheating';
    cheating_level?: Nullable<number>;
    evidence?: Nullable<string>;
    wallet_address?: Nullable<string>;
}

export class BoyStatistic {
    __typename?: 'BoyStatistic';
    cheating_level?: Nullable<number>;
    claim_value?: Nullable<number>;
    rank?: Nullable<number>;
    wallet?: Nullable<Wallet>;
}

export class Wallet {
    __typename?: 'Wallet';
    ash_farming_reward_amount?: Nullable<Nullable<number>[]>;
    ash_farming_reward_in_usd?: Nullable<Nullable<number>[]>;
    gov_claimable_token_amount?: Nullable<number>;
    gov_claimable_token_in_usd?: Nullable<number>;
    gov_staked_amount?: Nullable<number>;
    gov_staked_in_usd?: Nullable<number>;
    lp_token_amount?: Nullable<Nullable<number>[]>;
    lp_token_in_usd?: Nullable<Nullable<number>[]>;
    lp_token_staked_amount?: Nullable<Nullable<number>[]>;
    lp_token_staked_in_usd?: Nullable<Nullable<number>[]>;
    timestamp?: Nullable<number>;
    token_amount?: Nullable<Nullable<number>[]>;
    token_in_usd?: Nullable<Nullable<number>[]>;
    total_value_in_usd?: Nullable<number>;
    wallet_address?: Nullable<string>;
}

export class FarmBribe {
    __typename?: 'FarmBribe';
    address: string;
    whitelistTokens: Token[];
    farms: FBFarm[];
    account?: Nullable<FBAccount>;
}

export class FBFarm {
    __typename?: 'FBFarm';
    address: string;
    rewards: FBReward[];
}

export class FBReward {
    __typename?: 'FBReward';
    tokenId: string;
    rewardPerVote: string;
    activePeriod: number;
    reserve: string;
    claimed: string;
    total: string;
}

export class FBAccount {
    __typename?: 'FBAccount';
    farms: FBAccountFarm[];
}

export class FBAccountFarm {
    __typename?: 'FBAccountFarm';
    address: string;
    rewards: FBAccountReward[];
}

export class FBAccountReward {
    __typename?: 'FBAccountReward';
    tokenId: string;
    lastUserClaim: number;
    claimable: string;
}

export class FarmController {
    __typename?: 'FarmController';
    address: string;
    timeTotal: number;
    totalWeight: string;
    nextTotalWeight: string;
    farmTypes?: Nullable<FarmType[]>;
    farms?: Nullable<FarmInController[]>;
    account?: Nullable<FcAccount>;
}

export class FarmType {
    __typename?: 'FarmType';
    farmType: number;
    name: string;
    weight: string;
    nextWeight: string;
}

export class FarmInController {
    __typename?: 'FarmInController';
    address: string;
    relativeWeight: string;
    nextRelativeWeight: string;
    farmType: number;
    votedPoint: VotedPoint;
    nextVotedPoint: VotedPoint;
}

export class FarmInControllerAccount {
    __typename?: 'FarmInControllerAccount';
    address: string;
    voteUserSlope?: Nullable<VotedSlope>;
    lastUserVote: number;
}

export class VotedSlope {
    __typename?: 'VotedSlope';
    slope: string;
    power: string;
    end: number;
}

export class VotedPoint {
    __typename?: 'VotedPoint';
    bias: string;
    slope: string;
}

export class FcAccount {
    __typename?: 'FcAccount';
    voteUserPower: string;
    farms?: Nullable<FarmInControllerAccount[]>;
}

export class Farm {
    __typename?: 'Farm';
    address: string;
    farmToken: Token;
    rewardToken: Token;
    farmingToken: Token;
    farmTokenSupply?: Nullable<string>;
    state?: Nullable<boolean>;
    rewardPerSec?: Nullable<string>;
    rewardPerShare?: Nullable<string>;
    lastRewardBlockTs?: Nullable<number>;
    divisionSafetyConstant?: Nullable<string>;
    farmingTokenBalance?: Nullable<string>;
    produceRewardEnabled?: Nullable<boolean>;
    shard?: Nullable<string>;
    account?: Nullable<FarmAccount>;
}

export class FarmAccount {
    __typename?: 'FarmAccount';
    slopeBoosted?: Nullable<string>;
}

export class FeeDistributor {
    __typename?: 'FeeDistributor';
    address: string;
    rewardToken: Token;
    account?: Nullable<FdAccount>;
}

export class FdAccount {
    __typename?: 'FdAccount';
    reward?: Nullable<string>;
}

export class Governance {
    __typename?: 'Governance';
    summaries?: Nullable<Nullable<Summary>[]>;
    adminFee?: Nullable<number>;
    votingPower?: Nullable<Nullable<Nullable<string>[]>[]>;
}

export class Summary {
    __typename?: 'Summary';
    from_timestamp?: Nullable<string>;
    to_timestamp?: Nullable<string>;
    total_admin_fee_in_usd?: Nullable<number>;
}

export class Pool {
    __typename?: 'Pool';
    address: string;
    lpToken: Token;
    tokens: Token[];
    reserves: string[];
    totalSupply?: Nullable<string>;
    swapFeePercent?: Nullable<string>;
    adminFeePercent?: Nullable<string>;
    ampFactor?: Nullable<string>;
    state?: Nullable<boolean>;
    statistic?: Nullable<PoolStatistic>;
    graphStatistic?: Nullable<Nullable<Nullable<number>[]>[]>;
    apr?: Nullable<PoolApr>;
}

export class PoolTransaction {
    __typename?: 'PoolTransaction';
    action?: Nullable<string>;
    admin_fee_1?: Nullable<string>;
    admin_fee_1_usd?: Nullable<number>;
    admin_fee_2?: Nullable<string>;
    admin_fee_2_usd?: Nullable<number>;
    admin_fee_3?: Nullable<string>;
    admin_fee_3_usd?: Nullable<number>;
    amount_1?: Nullable<string>;
    amount_1_usd?: Nullable<number>;
    amount_2?: Nullable<string>;
    amount_2_usd?: Nullable<number>;
    amount_3?: Nullable<string>;
    amount_3_usd?: Nullable<number>;
    caller?: Nullable<string>;
    lp_token_amount?: Nullable<string>;
    lp_token_supply?: Nullable<string>;
    receiver?: Nullable<string>;
    reserve_1?: Nullable<string>;
    reserve_2?: Nullable<string>;
    reserve_3?: Nullable<string>;
    timestamp?: Nullable<number>;
    token_id_1?: Nullable<string>;
    token_id_2?: Nullable<string>;
    token_id_3?: Nullable<string>;
    total_fee_1?: Nullable<string>;
    total_fee_1_usd?: Nullable<number>;
    total_fee_2?: Nullable<string>;
    total_fee_2_usd?: Nullable<number>;
    total_fee_3?: Nullable<string>;
    total_fee_3_usd?: Nullable<number>;
    transaction_hash?: Nullable<string>;
}

export class PoolStatistic {
    __typename?: 'PoolStatistic';
    token_2_admin_fee_usd?: Nullable<number>;
    timestamp?: Nullable<number>;
    token_3_admin_fee_usd?: Nullable<number>;
    volume_usd?: Nullable<number>;
    token_2_amount?: Nullable<number>;
    tvl?: Nullable<number>;
    token_3_total_fee_usd?: Nullable<number>;
    address?: Nullable<string>;
    token_3_amount_usd?: Nullable<number>;
    token_1_admin_fee_usd?: Nullable<number>;
    token_1_amount_usd?: Nullable<number>;
    token_2_total_fee_usd?: Nullable<number>;
    unique_traders?: Nullable<number>;
    token_1_total_fee_usd?: Nullable<number>;
    token_3_amount?: Nullable<number>;
    apr?: Nullable<number>;
    transaction_count?: Nullable<number>;
    token_1_amount?: Nullable<number>;
    token_2_amount_usd?: Nullable<number>;
}

export class LiquidityDistribution {
    __typename?: 'LiquidityDistribution';
    liquidity?: Nullable<number>;
    token?: Nullable<string>;
}

export class PoolApr {
    __typename?: 'PoolApr';
    address?: Nullable<string>;
    apr?: Nullable<Nullable<Nullable<number>[]>[]>;
}

export class Rewarder {
    __typename?: 'Rewarder';
    address: string;
    rewardPerSec: string;
    lastRewardPerSecTime: number;
    futureRewardPerSec: number;
    futureRewardPerSecTime: number;
}

export class Token {
    __typename?: 'Token';
    id?: Nullable<string>;
    price?: Nullable<number>;
    statistic?: Nullable<TokenStatistic>;
    graphStatistic?: Nullable<Nullable<Nullable<number>[]>[]>;
    tokenFee?: Nullable<TokenFee>;
    tokenPool?: Nullable<Nullable<TokenPool>[]>;
}

export class TokenStatistic {
    __typename?: 'TokenStatistic';
    change_percentage_day: number;
    change_percentage_hour: number;
    change_percentage_week: number;
    liquidity: number;
    price: number;
    transaction_count: number;
    volume: number;
}

export class TokenFee {
    __typename?: 'TokenFee';
    fee?: Nullable<Nullable<Nullable<number>[]>[]>;
    token?: Nullable<string>;
}

export class TokenTransacion {
    __typename?: 'TokenTransacion';
    action?: Nullable<string>;
    admin_fee_1?: Nullable<string>;
    admin_fee_1_usd?: Nullable<number>;
    admin_fee_2?: Nullable<string>;
    admin_fee_2_usd?: Nullable<number>;
    admin_fee_3?: Nullable<string>;
    admin_fee_3_usd?: Nullable<number>;
    amount_1?: Nullable<string>;
    amount_1_usd?: Nullable<number>;
    amount_2?: Nullable<string>;
    amount_2_usd?: Nullable<number>;
    amount_3?: Nullable<string>;
    amount_3_usd?: Nullable<number>;
    caller?: Nullable<string>;
    lp_token_amount?: Nullable<string>;
    lp_token_supply?: Nullable<string>;
    receiver?: Nullable<string>;
    reserve_1?: Nullable<string>;
    reserve_2?: Nullable<string>;
    reserve_3?: Nullable<string>;
    timestamp?: Nullable<number>;
    token_id_1?: Nullable<string>;
    token_id_2?: Nullable<string>;
    token_id_3?: Nullable<string>;
    total_fee_1?: Nullable<string>;
    total_fee_1_usd?: Nullable<number>;
    total_fee_2?: Nullable<string>;
    total_fee_2_usd?: Nullable<number>;
    total_fee_3?: Nullable<string>;
    total_fee_3_usd?: Nullable<number>;
    transaction_hash?: Nullable<string>;
}

export class TokenPool {
    __typename?: 'TokenPool';
    address?: Nullable<string>;
    apr?: Nullable<number>;
    timestamp?: Nullable<string>;
    token_1_admin_fee_usd?: Nullable<number>;
    token_1_amount?: Nullable<string>;
    token_1_amount_usd?: Nullable<number>;
    token_1_total_fee_usd?: Nullable<number>;
    token_2_admin_fee_usd?: Nullable<number>;
    token_2_amount?: Nullable<string>;
    token_2_amount_usd?: Nullable<number>;
    token_2_total_fee_usd?: Nullable<number>;
    token_3_admin_fee_usd?: Nullable<string>;
    token_3_amount?: Nullable<string>;
    token_3_amount_usd?: Nullable<number>;
    token_3_total_fee_usd?: Nullable<number>;
    transaction_count?: Nullable<number>;
    tvl?: Nullable<number>;
    unique_traders?: Nullable<string>;
    volume_usd?: Nullable<number>;
}

export class VotingEscrow {
    __typename?: 'VotingEscrow';
    address: string;
    lockedToken: Token;
    totalLock?: Nullable<string>;
    veSupply?: Nullable<string>;
    account?: Nullable<VeAccount>;
}

export class Locked {
    __typename?: 'Locked';
    amount?: Nullable<string>;
    end?: Nullable<string>;
}

export class VeAccount {
    __typename?: 'VeAccount';
    locked?: Nullable<Locked>;
}

type Nullable<T> = T | null;
