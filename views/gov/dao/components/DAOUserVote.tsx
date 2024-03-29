import {
    default as ImgVeash,
    default as ImgVeASH
} from "assets/images/ve-ash.png";
import { accIsLoggedInState } from "atoms/dappState";
import { govVeASHAmtSelector } from "atoms/govState";
import BigNumber from "bignumber.js";
import Avatar from "components/Avatar";
import Countdown from "components/Coundown";
import GlowingButton from "components/GlowingButton";
import TextAmt from "components/TextAmt";
import { VE_ASH_DECIMALS } from "const/tokens";
import { DAOProposal } from "graphql/type.graphql";
import { useConnectWallet } from "hooks/useConnectWallet";
import useDAOExecute from "hooks/useDAOContract/useDAOExecute";
import useIsAlready from "hooks/useIsAlready";
import moment from "moment";
import dynamic from "next/dynamic";
import { memo, useCallback, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import useDAOProposalComputedState from "../hooks/useDAOProposalComputedState";
import DAOTag from "./DAOTag";
import { TokenTransfer } from "@multiversx/sdk-core/out";
const DAOVoteModal = dynamic(
    import("./DAOVoteModal").then((m) => m.default),
    { ssr: false }
);
type Props = {
    proposal: DAOProposal;
    userVoteInfo: { yes_vote: BigNumber; no_vote: BigNumber };
};
const DAOUserVoteActive = memo(function DAOUserVoteActive({
    endVoteTS,
    proposalID,
    votePower,
    isSupport,
    weightPct,
}: {
    endVoteTS: number;
    proposalID: number;
    votePower: number;
    isSupport: boolean;
    weightPct: BigNumber.Value;
}) {
    const [isOpenVote, setIsOpenVote] = useState(false);
    const [voteType, setVoteType] = useState<"yes" | "no">("yes");
    const veASH = useRecoilValue(govVeASHAmtSelector);
    const lazyVoteModal = useIsAlready(isOpenVote, true);
    const isVoted = useMemo(() => votePower > 0, [votePower]);
    const isLoggedIn = useRecoilValue(accIsLoggedInState);
    const connectWallet = useConnectWallet();
    const onOpenVoteYes = useCallback(() => {
        setVoteType("yes");
        setIsOpenVote(true);
    }, []);
    const onOpenVoteNo = useCallback(() => {
        setVoteType("no");
        setIsOpenVote(true);
    }, []);
    const onCloseModal = useCallback(() => setIsOpenVote(false), []);
    return (
        <div>
            <div className="px-9 pt-10 pb-14 bg-stake-dark-300">
                <DAOTag status="active" />
                <div className="mt-6 lg:mt-12 mb-6 lg:mb-9 font-bold text-2xl text-white">
                    {isVoted
                        ? "You've voted on this proposal"
                        : "You can vote on this proposal"}
                </div>
                <div className="mb-8 flex">
                    <Countdown timestamp={endVoteTS} small />
                </div>
                {isVoted ? (
                    <div>
                        <DAOUserVoteResult
                            votePower={votePower}
                            isSupport={isSupport}
                            weightPct={weightPct}
                        />
                    </div>
                ) : (
                    <>
                        <div className="px-9 py-7 bg-ash-dark-400/30">
                            <div className="mb-6 font-bold text-sm text-stake-gray-500">
                                Your Voting Power
                            </div>
                            <div className="flex items-center">
                                <Avatar
                                    src={ImgVeash}
                                    alt="veASH"
                                    className="w-4.5 h-4.5 mr-2"
                                />
                                <TextAmt
                                    number={veASH.div(10 ** VE_ASH_DECIMALS)}
                                    className="font-bold text-lg text-white"
                                />
                            </div>
                        </div>
                        <div className="mt-7.5 flex flex-col gap-4">
                            {isLoggedIn ? (
                                <>
                                    <GlowingButton
                                        theme="green"
                                        className="w-full h-18 font-bold text-sm text-ash-dark-400 uppercase"
                                        onClick={onOpenVoteYes}
                                    >
                                        Support! I&apos;m In
                                    </GlowingButton>
                                    <GlowingButton
                                        theme="purple"
                                        className="w-full h-18 font-bold text-sm text-white uppercase"
                                        onClick={onOpenVoteNo}
                                    >
                                        no, I&apos;m against it!
                                    </GlowingButton>
                                </>
                            ) : (
                                <GlowingButton
                                    theme="pink"
                                    className="w-full h-18 font-bold text-sm text-white uppercase"
                                    onClick={connectWallet}
                                >
                                    Connect Wallet
                                </GlowingButton>
                            )}
                        </div>
                    </>
                )}
            </div>
            {lazyVoteModal && (
                <DAOVoteModal
                    isOpen={isOpenVote}
                    onRequestClose={onCloseModal}
                    voteType={voteType}
                    onTxSigned={onCloseModal}
                    proposalID={proposalID}
                />
            )}
        </div>
    );
});
const DAOUserVotePending = memo(function DAOUserVotePending({
    startVoteTS,
}: {
    startVoteTS: number;
}) {
    const startVoteTSFmt = useMemo(() => {
        return moment.unix(startVoteTS).format("HH:mm [(UTC]Z[)] MMM Do, YYYY");
    }, [startVoteTS]);
    return (
        <>
            <div className="px-9 pt-10 pb-14 bg-stake-dark-300">
                <DAOTag status="pending" />
                <div className="mt-6 lg:mt-12 mb-6 lg:mb-9 font-bold text-2xl text-white">
                    You can vote on this proposal after
                </div>
                <div className="font-bold text-sm text-stake-gray-500">
                    {startVoteTSFmt}
                </div>
            </div>
        </>
    );
});
const DAOUserVoteResult = memo(function DAOUserVoteResult({
    votePower,
    isSupport,
    weightPct,
}: {
    votePower: number;
    isSupport: boolean;
    weightPct: BigNumber.Value;
}) {
    return (
        <div className="flex flex-col gap-2">
            <div className="p-6 bg-[#2A2A42] border border-black flex items-center justify-between">
                <div className="font-bold text-sm text-stake-gray-500 uppercase">
                    You&apos;ve voted
                </div>
                <div className="flex items-center gap-2">
                    <TextAmt
                        number={votePower}
                        className="font-bold text-sm text-white"
                    />
                    <Avatar src={ImgVeASH} className="w-3.5 h-3.5" />
                </div>
            </div>
            <div className="p-6 bg-[#2A2A42] border border-black flex items-center justify-between">
                <div className="font-bold text-sm text-stake-gray-500 uppercase">
                    For
                </div>
                <div
                    className={`flex flex-col items-end gap-1 ${
                        isSupport
                            ? "text-stake-green-500"
                            : "text-ash-purple-500"
                    }`}
                >
                    <div className="font-bold text-sm">
                        (<TextAmt number={weightPct} />
                        %)
                    </div>
                    <div className="font-light text-2xs">
                        {isSupport ? "SUPPORT" : "AGAINST"}
                    </div>
                </div>
            </div>
        </div>
    );
});

function DAOUserVote({ proposal, userVoteInfo }: Props) {
    const isLoggedIn = useRecoilValue(accIsLoggedInState);
    const connectWallet = useConnectWallet();
    const {
        endVoteTS,
        startVoteTS,
        canExecuteTS,
        canExecute,
        status,
        expiredTS,
    } = useDAOProposalComputedState(proposal);
    const {
        execute,
        trackingData: { isPending },
    } = useDAOExecute(true);
    const onExecute = useCallback(() => {
        const action = proposal.actions[proposal.executed.length];
        execute(proposal.proposal_id, TokenTransfer.egldFromBigInteger(action.cost || "0"));
    }, [execute, proposal]);
    const isSupport = useMemo(
        () => userVoteInfo.yes_vote.gt(userVoteInfo.no_vote),
        [userVoteInfo]
    );
    const votePower = useMemo(
        () =>
            BigNumber.max(userVoteInfo.no_vote, userVoteInfo.yes_vote)
                .div(1e18)
                .toNumber(),
        [userVoteInfo]
    );
    const weightPct = useMemo(() => {
        return new BigNumber(votePower)
            .multipliedBy(1e18)
            .multipliedBy(100)
            .div(proposal.total_supply);
    }, [proposal.total_supply, votePower]);
    if (status === "active") {
        return (
            <DAOUserVoteActive
                endVoteTS={endVoteTS}
                proposalID={proposal.proposal_id}
                votePower={votePower}
                isSupport={isSupport}
                weightPct={weightPct}
            />
        );
    } else if (status === "pending") {
        return <DAOUserVotePending startVoteTS={startVoteTS} />;
    } else {
        return (
            <div className="px-9 pt-10 pb-14 bg-stake-dark-300">
                <div className="flex gap-1">
                    {status === "executed" && <DAOTag status="approved" />}
                    <DAOTag status={status} />
                    {status === "approved" && (
                        <DAOTag
                            label={
                                canExecute ? "Waiting for execute" : "On Queue"
                            }
                            status="active"
                            className="bg-[#2A2A42]"
                        />
                    )}
                </div>
                <div className="mt-6 lg:mt-12 mb-6 lg:mb-9 font-bold text-2xl text-white">
                    {status === "rejected"
                        ? "This proposal has been rejected"
                        : status === "expired"
                        ? "This proposal has been expired"
                        : status === "executed"
                        ? "This proposal has been executed"
                        : canExecute
                        ? "This proposal must be executed before"
                        : "This proposal can be executed after"}
                </div>
                {status === "approved" && !canExecute && (
                    <div className="mb-9">
                        <Countdown timestamp={canExecuteTS} small />
                    </div>
                )}
                {status === "approved" && canExecute && (
                    <div className="mb-9">
                        <Countdown timestamp={expiredTS} small />
                    </div>
                )}
                <DAOUserVoteResult
                    votePower={votePower}
                    isSupport={isSupport}
                    weightPct={weightPct}
                />
                {isLoggedIn ? (
                    status === "approved" && (
                        <GlowingButton
                            theme="green"
                            disabled={!canExecute || isPending}
                            className="mt-7 w-full h-18 px-4 font-bold text-sm text-ash-dark-400 uppercase"
                            onClick={onExecute}
                        >
                            {canExecute
                                ? "Execute this proposal"
                                : "Can execute after queue "}
                        </GlowingButton>
                    )
                ) : (
                    <GlowingButton
                        theme="pink"
                        className="mt-7 w-full h-18 px-4 font-bold text-sm text-white uppercase"
                        onClick={connectWallet}
                    >
                        Connect Wallet
                    </GlowingButton>
                )}
            </div>
        );
    }
}

export default memo(DAOUserVote);
