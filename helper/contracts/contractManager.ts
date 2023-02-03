import FarmBribeContract from "./farmBribeContract";
import FarmContract from "./farmContract";
import FarmControllerContract from "./farmControllerContract";
import FeeDistributorContract from "./feeDistributorContract";
import PoolContract from "./pool";
import VotingEscrowContract from "./votingEscrowContract";

const poolContracts: Record<string, PoolContract> = {};
const farmContracts: Record<string, FarmContract> = {};
const veContracts: Record<string, VotingEscrowContract> = {};
const feeDistributorContracts: Record<string, FeeDistributorContract> = {};
const farmControllerContracts: Record<string, FarmControllerContract> = {};
const farmBribeContracts: Record<string, FarmBribeContract> = {};
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
const getFarmControllerContract = (address: string) => {
    return (
        farmControllerContracts[address] ??
        (farmControllerContracts[address] = new FarmControllerContract(address))
    );
};
const getFarmBribeContract = (address: string) => {
    return (
        farmBribeContracts[address] ??
        (farmBribeContracts[address] = new FarmBribeContract(address))
    );
};

export const ContractManager = {
    getPoolContract,
    getFarmContract,
    getVotingEscrowContract,
    getFeeDistributorContract,
    getFarmControllerContract,
    getFarmBribeContract,
};
