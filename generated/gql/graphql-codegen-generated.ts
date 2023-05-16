/* tslint:disable */
import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
}

export interface AdditionalReward {
  __typename: 'AdditionalReward';
  periodRewardEnd: Scalars['Int'];
  rewardPerSec: Scalars['String'];
  rewardPerShare: Scalars['String'];
  tokenId: Scalars['String'];
}

export interface BlockShard {
  __typename: 'BlockShard';
  epoch: Scalars['String'];
  gasConsumed: Scalars['Int'];
  gasPenalized: Scalars['Int'];
  gasRefunded: Scalars['Int'];
  hash: Scalars['String'];
  maxGasLimit: Scalars['String'];
  nonce: Scalars['String'];
  prevHash: Scalars['String'];
  proposer: Scalars['String'];
  pubKeyBitmap: Scalars['String'];
  round: Scalars['Int'];
  shard: Scalars['String'];
  size: Scalars['Int'];
  sizeTxs: Scalars['Int'];
  stateRootHash: Scalars['String'];
  timestamp: Scalars['Int'];
  txCount: Scalars['Int'];
}

export interface Blockchain {
  __typename: 'Blockchain';
  blockShards?: Maybe<Array<BlockShard>>;
}

export interface BoyStatistic {
  __typename: 'BoyStatistic';
  cheating_level?: Maybe<Scalars['Int']>;
  claim_value?: Maybe<Scalars['Float']>;
  rank?: Maybe<Scalars['Int']>;
  wallet?: Maybe<Wallet>;
}

export interface Cheating {
  __typename: 'Cheating';
  cheating_level?: Maybe<Scalars['Int']>;
  evidence?: Maybe<Scalars['String']>;
  wallet_address?: Maybe<Scalars['String']>;
}

export interface DaoActionArguments {
  __typename: 'DAOActionArguments';
  argument_length?: Maybe<Scalars['Int']>;
}

export interface DaoBribeReward {
  __typename: 'DAOBribeReward';
  reward_amount: Scalars['String'];
  token_id: Scalars['String'];
}

export interface DaoProposal {
  __typename: 'DAOProposal';
  arguments: Scalars['String'];
  bribes: Array<DaoBribeReward>;
  created_at: Scalars['Int'];
  dest_address: Scalars['String'];
  execute_time_limit: Scalars['Int'];
  executed_at: Scalars['Int'];
  executed_by: Scalars['String'];
  function_name: Scalars['String'];
  ipfs_hash: Scalars['String'];
  min_power_for_propose: Scalars['String'];
  min_quorum_pct: Scalars['String'];
  min_support_pct: Scalars['String'];
  min_time_for_propose: Scalars['Int'];
  no_vote: Scalars['String'];
  proposal_id: Scalars['Int'];
  proposer: Scalars['String'];
  queue_time_limit: Scalars['Int'];
  state: Scalars['String'];
  total_supply: Scalars['String'];
  voting_time_limit: Scalars['Int'];
  yes_vote: Scalars['String'];
}

export interface DaoProposalConfig {
  __typename: 'DAOProposalConfig';
  execute_time_limit: Scalars['Int'];
  min_power_for_propose: Scalars['String'];
  min_quorum_pct: Scalars['String'];
  min_support_pct: Scalars['String'];
  min_time_for_propose: Scalars['Int'];
  queue_time_limit: Scalars['Int'];
  voting_time_limit: Scalars['Int'];
}

export interface DaoProposalDetail {
  __typename: 'DAOProposalDetail';
  proposal?: Maybe<DaoProposal>;
  top_againsters: Array<Array<Scalars['String']>>;
  top_supporters: Array<Array<Scalars['String']>>;
  top_voters: Array<Array<Scalars['String']>>;
}

export interface Defillama {
  __typename: 'Defillama';
  pools?: Maybe<Array<Maybe<DefillamaPool>>>;
  totalValueLockedUSD?: Maybe<Scalars['Float']>;
  totalValueStakedUSD?: Maybe<Scalars['Float']>;
  totalVolumeUSD24h?: Maybe<Scalars['Float']>;
}

export interface DefillamaPool {
  __typename: 'DefillamaPool';
  address?: Maybe<Scalars['String']>;
  apyBase?: Maybe<Scalars['Float']>;
  apyReward?: Maybe<Scalars['Float']>;
  tokens?: Maybe<Array<Maybe<Scalars['String']>>>;
  tvlUsd?: Maybe<Scalars['Float']>;
}

