import FarmContract from "./farmContract";
import FeeDistributorContract from "./feeDistributorContract";
import LKASHContract from "./lkAsh";
import PoolContract from "./pool";
import RewardDistributorContract from "./rewardDistributor";
import VotingEscrowContract from "./votingEscrowContract";

const poolContracts: Record<string, PoolContract> = {};
const farmContracts: Record<string, FarmContract> = {};
const veContracts: Record<string, VotingEscrowContract> = {};
const feeDistributorContracts: Record<string, FeeDistributorContract> = {};
const rewardDistributorContracts: Record<string, RewardDistributorContract> = {};
const lkASHContracts: Record<string, LKASHContract> = {};
const getPoolContract = (address: string) => {
    return (
        poolContracts[address] ??
        (poolContracts[address] = new PoolContract(address))
    );
};

const getFarmContract = (address: string) => {
    return (
        farmContracts[address] ??
        (farmContracts[address] = new FarmContract(address))
    );
};

const getVotingEscrowContract = (address: string) => {
    return (
        veContracts[address] ??
        (veContracts[address] = new VotingEscrowContract(address))
    );
};
const getFeeDistributorContract = (address: string) => {
    return (
        feeDistributorContracts[address] ??
        (feeDistributorContracts[address] = new FeeDistributorContract(address))
    );
};
const getRewardDistributorContract = (address: string) => {
    return (
        rewardDistributorContracts[address] ??
        (rewardDistributorContracts[address] = new RewardDistributorContract(address))
    );
};
const getLKASHContract = (address: string) => {
    return (
        lkASHContracts[address] ??
        (lkASHContracts[address] = new LKASHContract(address))
    );
};

export const ContractManager = {
    getPoolContract,
    getFarmContract,
    getVotingEscrowContract,
    getFeeDistributorContract,
    getRewardDistributorContract,
    getLKASHContract,
};
