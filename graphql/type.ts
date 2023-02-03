import { Blockchain, Farm, FarmBribe, FarmController, FeeDistributor, Pool, Rewarder, Token, VotingEscrow } from "./type.graphql"

export type AshBaseState = {
    farms: Required<Farm>[];
    pools: Required<Pool>[];
    tokens: Required<Token>[];
    votingEscrows: Required<VotingEscrow>[];
    feeDistributor: FeeDistributor | null;
    blockchain: Blockchain;
    ashSupply: string;
    farmController?: FarmController;
    farmBribe?: FarmBribe;
    rewarder?: Rewarder;
}

export type GraphOptions = {
    withFC?: boolean;
    withFB?: boolean;
    withFD?: boolean;
    withVE?: boolean;
    withRW?: boolean;
    withPools?: boolean;
    withFarms?: boolean;
    withBlockchain?: boolean;
    withTokens?: boolean;
    withSupply?: boolean;
}