export interface FbAccount {
  __typename: 'FBAccount';
  farms: Array<FbAccountFarm>;
}

export interface FbAccountFarm {
  __typename: 'FBAccountFarm';
  address: Scalars['String'];
  rewards: Array<FbAccountReward>;
}

export interface FbAccountReward {
  __typename: 'FBAccountReward';
  claimable: Scalars['String'];
  lastUserClaim: Scalars['Int'];
  tokenId: Scalars['String'];
}

export interface FbFarm {
  __typename: 'FBFarm';
  address: Scalars['String'];
  rewards: Array<FbReward>;
}

export interface FbReward {
  __typename: 'FBReward';
  activePeriod: Scalars['Int'];
  claimed: Scalars['String'];
  reserve: Scalars['String'];
  rewardPerVote: Scalars['String'];
  tokenId: Scalars['String'];
  total: Scalars['String'];
}

export interface Farm {
  __typename: 'Farm';
  account?: Maybe<FarmAccount>;
  additionalRewards: Array<AdditionalReward>;
  address: Scalars['String'];
  divisionSafetyConstant?: Maybe<Scalars['String']>;
  farmToken: Token;
  farmTokenSupply?: Maybe<Scalars['String']>;
  farmingToken: Token;
  farmingTokenBalance?: Maybe<Scalars['String']>;
  lastRewardBlockTs?: Maybe<Scalars['Int']>;
  produceRewardEnabled?: Maybe<Scalars['Boolean']>;
  rewardPerSec?: Maybe<Scalars['String']>;
  rewardPerShare?: Maybe<Scalars['String']>;
  rewardToken: Token;
  shard?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['Boolean']>;
}

export interface FarmAccount {
  __typename: 'FarmAccount';
  slopeBoosted?: Maybe<Scalars['String']>;
}

export interface FarmBribe {
  __typename: 'FarmBribe';
  account?: Maybe<FbAccount>;
  address: Scalars['String'];
  farms: Array<FbFarm>;
  whitelistTokens: Array<Token>;
}

export interface FarmController {
  __typename: 'FarmController';
  account?: Maybe<FcAccount>;
  address: Scalars['String'];
  farmTypes?: Maybe<Array<FarmType>>;
  farms?: Maybe<Array<FarmInController>>;
  nextTotalWeight: Scalars['String'];
  timeTotal: Scalars['Int'];
  totalWeight: Scalars['String'];
}

export interface FarmInController {
  __typename: 'FarmInController';
  address: Scalars['String'];
  farmType: Scalars['Int'];
  nextRelativeWeight: Scalars['String'];
  nextVotedPoint: VotedPoint;
  relativeWeight: Scalars['String'];
  votedPoint: VotedPoint;
}

export interface FarmInControllerAccount {
  __typename: 'FarmInControllerAccount';
  address: Scalars['String'];
  lastUserVote: Scalars['Int'];
  voteUserSlope?: Maybe<VotedSlope>;
}

export interface FarmType {
  __typename: 'FarmType';
  farmType: Scalars['Int'];
  name: Scalars['String'];
  nextWeight: Scalars['String'];
  weight: Scalars['String'];
}

export interface FcAccount {
  __typename: 'FcAccount';
  farms?: Maybe<Array<FarmInControllerAccount>>;
  voteUserPower: Scalars['String'];
}

export interface FdAccount {
  __typename: 'FdAccount';
  reward?: Maybe<Scalars['String']>;
}

export interface FeeDistributor {
  __typename: 'FeeDistributor';
  account?: Maybe<FdAccount>;
  address: Scalars['String'];
  rewardToken: Token;
}

export interface Governance {
  __typename: 'Governance';
  adminFee?: Maybe<Scalars['Float']>;
  summaries?: Maybe<Array<Maybe<Summary>>>;
  votingPower?: Maybe<Array<Maybe<Array<Maybe<Scalars['String']>>>>>;
}


export interface GovernanceSummariesArgs {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}

