import BigNumber from "bignumber.js";
import { WEEK } from "const/ve";
import { DAOProposal } from "graphql/type.graphql";
import { DAOStatus } from "interface/dao";
import moment from "moment";
import { useMemo } from "react";

const useDAOProposalComputedState = (proposal: DAOProposal) => {
    const status: DAOStatus = useMemo(
        () => (proposal.state as DAOStatus) || "pending",
        [proposal.state]
    );
    const minSupportPct = useMemo(
        () =>
            new BigNumber(proposal.config.min_support_pct)
                .multipliedBy(100)
                .div(1e18)
                .toNumber(),
        [proposal.config.min_support_pct]
    );
    const minQuorumPct = useMemo(
        () =>
            new BigNumber(proposal.config.min_quorum_pct)
                .multipliedBy(100)
                .div(1e18)
                .toNumber(),
        [proposal.config.min_quorum_pct]
    );
    const totalVotedPower = useMemo(() => {
        return new BigNumber(proposal.yes_vote).plus(proposal.no_vote).div(1e18).toNumber();
    }, [proposal.no_vote, proposal.yes_vote]);
    const supportPct = useMemo(() => {
        const sum = new BigNumber(proposal.yes_vote).plus(proposal.no_vote);
        if (sum.eq(0)) return 0;
        return new BigNumber(proposal.yes_vote)
            .multipliedBy(100)
            .div(sum)
            .toNumber();
    }, [proposal.no_vote, proposal.yes_vote]);
    const quorumPct = useMemo(() => {
        return new BigNumber(proposal.yes_vote)
            .plus(new BigNumber(proposal.no_vote))
            .multipliedBy(100)
            .div(proposal.total_supply)
            .toNumber();
    }, [proposal.no_vote, proposal.total_supply, proposal.yes_vote]);
    const startVoteTS = useMemo(() => {
        return Math.floor(proposal.created_at / WEEK) * WEEK + WEEK;
    }, [proposal.created_at]);
    const endVoteTS = useMemo(() => {
        return startVoteTS + proposal.config.voting_time_limit;
    }, [startVoteTS, proposal.config.voting_time_limit]);
    const canExecuteTS = useMemo(() => {
        return endVoteTS + proposal.config.queue_time_limit;
    }, [endVoteTS, proposal.config.queue_time_limit]);
    const expiredTS = useMemo(() => {
        return canExecuteTS + proposal.config.execute_time_limit;
    }, [canExecuteTS, proposal.config.execute_time_limit]);
    const yesVote = useMemo(
        () => new BigNumber(proposal.yes_vote).div(1e18).toNumber(),
        [proposal.yes_vote]
    );
    const noVote = useMemo(
        () => new BigNumber(proposal.no_vote).div(1e18).toNumber(),
        [proposal.no_vote]
    );
    const canExecute = useMemo(() => {
        return status === "approved" && canExecuteTS < moment().unix();
    }, [status, canExecuteTS]);

    return {
        minQuorumPct,
        minSupportPct,
        supportPct,
        quorumPct,
        startVoteTS,
        endVoteTS,
        status,
        yesVote,
        noVote,
        totalVotedPower,
        canExecuteTS,
        canExecute,
        expiredTS,
    };
};

export default useDAOProposalComputedState;
