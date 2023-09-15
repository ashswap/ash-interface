import { Transition } from "@headlessui/react";
import { Slider } from "antd";
import ImgVeASH from "assets/images/ve-ash.png";
import ICChevronRight from "assets/svg/chevron-right.svg";
import ICVoteNo from "assets/svg/vote-no.svg";
import ICVoteYes from "assets/svg/vote-yes.svg";
import { govVeASHAmtSelector } from "atoms/govState";
import BigNumber from "bignumber.js";
import Avatar from "components/Avatar";
import BaseModal, { BaseModalType } from "components/BaseModal";
import GlowingButton from "components/GlowingButton";
import InputCurrency from "components/InputCurrency";
import TextAmt from "components/TextAmt";
import { VE_ASH_DECIMALS } from "const/tokens";
import { Percent } from "helper/fraction/percent";
import { formatAmount } from "helper/number";
import useDAOVote from "hooks/useDAOContract/useDAOVote";
import useInputNumberString from "hooks/useInputNumberString";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { theme } from "tailwind.config";

type DAOVoteFormProps = {
    proposalID: number;
    voteType: "yes" | "no";
    onTxSigned?: () => void;
};
const DAOVoteForm = memo(function DAOVoteForm({
    proposalID,
    voteType,
    onTxSigned,
}: DAOVoteFormProps) {
    const [weightPct, setWeightPct] = useState(0);
    const [weightStr, setWeightStr] = useInputNumberString(weightPct);
    const [isPending, setIsPending] = useState(false);
    const veAmt = useRecoilValue(govVeASHAmtSelector);
    const {
        vote,
        trackingData: { isSigned, isSuccessful },
    } = useDAOVote(true);
    const handleStyle: React.CSSProperties = useMemo(() => {
        const color =
            voteType === "yes"
                ? theme.extend.colors["stake-green"][500]
                : theme.extend.colors["ash-purple"][500];
        return {
            backgroundColor: color,
            borderRadius: 0,
            border: "2px solid " + color,
            width: 7,
            height: 7,
        };
    }, [voteType]);

    const estimatedVeAmt = useMemo(() => {
        return veAmt
            .multipliedBy(weightPct)
            .div(100)
            .div(10 ** VE_ASH_DECIMALS);
    }, [veAmt, weightPct]);

    const onVote = useCallback(() => {
        setIsPending(true);
        let yesPct = new Percent(voteType === "yes" ? weightPct : 0, 100);
        let noPct = new Percent(voteType === "no" ? weightPct : 0, 100);
        vote(proposalID, yesPct, noPct);
    }, [proposalID, vote, voteType, weightPct]);
    useEffect(() => {
        if (isSigned) {
            onTxSigned?.();
        }
    }, [isSigned, onTxSigned]);
    return (
        <div className="px-6 sm:px-12 pb-5 min-h-[42rem] sm:min-h-[38rem] overflow-hidden">
            <div className="relative">
                <Transition
                    show={!isPending}
                    className="w-full transition-all duration-700"
                    leaveFrom="opacity-100 relative"
                    leaveTo="opacity-0 -translate-x-full absolute"
                >
                    <div className="mb-14 text-center">
                        {voteType === "yes" ? (
                            <div className="font-bold text-[2rem] text-stake-green-500">
                                Approve
                            </div>
                        ) : (
                            <div className="font-bold text-[2rem] text-ash-purple-500">
                                Reject
                            </div>
                        )}
                        <div className="font-bold text-[2rem] text-white">
                            Proposal #{proposalID}
                        </div>
                    </div>
                    <div className="mb-20 flex flex-col sm:flex-row sm:items-center gap-10">
                        <div className="grow">
                            <div className="mb-5 font-bold text-sm">
                                <span className="text-stake-gray-500">
                                    Amount:&nbsp;
                                </span>
                                <span className="text-white">
                                    {formatAmount(estimatedVeAmt)} ve
                                </span>
                            </div>
                            <Slider
                                className={`ash-slider my-0 ${
                                    voteType === "yes"
                                        ? "ash-slider-green"
                                        : "ash-slider-purple"
                                }`}
                                step={1}
                                marks={{
                                    0: <></>,
                                    25: <></>,
                                    50: <></>,
                                    75: <></>,
                                    100: <></>,
                                }}
                                handleStyle={handleStyle}
                                min={0}
                                max={100}
                                value={weightPct}
                                tooltip={{ open: false }}
                                onChange={(e) => {
                                    setWeightPct(Math.min(100, e));
                                }}
                            />
                            <div className="flex justify-between mt-1">
                                <div className="text-xs lg:text-sm font-bold text-stake-gray-500">
                                    0%
                                </div>
                                <div className="text-xs lg:text-sm font-bold text-stake-gray-500">
                                    100%
                                </div>
                            </div>
                        </div>
                        <label
                            className="py-6 px-4 w-full sm:w-36 h-14 sm:h-18 shrink-0 bg-ash-dark-400 flex items-center font-bold text-lg cursor-text"
                            htmlFor="dao-vote-editor-pct"
                        >
                            <InputCurrency
                                id="dao-vote-editor-pct"
                                className="grow bg-transparent min-w-0 outline-none text-right placeholder:text-ash-gray-600"
                                placeholder="0.0"
                                decimals={2}
                                value={weightStr}
                                onChange={(e) => {
                                    const str = e.target.value;
                                    const val = BigNumber.min(str, 100);
                                    const pct = val;
                                    setWeightPct(val.toNumber());
                                    setWeightStr(
                                        new BigNumber(str).gt(pct)
                                            ? "" + pct
                                            : str
                                    );
                                }}
                            />
                            <div className="text-ash-gray-600">&nbsp;%</div>
                        </label>
                    </div>
                    <div className="px-9 py-7 bg-ash-dark-400/30">
                        <div className="mb-6 font-bold text-sm text-stake-gray-500 uppercase">
                            Your veash voting power
                        </div>
                        <div className="flex items-center">
                            <Avatar
                                src={ImgVeASH}
                                alt="veASH"
                                className="w-4.5 h-4.5 mr-2"
                            />
                            <TextAmt
                                number={veAmt.div(10 ** VE_ASH_DECIMALS)}
                                options={{ notation: "standard" }}
                                className="font-bold text-lg text-white"
                            />
                        </div>
                    </div>
                    <div className="mt-5 border-notch-x border-notch-stake-gray-500">
                        <GlowingButton
                            theme={voteType === "yes" ? "green" : "purple"}
                            className={`w-full h-12 flex items-center font-bold text-sm uppercase ${
                                voteType === "yes"
                                    ? "text-ash-dark-400"
                                    : "text-white"
                            }`}
                            onClick={onVote}
                        >
                            <span>Vote</span>
                            <ICChevronRight className="-mt-0.5 ml-2 w-2 h-auto" />
                        </GlowingButton>
                    </div>
                    <div className="mt-4 font-bold text-sm text-stake-gary-500 text-center">
                        You can only vote once for each proposal
                    </div>
                </Transition>
                <Transition
                    show={isPending}
                    className="pt-8 flex flex-col items-center transition-all text-center duration-700"
                    enterFrom="opacity-0 translate-x-full absolute"
                    enterTo="opacity-100 translate-x-0 relative"
                >
                    <div className="mb-20 font-bold text-2xl text-white">
                        Confirm transaction on your <br /> wallet to apply your
                        vote
                    </div>
                    {voteType === "yes" ? (
                        <ICVoteYes className="w-28 h-auto text-stake-green-500 colored-drop-shadow-xs colored-drop-shadow-current" />
                    ) : (
                        <ICVoteNo className="w-28 h-auto text-ash-purple-500 colored-drop-shadow-xs colored-drop-shadow-current" />
                    )}
                    <div className="mt-16 font-bold text-[2rem] text-white leading-tight">
                        <span>{weightPct}%&nbsp;</span>
                        {voteType === "yes" ? (
                            <span className="text-stake-green-500">
                                Approve
                            </span>
                        ) : (
                            <span className="text-ash-purple-500">Reject</span>
                        )}
                    </div>
                    <div className="mb-9 font-bold text-[2rem] text-white leading-tight">
                        Proposal #{proposalID}
                    </div>
                    <div className="font-bold text-sm text-stake-gray-500">
                        You can only vote once for each proposal
                    </div>
                </Transition>
            </div>
        </div>
    );
});
type DAOVoteModalProps = DAOVoteFormProps & BaseModalType;
function DAOVoteModal({
    voteType,
    onTxSigned,
    proposalID,
    ...props
}: DAOVoteModalProps) {
    return (
        <BaseModal
            {...props}
            className="flex flex-col clip-corner-4 clip-corner-tl w-screen sm:max-w-[38rem] p-4 bg-stake-dark-300"
        >
            <div className="mb-6 flex justify-end">
                <BaseModal.CloseBtn />
            </div>
            <div className="grow overflow-auto">
                <DAOVoteForm
                    voteType={voteType}
                    onTxSigned={onTxSigned}
                    proposalID={proposalID}
                />
            </div>
        </BaseModal>
    );
}

export default DAOVoteModal;