export interface LeaderBoard {
  __typename: 'LeaderBoard';
  ash_farming_reward_amount?: Maybe<Array<Maybe<Scalars['Float']>>>;
  ash_farming_reward_in_usd?: Maybe<Array<Maybe<Scalars['Float']>>>;
  cheating_level?: Maybe<Scalars['Int']>;
  gov_claimable_token_amount?: Maybe<Scalars['Float']>;
  gov_claimable_token_in_usd?: Maybe<Scalars['Float']>;
  gov_staked_amount?: Maybe<Scalars['Float']>;
  gov_staked_in_usd?: Maybe<Scalars['Float']>;
  lp_token_amount?: Maybe<Array<Maybe<Scalars['Float']>>>;
  lp_token_in_usd?: Maybe<Array<Maybe<Scalars['Float']>>>;
  lp_token_staked_amount?: Maybe<Array<Maybe<Scalars['Float']>>>;
  lp_token_staked_in_usd?: Maybe<Array<Maybe<Scalars['Float']>>>;
  record_id?: Maybe<Scalars['Int']>;
  timestamp?: Maybe<Scalars['Int']>;
  token_amount?: Maybe<Array<Maybe<Scalars['Float']>>>;
  token_in_usd?: Maybe<Array<Maybe<Scalars['Float']>>>;
  total_value_in_usd?: Maybe<Scalars['Float']>;
  wallet_address?: Maybe<Scalars['String']>;
}

export interface LiquidityDistribution {
  __typename: 'LiquidityDistribution';
  liquidity?: Maybe<Scalars['Float']>;
  token?: Maybe<Scalars['String']>;
}

export interface Locked {
  __typename: 'Locked';
  amount?: Maybe<Scalars['String']>;
  end?: Maybe<Scalars['String']>;
}

export interface PaginationProposals {
  __typename: 'PaginationProposals';
  proposals: Array<DaoProposal>;
  total: Scalars['Int'];
}

export interface Pool {
  __typename: 'Pool';
  address: Scalars['ID'];
  adminFeePercent?: Maybe<Scalars['String']>;
  ampFactor?: Maybe<Scalars['String']>;
  apr?: Maybe<PoolApr>;
  graphStatistic?: Maybe<Array<Maybe<Array<Maybe<Scalars['Float']>>>>>;
  lpToken: Token;
  reserves: Array<Scalars['String']>;
  state?: Maybe<Scalars['Boolean']>;
  statistic?: Maybe<PoolStatistic>;
  swapFeePercent?: Maybe<Scalars['String']>;
  tokens: Array<Token>;
  totalSupply?: Maybe<Scalars['String']>;
  underlyingPrices: Array<Scalars['String']>;
}

export interface PoolApr {
  __typename: 'PoolApr';
  address?: Maybe<Scalars['String']>;
  apr?: Maybe<Array<Maybe<Array<Maybe<Scalars['Float']>>>>>;
}

export interface PoolStatistic {
  __typename: 'PoolStatistic';
  address?: Maybe<Scalars['String']>;
  apr?: Maybe<Scalars['Float']>;
  timestamp?: Maybe<Scalars['Int']>;
  token_1_admin_fee_usd?: Maybe<Scalars['Float']>;
  token_1_amount?: Maybe<Scalars['Float']>;
  token_1_amount_usd?: Maybe<Scalars['Float']>;
  token_1_total_fee_usd?: Maybe<Scalars['Float']>;
  token_2_admin_fee_usd?: Maybe<Scalars['Float']>;
  token_2_amount?: Maybe<Scalars['Float']>;
  token_2_amount_usd?: Maybe<Scalars['Float']>;
  token_2_total_fee_usd?: Maybe<Scalars['Float']>;
  token_3_admin_fee_usd?: Maybe<Scalars['Float']>;
  token_3_amount?: Maybe<Scalars['Float']>;
  token_3_amount_usd?: Maybe<Scalars['Float']>;
  token_3_total_fee_usd?: Maybe<Scalars['Float']>;
  transaction_count?: Maybe<Scalars['Int']>;
  tvl?: Maybe<Scalars['Float']>;
  unique_traders?: Maybe<Scalars['Float']>;
  volume_usd?: Maybe<Scalars['Float']>;
}

