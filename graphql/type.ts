import { Blockchain, Farm, FeeDistributor, Pool, Token, VotingEscrow } from "./type.graphql"

export type AshBaseState = {
    farms: Required<Farm>[];
    pools: Required<Pool>[];
    tokens: Required<Token>[];
    votingEscrows: Required<VotingEscrow>[];
    feeDistributor: FeeDistributor | null;
    blockchain: Blockchain;
    ashSupply: string;
}