
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

    abstract farms(address: string): Nullable<Farm[]> | Promise<Nullable<Farm[]>>;

    abstract feeDistributor(address: string): FeeDistributor | Promise<FeeDistributor>;

    abstract pools(): Nullable<Pool[]> | Promise<Nullable<Pool[]>>;

    abstract ashSupply(): string | Promise<string>;

    abstract tokens(): Nullable<Token[]> | Promise<Nullable<Token[]>>;

    abstract votingEscrows(address: string): Nullable<VotingEscrow[]> | Promise<Nullable<VotingEscrow[]>>;
}

export class Farm {
    __typename?: 'Farm';
    address: string;
    farmToken: Token;
    rewardToken: Token;
    farmingToken: Token;
    farmTokenSupply?: Nullable<string>;
    state?: Nullable<boolean>;
    perBlockReward?: Nullable<string>;
    rewardPerShare?: Nullable<string>;
    lastRewardBlockNone?: Nullable<string>;
    divisionSafetyConstant?: Nullable<string>;
    farmingTokenBalance?: Nullable<string>;
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
}

export class Token {
    __typename?: 'Token';
    id: string;
    price: number;
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