export interface PoolTransaction {
  __typename: 'PoolTransaction';
  action?: Maybe<Scalars['String']>;
  admin_fee_1?: Maybe<Scalars['String']>;
  admin_fee_1_usd?: Maybe<Scalars['Float']>;
  admin_fee_2?: Maybe<Scalars['String']>;
  admin_fee_2_usd?: Maybe<Scalars['Float']>;
  admin_fee_3?: Maybe<Scalars['String']>;
  admin_fee_3_usd?: Maybe<Scalars['Float']>;
  amount_1?: Maybe<Scalars['String']>;
  amount_1_usd?: Maybe<Scalars['Float']>;
  amount_2?: Maybe<Scalars['String']>;
  amount_2_usd?: Maybe<Scalars['Float']>;
  amount_3?: Maybe<Scalars['String']>;
  amount_3_usd?: Maybe<Scalars['Float']>;
  caller?: Maybe<Scalars['String']>;
  lp_token_amount?: Maybe<Scalars['String']>;
  lp_token_supply?: Maybe<Scalars['String']>;
  receiver?: Maybe<Scalars['String']>;
  reserve_1?: Maybe<Scalars['String']>;
  reserve_2?: Maybe<Scalars['String']>;
  reserve_3?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['Int']>;
  token_id_1?: Maybe<Scalars['String']>;
  token_id_2?: Maybe<Scalars['String']>;
  token_id_3?: Maybe<Scalars['String']>;
  total_fee_1?: Maybe<Scalars['String']>;
  total_fee_1_usd?: Maybe<Scalars['Float']>;
  total_fee_2?: Maybe<Scalars['String']>;
  total_fee_2_usd?: Maybe<Scalars['Float']>;
  total_fee_3?: Maybe<Scalars['String']>;
  total_fee_3_usd?: Maybe<Scalars['Float']>;
  transaction_hash?: Maybe<Scalars['String']>;
}

export interface PoolV2 {
  __typename: 'PoolV2';
  address: Scalars['String'];
  adjustmentStep: Scalars['String'];
  adminFee: Scalars['String'];
  allowedExtraProfit: Scalars['String'];
  ampFactor: Scalars['String'];
  d: Scalars['String'];
  fee: Scalars['String'];
  feeGamma: Scalars['String'];
  futureAGammaTime: Scalars['Int'];
  gamma: Scalars['String'];
  initialAGammaTime: Scalars['Int'];
  isNotAdjusted: Scalars['Boolean'];
  lastPriceTs: Scalars['Int'];
  lastPrices: Scalars['String'];
  lpPrice: Scalars['String'];
  lpToken: Token;
  maHalfTime: Scalars['Int'];
  midFee: Scalars['String'];
  outFee: Scalars['String'];
  priceOracle: Scalars['String'];
  priceScale: Scalars['String'];
  realReserves: Array<Scalars['String']>;
  reserves: Array<Scalars['String']>;
  state: Scalars['Boolean'];
  tokens: Array<Token>;
  totalSupply: Scalars['String'];
  virtualPrice: Scalars['String'];
  xcpProfit: Scalars['String'];
  xcpProfitA: Scalars['String'];
  xp: Array<Scalars['String']>;
}

export interface Query {
  __typename: 'Query';
  adminFee?: Maybe<Scalars['Float']>;
  ashSupply: Scalars['String'];
  blockchain: Blockchain;
  boyStatistic?: Maybe<BoyStatistic>;
  cheating?: Maybe<Array<Maybe<Cheating>>>;
  closedDAOProposals: PaginationProposals;
  daoWhitelistFunctions: Scalars['String'];
  defillama?: Maybe<Defillama>;
  farmBribe: FarmBribe;
  farmController: FarmController;
  farms?: Maybe<Array<Farm>>;
  feeDistributor: FeeDistributor;
  governance: Governance;
  leaderboard?: Maybe<Array<Maybe<LeaderBoard>>>;
  liquidity?: Maybe<Array<Maybe<Array<Scalars['Float']>>>>;
  liquidityDistribution?: Maybe<Array<Maybe<LiquidityDistribution>>>;
  openedDAOProposals: Array<DaoProposal>;
  poolTransaction?: Maybe<Array<Maybe<PoolTransaction>>>;
  pools?: Maybe<Array<Maybe<Pool>>>;
  poolsV2: Array<PoolV2>;
  proposalConfig?: Maybe<DaoProposalConfig>;
  proposalDetail?: Maybe<DaoProposalDetail>;
  rewarder: Rewarder;
  summaries?: Maybe<Array<Maybe<Summary>>>;
  tokenTransactions?: Maybe<Array<Maybe<TokenTransacion>>>;
  tokens?: Maybe<Array<Token>>;
  volume?: Maybe<Array<Maybe<Array<Scalars['Float']>>>>;
  votingEscrows?: Maybe<Array<VotingEscrow>>;
  votingPower?: Maybe<Array<Maybe<Array<Maybe<Scalars['String']>>>>>;
}


