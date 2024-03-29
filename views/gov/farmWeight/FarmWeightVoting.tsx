import { Slider } from "antd";
import ICBribe from "assets/svg/bribe.svg";
import ICChevronRight from "assets/svg/chevron-right.svg";
import ICLock from "assets/svg/lock.svg";
import ICNewTab from "assets/svg/new-tab.svg";
import ICTickCircle from "assets/svg/tick-circle.svg";
import { ashswapBaseState } from "atoms/ashswap";
import { accIsLoggedInState } from "atoms/dappState";
import {
    fbClaimableRewardsSelector,
    fbHasBribe,
    fbTotalClaimableUSDSelector,
    fbTotalRewardsUSD,
} from "atoms/farmBribeState";
import { fcAccountFarmSelector } from "atoms/farmControllerState";
import { govVeASHAmtSelector } from "atoms/govState";
import BigNumber from "bignumber.js";
import Avatar from "components/Avatar";
import BaseModal from "components/BaseModal";
import Checkbox from "components/Checkbox";
import GlowingButton from "components/GlowingButton";
import InputCurrency from "components/InputCurrency";
import TextAmt from "components/TextAmt";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { FARMS_MAP } from "const/farms";
import { POOLS_MAP_LP } from "const/pool";
import { formatAmount } from "helper/number";
import { getTokenFromId } from "helper/token";
import useVoteForFarm from "hooks/useFarmControllerContract/useVoteForFarm";
import useInputNumberString from "hooks/useInputNumberString";
import { useScreenSize } from "hooks/useScreenSize";
import moment from "moment";
import Link from "next/link";
import { memo, useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { theme } from "tailwind.config";
type FarmRecordProps = {
    farmAddress: string;
    selected?: boolean;
    onClick?: () => void;
};
const FarmRecord = memo(function FarmRecord({
    farmAddress,
    selected,
    onClick,
}: FarmRecordProps) {
    const pool = useMemo(
        () => POOLS_MAP_LP[FARMS_MAP[farmAddress]?.farming_token_id],
        [farmAddress]
    );
    const fcAccFarm = useRecoilValue(fcAccountFarmSelector(farmAddress));
    const fbTotalUSD = useRecoilValue(fbTotalRewardsUSD(farmAddress));
    const hasBribe = useRecoilValue(fbHasBribe(farmAddress));

    const power = useMemo(
        () => +(fcAccFarm?.voteUserSlope?.power || "0"),
        [fcAccFarm]
    );
    const bribeUrl = useMemo(() => "/gov/bribe", []);

    const lastUserVote = useMemo(
        () => fcAccFarm?.lastUserVote || 0,
        [fcAccFarm]
    );
    const canVote = useMemo(() => {
        const diff = moment().unix() - lastUserVote;
        return diff > ASHSWAP_CONFIG.farmWeightVoteDelay;
    }, [lastUserVote]);
    const nextVoteDate = useMemo(() => {
        if (!lastUserVote) return "";
        return moment
            .unix(lastUserVote + ASHSWAP_CONFIG.farmWeightVoteDelay)
            .format("HH:mm - DD MMM");
    }, [lastUserVote]);
    if (!pool) return <></>;
    return (
        <tr
            className={`transition-all cursor-pointer ${
                selected ? "bg-ash-dark-400" : "hover:bg-ash-dark-400/50 group"
            }`}
            onClick={onClick}
        >
            <td className="border border-black p-4">
                <div className="flex flex-col md:flex-row md:items-center">
                    <div className="flex -space-x-0.5 mr-2 mb-2 md:mb-0">
                        {pool.tokens.map((_t) => {
                            const t = getTokenFromId(_t.identifier);
                            return (
                                <Avatar
                                    key={t.identifier}
                                    src={t.logoURI}
                                    className={`w-4 h-4 ${
                                        canVote ? "" : "grayscale"
                                    }`}
                                />
                            );
                        })}
                    </div>
                    <div
                        className={`font-bold text-xs sm:text-sm lg:text-lg ${
                            canVote ? "text-white" : "text-ash-gray-600"
                        }`}
                    >
                        {pool.tokens
                            .map((t) => getTokenFromId(t.identifier).symbol)
                            .join("-")}
                    </div>
                </div>
            </td>
            <td className="border border-black border-l-0 p-4">
                <div
                    className={`font-bold text-sm md:text-lg text-right ${
                        canVote ? "text-white" : "text-pink-600"
                    }`}
                >
                    {(power * 100) / 10_000}%
                </div>
            </td>
            <td className="border border-black border-l-0 p-4">
                {canVote ? (
                    <div className="flex items-center space-x-1 md:space-x-2 text-pink-600">
                        <ICTickCircle className="w-4 h-auto md:w-6" />
                        <span className="font-bold text-sm md:text-base">
                            Can vote
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center space-x-1 md:space-x-2 text-ash-gray-600">
                        <ICLock className="w-4 h-auto md:w-6" />
                        <span className="font-bold text-sm md:text-base">
                            {nextVoteDate}
                        </span>
                    </div>
                )}
            </td>
            <td className="border border-black border-l-0 p-4">
                <div className="flex items-center">
                    <ICBribe
                        className={`transition-all duration-300 shrink-0 mr-2 md:mr-6 w-4 sm:w-8 h-auto ${
                            hasBribe
                                ? "text-pink-600/80 colored-drop-shadow-xs colored-drop-shadow-pink-600"
                                : selected
                                ? "text-stake-gray-500/60"
                                : "text-ash-dark-400/60 stroke-ash-dark-400 group-hover:text-stake-gray-500/60"
                        }`}
                    />
                    {hasBribe ? (
                        <>
                            <div className="grow mr-2">
                                <div className="font-bold text-2xs text-stake-gray-500">
                                    Total rewards
                                </div>
                                <div className="text-sm md:text-lg">
                                    <span className="font-medium text-stake-gray-500">
                                        $
                                    </span>
                                    <TextAmt
                                        number={fbTotalUSD}
                                        options={{ notation: "standard" }}
                                        className="font-bold"
                                    />
                                </div>
                            </div>
                            <a
                                href={bribeUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <ICNewTab className="w-3 md:w-4 h-auto shrink-0 text-white" />
                            </a>
                        </>
                    ) : (
                        <div className="font-bold text-lg text-ash-gray-600">
                            No
                        </div>
                    )}
                </div>
            </td>
        </tr>
    );
});
type VoteEditorProps = {
    farmAddress: string;
};
const VoteEditor = memo(function VoteEditor({ farmAddress }: VoteEditorProps) {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [weight, setWeight] = useState(0);
    const [confirmed, setConfirmed] = useState(false);
    const weightPct = useMemo(
        () => new BigNumber(weight).multipliedBy(100).div(10_000),
        [weight]
    );
    const [weightStr, setWeightStr] = useInputNumberString(weightPct);
    const fcAccFarm = useRecoilValue(fcAccountFarmSelector(farmAddress));
    const ashBase = useRecoilValue(ashswapBaseState);
    const veAmt = useRecoilValue(govVeASHAmtSelector);
    const totalRewardUSD = useRecoilValue(
        fbTotalClaimableUSDSelector(farmAddress)
    );
    const claimableRewards = useRecoilValue(
        fbClaimableRewardsSelector(farmAddress)
    );
    const {
        voteFarmWeight,
        trackingData: { isPending },
    } = useVoteForFarm(true);
    const screenSize = useScreenSize();
    const powerUsed = useMemo(() => {
        if (ashBase.farmController?.account) {
            return new BigNumber(
                ashBase.farmController.account.voteUserPower
            ).toNumber();
        }
        return 0;
    }, [ashBase.farmController]);
    const powerUsedForCurrentFarm = useMemo(() => {
        return +(fcAccFarm?.voteUserSlope?.power || 0);
    }, [fcAccFarm]);
    const pool = useMemo(
        () => POOLS_MAP_LP[FARMS_MAP[farmAddress]?.farming_token_id],
        [farmAddress]
    );
    const maxPower = useMemo(
        () => 10000 - powerUsed + powerUsedForCurrentFarm,
        [powerUsed, powerUsedForCurrentFarm]
    );
    const lastUserVote = useMemo(
        () => fcAccFarm?.lastUserVote || 0,
        [fcAccFarm]
    );

    const isLockedVote = useMemo(() => {
        const diff = moment().unix() - lastUserVote;
        return diff < ASHSWAP_CONFIG.farmWeightVoteDelay;
    }, [lastUserVote]);

    const canVote = useMemo(() => {
        return (
            veAmt.gt(0) &&
            farmAddress &&
            weight >= 0 &&
            !isPending &&
            !isLockedVote
        );
    }, [veAmt, farmAddress, weight, isPending, isLockedVote]);

    const nextVoteDate = useMemo(() => {
        return moment
            .unix(moment().unix() + ASHSWAP_CONFIG.farmWeightVoteDelay)
            .format("HH:mm - DD MMM");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpenModal]);

    useEffect(() => {
        if (farmAddress) {
            setWeight(powerUsedForCurrentFarm);
        }
    }, [powerUsedForCurrentFarm, farmAddress]);
    return (
        <>
            <div className="flex flex-col md:flex-row md:items-start space-y-10 md:space-y-0 md:space-x-4">
                <div className="grow overflow-hidden">
                    <div className="font-bold text-xs sm:text-sm text-stake-gray-500 mb-3">
                        {pool?.tokens
                            .map((t) => getTokenFromId(t.identifier).symbol)
                            .join("-") || "Select a farm to start"}
                    </div>
                    <Slider
                        className="ash-slider ash-slider-pink my-0"
                        step={1}
                        marks={{
                            0: <></>,
                            2500: <></>,
                            5000: <></>,
                            7500: <></>,
                            10000: <></>,
                        }}
                        handleStyle={{
                            backgroundColor: theme.extend.colors.pink[600],
                            borderRadius: 0,
                            border:
                                "2px solid " + theme.extend.colors.pink[600],
                            width: 7,
                            height: 7,
                        }}
                        min={0}
                        max={10_000}
                        value={weight}
                        tooltip={{ open: false }}
                        onChange={(e) => {
                            setWeight(Math.min(maxPower, e));
                        }}
                        disabled={!farmAddress}
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
                <div className="md:w-1/2 lg:w-5/12 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <label
                        className="py-6 px-4 w-full sm:w-1/2 md:w-2/5 h-14 sm:h-18 shrink-0 bg-ash-dark-400 flex items-center font-bold text-lg cursor-text"
                        htmlFor="vote-editor-pct"
                    >
                        <InputCurrency
                            id="vote-editor-pct"
                            className="grow bg-transparent min-w-0 outline-none text-right placeholder:text-ash-gray-600"
                            placeholder="0.0"
                            decimals={2}
                            value={weightStr}
                            disabled={!farmAddress}
                            onChange={(e) => {
                                const str = e.target.value;
                                const val = BigNumber.min(
                                    new BigNumber(str)
                                        .multipliedBy(10_000)
                                        .div(100),
                                    maxPower
                                );
                                const pct = val.multipliedBy(100).div(10_000);
                                setWeight(val.toNumber());
                                setWeightStr(
                                    new BigNumber(str).gt(pct) ? "" + pct : str
                                );
                            }}
                        />
                        <div className="text-ash-gray-600">%</div>
                    </label>
                    <div className="grow">
                        <GlowingButton
                            theme="pink"
                            className="w-full h-14 sm:h-18 px-4 font-bold text-sm"
                            disabled={!canVote}
                            onClick={() => setIsOpenModal(true)}
                        >
                            {veAmt.gt(0) ? (
                                <>
                                    {isLockedVote ? (
                                        <>This farm is locked</>
                                    ) : (
                                        <>
                                            Confirm{" "}
                                            <ICChevronRight className="w-2 h-auto ml-2" />
                                        </>
                                    )}
                                </>
                            ) : (
                                "YOU DON’T HAVE VEASH"
                            )}
                        </GlowingButton>
                        {veAmt.eq(0) ? (
                            <div className="mt-2 font-bold text-2xs text-stake-gray-500">
                                Stake ASH{" "}
                                <Link href="/gov">
                                    <span className="text-pink-600 underline">
                                        here
                                    </span>
                                </Link>{" "}
                                to get veASH
                            </div>
                        ) : (
                            isLockedVote && (
                                <div className="mt-2 font-bold text-2xs text-stake-gray-500">
                                    You can only change individual farm votes
                                    once per 10 days
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
            <BaseModal
                isOpen={isOpenModal}
                onRequestClose={() => {
                    setIsOpenModal(false);
                    setConfirmed(false);
                }}
                type={screenSize.msm ? "drawer_btt" : "modal"}
                className={`clip-corner-4 clip-corner-tl bg-ash-dark-400 text-white p-4 flex flex-col max-h-full max-w-4xl mx-auto`}
            >
                <div className="flex justify-end mb-6">
                    <BaseModal.CloseBtn />
                </div>
                <div className="grow overflow-auto">
                    <div className="px-20 pb-16">
                        <div className="mb-5 font-bold text-2xl sm:text-5xl text-white leading-tight text-center">
                            Your vote for this farm can not be changed before
                        </div>
                        <div className="flex flex-col gap-12">
                            <div className="h-18 px-5 flex justify-between items-center self-center bg-ash-dark-600">
                                <div className="mr-10 flex items-center">
                                    <ICLock className="w-6 h-auto mr-2" />
                                    <span>{nextVoteDate}</span>
                                </div>
                                <div className="flex items-center">
                                    {pool?.tokens.map((_t) => {
                                        const t = getTokenFromId(_t.identifier);
                                        return (
                                            <Avatar
                                                key={t.identifier}
                                                src={t.logoURI}
                                                alt={t.name}
                                                className="w-5 h-5 -ml-0.5 first:ml-0"
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                            {claimableRewards.length > 0 && (
                                <div>
                                    <div className="mb-4">
                                        You have ${formatAmount(totalRewardUSD)}{" "}
                                        in bribe from this farm. Make sure you
                                        have claimed bribe before voting again.
                                    </div>
                                    <Checkbox
                                        text="I understand and wish to continue"
                                        checked={confirmed}
                                        onChange={setConfirmed}
                                    />
                                </div>
                            )}

                            <div className="w-full sm:w-64 self-center border-notch-x border-notch-white/50">
                                <GlowingButton
                                    theme="pink"
                                    className="clip-corner-1 clip-corner-tl w-full h-12 font-bold text-sm"
                                    disabled={
                                        !(
                                            canVote &&
                                            (confirmed ||
                                                !claimableRewards.length)
                                        )
                                    }
                                    onClick={() => {
                                        voteFarmWeight(farmAddress, weight);
                                        setIsOpenModal(false);
                                        setConfirmed(false);
                                    }}
                                >
                                    <span className="mr-3">Vote</span>
                                    <ICChevronRight className="w-auto h-2.5" />
                                </GlowingButton>
                            </div>
                        </div>
                    </div>
                </div>
            </BaseModal>
        </>
    );
});
type FarmWeightVotingProps = {
    defaultFarmAddress?: string;
};
function FarmWeightVoting({ defaultFarmAddress }: FarmWeightVotingProps) {
    const [selectedFarmAddress, setSelectedFarmAddress] = useState("");
    const ashBase = useRecoilValue(ashswapBaseState);
    const isLoggedIn = useRecoilValue(accIsLoggedInState);
    const farms = useMemo(() => {
        return ashBase.farmController?.farms?.map((f) => f.address) || [];
    }, [ashBase]);

    useEffect(
        () => setSelectedFarmAddress(defaultFarmAddress || ""),
        [defaultFarmAddress]
    );

    return (
        <div className="bg-stake-dark-300 mt-9 pt-11 pb-20 px-7.5">
            <div className="flex justify-between mb-12">
                <div className="grow">
                    <h2 className="font-bold text-2xl text-white leading-tight mb-3">
                        Your Votes
                    </h2>
                    <div className="font-bold text-sm text-stake-gray-500">
                        You can only change individual farm votes once per 10
                        days. Make sure to do decreases first and increases
                        last.
                    </div>
                </div>
            </div>
            <div className="overflow-auto mb-12">
                <table className="w-full space-y-4 border-separate border-spacing-y-4 min-w-[35rem]">
                    <thead>
                        <tr className="text-left font-bold text-xs sm:text-sm text-stake-gray-500 underline">
                            <th className="w-auto min-w-[10rem]">Farm</th>
                            <th className="w-2/12">Voted</th>
                            <th className="w-2/12 min-w-[10rem] md:min-w-[12rem]">
                                Not Voteable Until
                            </th>
                            <th className="min-w-[10rem] w-4/12 md:w-3/12">
                                Bribe
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {farms.map((f) => (
                            <FarmRecord
                                key={f}
                                farmAddress={f}
                                selected={selectedFarmAddress === f}
                                onClick={() =>
                                    isLoggedIn && setSelectedFarmAddress(f)
                                }
                            />
                        ))}
                    </tbody>
                </table>
            </div>
            <VoteEditor farmAddress={selectedFarmAddress} />
        </div>
    );
}

export default memo(FarmWeightVoting);