export interface QueryBoyStatisticArgs {
  address?: InputMaybe<Scalars['String']>;
}


export interface QueryClosedDaoProposalsArgs {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  states?: InputMaybe<Array<Scalars['String']>>;
}


export interface QueryFarmBribeArgs {
  address?: InputMaybe<Scalars['String']>;
}


export interface QueryFarmControllerArgs {
  address?: InputMaybe<Scalars['String']>;
}


export interface QueryFarmsArgs {
  address: Scalars['String'];
}


export interface QueryFeeDistributorArgs {
  address: Scalars['String'];
}


export interface QueryLiquidityDistributionArgs {
  pool_addresses?: InputMaybe<Scalars['String']>;
}


export interface QueryPoolTransactionArgs {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  pool_address?: InputMaybe<Scalars['String']>;
}


export interface QueryPoolsArgs {
  pool_address?: InputMaybe<Scalars['String']>;
}


export interface QueryProposalConfigArgs {
  address: Scalars['String'];
  functionName: Scalars['String'];
}


export interface QueryProposalDetailArgs {
  id: Scalars['Int'];
}


export interface QuerySummariesArgs {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}


export interface QueryTokenTransactionsArgs {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  token_id?: InputMaybe<Scalars['String']>;
}


export interface QueryTokensArgs {
  token_ids?: InputMaybe<Scalars['String']>;
}


export interface QueryVotingEscrowsArgs {
  address: Scalars['String'];
}

export interface Rewarder {
  __typename: 'Rewarder';
  address: Scalars['String'];
  futureRewardPerSec: Scalars['Int'];
  futureRewardPerSecTime: Scalars['Int'];
  lastRewardPerSecTime: Scalars['Int'];
  rewardPerSec: Scalars['String'];
}

export interface Summary {
  __typename: 'Summary';
  from_timestamp?: Maybe<Scalars['String']>;
  to_timestamp?: Maybe<Scalars['String']>;
  total_admin_fee_in_usd?: Maybe<Scalars['Float']>;
}

export interface Token {
  __typename: 'Token';
  graphStatistic?: Maybe<Array<Maybe<Array<Maybe<Scalars['Float']>>>>>;
  id?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Float']>;
  statistic?: Maybe<TokenStatistic>;
  tokenFee?: Maybe<TokenFee>;
  tokenPool?: Maybe<Array<Maybe<TokenPool>>>;
}

export interface TokenFee {
  __typename: 'TokenFee';
  fee?: Maybe<Array<Maybe<Array<Maybe<Scalars['Float']>>>>>;
  token?: Maybe<Scalars['String']>;
}

export interface TokenPool {
  __typename: 'TokenPool';
  address?: Maybe<Scalars['String']>;
  apr?: Maybe<Scalars['Float']>;
  timestamp?: Maybe<Scalars['String']>;
  token_1_admin_fee_usd?: Maybe<Scalars['Float']>;
  token_1_amount?: Maybe<Scalars['String']>;
  token_1_amount_usd?: Maybe<Scalars['Float']>;
  token_1_total_fee_usd?: Maybe<Scalars['Float']>;
  token_2_admin_fee_usd?: Maybe<Scalars['Float']>;
  token_2_amount?: Maybe<Scalars['String']>;
  token_2_amount_usd?: Maybe<Scalars['Float']>;
  token_2_total_fee_usd?: Maybe<Scalars['Float']>;
  token_3_admin_fee_usd?: Maybe<Scalars['String']>;
  token_3_amount?: Maybe<Scalars['String']>;
  token_3_amount_usd?: Maybe<Scalars['Float']>;
  token_3_total_fee_usd?: Maybe<Scalars['Float']>;
  transaction_count?: Maybe<Scalars['Int']>;
  tvl?: Maybe<Scalars['Float']>;
  unique_traders?: Maybe<Scalars['String']>;
  volume_usd?: Maybe<Scalars['Float']>;
}

export interface TokenStatistic {
  __typename: 'TokenStatistic';
  change_percentage_day: Scalars['Float'];
  change_percentage_hour: Scalars['Float'];
  change_percentage_week: Scalars['Float'];
  liquidity: Scalars['Float'];
  price: Scalars['Float'];
  transaction_count: Scalars['Float'];
  volume: Scalars['Float'];
}

export interface TokenTransacion {
  __typename: 'TokenTransacion';
  action?: Maybe<Scalars['String']>;
  admin_fee_1?: Maybe<Scalars['String']>;
  admin_fee_1_usd?: Maybe<Scalars['Float']>;
  admin_fee_2?: Maybe<Scalars['String']>;
  admin_fee_2_usd?: Maybe<Scalars['Float']>;
  admin_fee_3?: Maybe<Scalars['String']>;
  admin_fee_3_usd?: Maybe<Scalars['Float']>;
  amount_1?: Maybe<Scalars['String']>;
  amount_1_usd?: Maybe<Scalars['Float']>;
  amount_2?: Maybe<Scalars['String']>;
  amount_2_usd?: Maybe<Scalars['Float']>;
  amount_3?: Maybe<Scalars['String']>;
  amount_3_usd?: Maybe<Scalars['Float']>;
  caller?: Maybe<Scalars['String']>;
  lp_token_amount?: Maybe<Scalars['String']>;
  lp_token_supply?: Maybe<Scalars['String']>;
  receiver?: Maybe<Scalars['String']>;
  reserve_1?: Maybe<Scalars['String']>;
  reserve_2?: Maybe<Scalars['String']>;
  reserve_3?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['Int']>;
  token_id_1?: Maybe<Scalars['String']>;
  token_id_2?: Maybe<Scalars['String']>;
  token_id_3?: Maybe<Scalars['String']>;
  total_fee_1?: Maybe<Scalars['String']>;
  total_fee_1_usd?: Maybe<Scalars['Float']>;
  total_fee_2?: Maybe<Scalars['String']>;
  total_fee_2_usd?: Maybe<Scalars['Float']>;
  total_fee_3?: Maybe<Scalars['String']>;
  total_fee_3_usd?: Maybe<Scalars['Float']>;
  transaction_hash?: Maybe<Scalars['String']>;
}

export interface VeAccount {
  __typename: 'VeAccount';
  locked?: Maybe<Locked>;
}

export interface VotedPoint {
  __typename: 'VotedPoint';
  bias: Scalars['String'];
  slope: Scalars['String'];
}

export interface VotedSlope {
  __typename: 'VotedSlope';
  end: Scalars['Int'];
  power: Scalars['String'];
  slope: Scalars['String'];
}

export interface VotingEscrow {
  __typename: 'VotingEscrow';
  account?: Maybe<VeAccount>;
  address: Scalars['String'];
  lockedToken: Token;
  totalLock?: Maybe<Scalars['String']>;
  veSupply?: Maybe<Scalars['String']>;
}

export interface Wallet {
  __typename: 'Wallet';
  ash_farming_reward_amount?: Maybe<Array<Maybe<Scalars['Float']>>>;
  ash_farming_reward_in_usd?: Maybe<Array<Maybe<Scalars['Float']>>>;
  gov_claimable_token_amount?: Maybe<Scalars['Float']>;
  gov_claimable_token_in_usd?: Maybe<Scalars['Float']>;
  gov_staked_amount?: Maybe<Scalars['Float']>;
  gov_staked_in_usd?: Maybe<Scalars['Float']>;
  lp_token_amount?: Maybe<Array<Maybe<Scalars['Float']>>>;
  lp_token_in_usd?: Maybe<Array<Maybe<Scalars['Float']>>>;
  lp_token_staked_amount?: Maybe<Array<Maybe<Scalars['Float']>>>;
  lp_token_staked_in_usd?: Maybe<Array<Maybe<Scalars['Float']>>>;
  timestamp?: Maybe<Scalars['Int']>;
  token_amount?: Maybe<Array<Maybe<Scalars['Float']>>>;
  token_in_usd?: Maybe<Array<Maybe<Scalars['Float']>>>;
  total_value_in_usd?: Maybe<Scalars['Float']>;
  wallet_address?: Maybe<Scalars['String']>;
}

export type AllTokenPropsFragment = { __typename: 'Token', id?: string | null, price?: number | null };

export type AshBaseStateQueryQueryVariables = Exact<{
  accAddress?: InputMaybe<Scalars['String']>;
}>;


export type AshBaseStateQueryQuery = { __typename: 'Query', farms?: Array<{ __typename: 'Farm', address: string, farmTokenSupply?: string | null, rewardPerSec?: string | null, rewardPerShare?: string | null, state?: boolean | null, lastRewardBlockTs?: number | null, divisionSafetyConstant?: string | null, farmingTokenBalance?: string | null, produceRewardEnabled?: boolean | null, shard?: string | null, farmToken: { __typename: 'Token', id?: string | null, price?: number | null }, rewardToken: { __typename: 'Token', id?: string | null, price?: number | null }, farmingToken: { __typename: 'Token', id?: string | null, price?: number | null }, account?: { __typename: 'FarmAccount', slopeBoosted?: string | null } | null, additionalRewards: Array<{ __typename: 'AdditionalReward', rewardPerSec: string, rewardPerShare: string, periodRewardEnd: number, tokenId: string }> }> | null, pools?: Array<{ __typename: 'Pool', address: string, reserves: Array<string>, underlyingPrices: Array<string>, totalSupply?: string | null, swapFeePercent?: string | null, adminFeePercent?: string | null, ampFactor?: string | null, state?: boolean | null, lpToken: { __typename: 'Token', id?: string | null, price?: number | null }, tokens: Array<{ __typename: 'Token', id?: string | null, price?: number | null }> } | null> | null, poolsV2: Array<{ __typename: 'PoolV2', address: string, totalSupply: string, reserves: Array<string>, priceScale: string, ampFactor: string, gamma: string, xp: Array<string>, futureAGammaTime: number, d: string, midFee: string, outFee: string, feeGamma: string, lpToken: { __typename: 'Token', id?: string | null, price?: number | null } }>, tokens?: Array<{ __typename: 'Token', id?: string | null, price?: number | null }> | null, votingEscrows?: Array<{ __typename: 'VotingEscrow', address: string, totalLock?: string | null, veSupply?: string | null, lockedToken: { __typename: 'Token', id?: string | null, price?: number | null }, account?: { __typename: 'VeAccount', locked?: { __typename: 'Locked', amount?: string | null, end?: string | null } | null } | null }> | null, feeDistributor: { __typename: 'FeeDistributor', address: string, rewardToken: { __typename: 'Token', id?: string | null, price?: number | null }, account?: { __typename: 'FdAccount', reward?: string | null } | null }, blockchain: { __typename: 'Blockchain', blockShards?: Array<{ __typename: 'BlockShard', shard: string, nonce: string }> | null } };

export const AllTokenPropsFragmentDoc = gql`
    fragment allTokenProps on Token {
  id
  price
}
    `;
export const AshBaseStateQueryDocument = gql`
    query ashBaseStateQuery($accAddress: String = "") {
  farms(address: $accAddress) {
    address
    farmToken {
      ...allTokenProps
    }
    rewardToken {
      ...allTokenProps
    }
    farmingToken {
      ...allTokenProps
    }
    farmTokenSupply
    rewardPerSec
    rewardPerShare
    state
    lastRewardBlockTs
    divisionSafetyConstant
    farmingTokenBalance
    produceRewardEnabled
    account {
      slopeBoosted
    }
    shard
    additionalRewards {
      rewardPerSec
      rewardPerShare
      periodRewardEnd
      tokenId
    }
  }
  pools {
    address
    lpToken {
      ...allTokenProps
    }
    tokens {
      ...allTokenProps
    }
    reserves
    underlyingPrices
    totalSupply
    swapFeePercent
    adminFeePercent
    ampFactor
    state
  }
  poolsV2 {
    address
    lpToken {
      ...allTokenProps
    }
    totalSupply
    reserves
    priceScale
    ampFactor
    gamma
    xp
    futureAGammaTime
    d
    midFee
    outFee
    feeGamma
  }
  tokens {
    ...allTokenProps
  }
  votingEscrows(address: $accAddress) {
    address
    lockedToken {
      ...allTokenProps
    }
    totalLock
    veSupply
    account {
      locked {
        amount
        end
      }
    }
  }
  feeDistributor(address: $accAddress) {
    address
    rewardToken {
      ...allTokenProps
    }
    account {
      reward
    }
  }
  blockchain {
    blockShards {
      shard
      nonce
    }
  }
}
    ${AllTokenPropsFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    ashBaseStateQuery(variables?: AshBaseStateQueryQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AshBaseStateQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AshBaseStateQueryQuery>(AshBaseStateQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ashBaseStateQuery', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;