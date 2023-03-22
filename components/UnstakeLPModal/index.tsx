import { Slider } from "antd";
import ICChevronRight from "assets/svg/chevron-right.svg";
import {
    accIsInsufficientEGLDState,
    accIsLoggedInState
} from "atoms/dappState";
import { FarmRecord } from "atoms/farmsState";
import { clickedUnstakeModalState } from "atoms/unstakeState";
import BigNumber from "bignumber.js";
import Avatar from "components/Avatar";
import BaseModal from "components/BaseModal";
import GlowingButton from "components/GlowingButton";
import InputCurrency from "components/InputCurrency";
import TextAmt from "components/TextAmt";
import CardTooltip from "components/Tooltip/CardTooltip";
import { toEGLDD, toWei } from "helper/balance";
import { TokenAmount } from "helper/token/tokenAmount";
import useExitFarm from "hooks/useFarmContract/useExitFarm";
import { useScreenSize } from "hooks/useScreenSize";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { theme } from "tailwind.config";
import { useDebounce } from "use-debounce";
type props = {
    open: boolean;
    onClose: () => void;
    farmData: FarmRecord;
};
const UnstakeLPContent = ({ open, onClose, farmData }: props) => {
    const { pool, farm, stakedData, ashPerSec, farmTokenSupply } = farmData;
    const loggedIn = useRecoilValue(accIsLoggedInState);
    const [isClickedUnstake, setIsClickedUnstake] = useRecoilState(
        clickedUnstakeModalState
    );
    const [unStakeAmt, setUnStakeAmt] = useState<BigNumber>(new BigNumber(0));
    const [deboundedUnstakeAmt] = useDebounce(unStakeAmt, 500);
    const [rawStakeAmt, setRawStakeAmt] = useState("");
    const [unstakePct, setUnstakePct] = useState(0);
    const [rewardsOnExit, setRewardsOnExit] = useState<TokenAmount[]>([]);
    const insufficientEGLD = useRecoilValue(accIsInsufficientEGLDState);
    const { exitFarm, estimateRewardOnExit } = useExitFarm();
    const setMaxStakeAmt = useCallback(() => {
        if (!stakedData?.totalStakedLP) return;
        setUnStakeAmt(stakedData.totalStakedLP);
        setRawStakeAmt(
            toEGLDD(farm.farm_token_decimal, stakedData.totalStakedLP).toString(
                10
            )
        );
    }, [stakedData, farm]);
    useEffect(() => {
        if (window && loggedIn && !deboundedUnstakeAmt.eq(0)) {
            let dataLayer = (window as any).dataLayer || [];
            dataLayer.push({
                event: "input_unstake_value",
                amount: deboundedUnstakeAmt.toNumber() / 10 ** 18,
                lp_token: pool?.lpToken?.symbol,
            });
        }
    }, [deboundedUnstakeAmt, loggedIn, pool]);
    // const ashPerDay = useMemo(() => {
    //     if (!stakedData) return new BigNumber(0);
    //     const totalAshPerDay = ashPerSec.multipliedBy(24 * 60 * 60);
    //     const shareOfFarm = stakedData.farmTokens
    //         .reduce((sum, t) => sum.plus(t.balance), new BigNumber(0))
    //         .div(farmTokenSupply);
    //     return totalAshPerDay.multipliedBy(shareOfFarm);
    // }, [stakedData, farmTokenSupply, ashPerSec]);

    // const afterUnstakeAshPerDay = useMemo(() => {
    //     if (!stakedData) return new BigNumber(0);
    //     const totalAshPerDay = ashPerSec.multipliedBy(24 * 60 * 60);
    //     const oldTotalLP = stakedData.totalStakedLP;
    //     const oldFarmAmt = stakedData.farmTokens.reduce(
    //         (sum, t) => sum.plus(t.balance),
    //         new BigNumber(0)
    //     );
    //     const unstakeFarmAmt = unStakeAmt
    //         .multipliedBy(oldFarmAmt)
    //         .idiv(oldTotalLP);
    //     const newFarmAmt = oldFarmAmt.minus(unstakeFarmAmt);

    //     if (newFarmAmt.lte(0)) return new BigNumber(0);
    //     const shareOfFarm = newFarmAmt.div(
    //         farmTokenSupply.minus(unstakeFarmAmt)
    //     );
    //     return totalAshPerDay.multipliedBy(shareOfFarm);
    // }, [stakedData, farmTokenSupply, ashPerSec, unStakeAmt]);

    const insufficientFarmToken = useMemo(() => {
        if (!stakedData?.totalStakedLP) return true;
        return unStakeAmt.gt(stakedData?.totalStakedLP);
    }, [stakedData, unStakeAmt]);
    const canUnstake = useMemo(() => {
        return unStakeAmt.gt(0) && !insufficientFarmToken && !insufficientEGLD;
    }, [unStakeAmt, insufficientFarmToken, insufficientEGLD]);
    const unStake = useCallback(async () => {
        if (!stakedData?.totalStakedLP) return;
        const { sessionId } = await exitFarm(
            unStakeAmt,
            farm,
            unStakeAmt.eq(stakedData.totalStakedLP)
        );
        if (sessionId && onClose) {
            onClose();
        }
    }, [exitFarm, unStakeAmt, farm, onClose, stakedData]);
    const onChangePct = useCallback(
        (pct: number) => {
            if (!stakedData) return;
            const amt = stakedData.totalStakedLP
                .multipliedBy(pct)
                .div(100)
                .integerValue();
            setUnStakeAmt(amt);
            setRawStakeAmt(toEGLDD(farm.farm_token_decimal, amt).toString(10));
        },
        [stakedData, farm.farm_token_decimal]
    );
    useEffect(() => {
        if (!stakedData) return;
        setUnstakePct(
            Math.min(
                100,
                unStakeAmt
                    .multipliedBy(100)
                    .div(stakedData.totalStakedLP)
                    .toNumber()
            )
        );
    }, [unStakeAmt, stakedData]);

    useEffect(() => {
        estimateRewardOnExit(deboundedUnstakeAmt, farm).then((val) =>
            setRewardsOnExit(val)
        );
    }, [deboundedUnstakeAmt, farm, estimateRewardOnExit]);

    return (
        <div className="px-6 lg:px-20 pb-12 overflow-auto">
            <div className="text-2xl font-bold text-yellow-600 mb-9 lg:mb-14">
                Unstake {pool?.lpToken?.symbol}
            </div>
            <div className="sm:flex sm:space-x-8 lg:space-x-24 mb-18">
                <div className="flex flex-col grow mb-16 sm:mb-0">
                    <div className="w-full grid md:grid-cols-2 gap-y-6 gap-x-4 lg:gap-x-7.5 mb-11">
                        <div>
                            <div className="text-ash-gray-500 text-xs lg:text-sm font-bold mb-2 lg:mb-4">
                                Token
                            </div>
                            <div className="bg-ash-dark-400/30 h-14 lg:h-18 px-6 flex items-center">
                                <div className="flex mr-2">
                                    {pool.tokens.map((t) => (
                                        <Avatar
                                            key={t.identifier}
                                            src={t.logoURI}
                                            alt={t.symbol}
                                            className="w-4 h-4 first:ml-0 -ml-1"
                                        />
                                    ))}
                                </div>
                                <div className="text-ash-gray-500 text-sm lg:text-lg font-bold">
                                    {pool?.lpToken?.symbol}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="text-ash-gray-500 text-xs lg:text-sm font-bold mb-2 lg:mb-4">
                                Unstake Amount
                            </div>
                            <InputCurrency
                                className={`w-full text-white text-lg font-bold bg-ash-dark-400 h-14 lg:h-18 px-6 flex items-center text-right outline-none border ${
                                    insufficientFarmToken
                                        ? "border-ash-purple-500"
                                        : "border-transparent"
                                }`}
                                value={rawStakeAmt}
                                decimals={pool.lpToken.decimals}
                                onChange={(e) => {
                                    const raw = e.target.value.trim();
                                    const amt = toWei(pool.lpToken, raw);
                                    setRawStakeAmt(raw);
                                    setUnStakeAmt(amt);
                                    setIsClickedUnstake(true);
                                }}
                            />
                            <div className="text-right text-2xs lg:text-xs mt-2">
                                <span className="text-ash-gray-500">
                                    Staked:{" "}
                                </span>
                                <span
                                    className="text-earn cursor-pointer"
                                    onClick={() => setMaxStakeAmt()}
                                >
                                    <TextAmt
                                        number={toEGLDD(
                                            farm.farming_token_decimal,
                                            stakedData?.totalStakedLP || 0
                                        )}
                                        options={{ notation: "standard" }}
                                    />{" "}
                                    {pool?.lpToken?.symbol}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="mb-28">
                        <Slider
                            className="ash-slider ash-slider-yellow my-0"
                            step={1}
                            marks={{
                                0: <></>,
                                25: <></>,
                                50: <></>,
                                75: <></>,
                                100: <></>,
                            }}
                            handleStyle={{
                                backgroundColor:
                                    theme.extend.colors.yellow[600],
                                borderRadius: 0,
                                border:
                                    "2px solid " +
                                    theme.extend.colors.yellow[600],
                                width: 7,
                                height: 7,
                            }}
                            min={0}
                            max={100}
                            value={unstakePct}
                            onChange={(e) => onChangePct(e)}
                        />
                        <div className="flex justify-between text-sm font-bold mt-1">
                            <div className="text-stake-gray-500">0%</div>
                            <div className="text-yellow-600">100%</div>
                        </div>
                    </div>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/3 lg:w-[17.8125rem] shrink-0 flex flex-col gap-[1px]">
                    <div className="px-7 h-16 flex items-center bg-ash-dark-400/30">
                        <CardTooltip
                            content={
                                <div>
                                    While unstaking your LP-Token, you also
                                    harvest your ASH farmed by the percentage of
                                    the LP-Token that would be unstaked.
                                </div>
                            }
                        >
                            <div className="inline-block font-bold text-xs lg:text-lg text-white underline">
                                You also harvest
                            </div>
                        </CardTooltip>
                    </div>
                    {rewardsOnExit.map((r) => {
                        return (
                            <div
                                key={r.token.identifier}
                                className="px-7 h-14 lg:h-16 flex items-center justify-between bg-ash-dark-400/30 text-ash-gray-600"
                            >
                                <div className="flex items-center">
                                    <Avatar
                                        src={r.token.logoURI}
                                        alt={r.token.name}
                                        className="w-4 h-4 mr-2"
                                    />
                                    <div className="mt-0.5 text-sm lg:text-lg font-bold">
                                        {r.token.symbol}
                                    </div>
                                </div>
                                <div className="text-sm lg:text-lg font-bold">
                                    <TextAmt
                                        number={r.egld}
                                        options={{ notation: "standard" }}
                                        className="text-white"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="sm:flex sm:space-x-8 lg:space-x-24">
                <div className="w-full mb-12 sm:mb-0 sm:grow">
                    <span className="text-xs text-ash-gray-500">
                        Make sure you have read the{" "}
                        <a
                            href="https://docs.ashswap.io/testnet-guides/liquidity-staking"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <b className="text-white">
                                <u>AshSwap Liquidity Staking Guide</u>
                            </b>
                        </a>{" "}
                        and understood the associated risks.
                    </span>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/3 lg:w-[17.8125rem] shrink-0">
                    <div className="border-notch-x border-notch-white/50">
                        <GlowingButton
                            theme="yellow"
                            className={`clip-corner-1 clip-corner-tl w-full h-12 text-sm font-bold`}
                            disabled={!canUnstake}
                            onClick={() => canUnstake && unStake()}
                        >
                            {insufficientEGLD ? (
                                "INSUFFICIENT EGLD BALANCE"
                            ) : (
                                <div className="flex items-center">
                                    <div className="mr-2">UNSTAKE</div>
                                    <ICChevronRight className="w-2 h-auto" />
                                </div>
                            )}
                        </GlowingButton>
                    </div>
                </div>
            </div>
        </div>
    );
};
function UnstakeLPModal(props: props) {
    const { open, onClose, farmData } = props;
    const screenSize = useScreenSize();
    return (
        <BaseModal
            isOpen={!!open}
            onRequestClose={() => onClose?.()}
            type={screenSize.isMobile ? "drawer_btt" : "modal"}
            className={`bg-stake-dark-400 text-white p-4 sm:ash-container flex flex-col max-h-full max-w-[51.75rem] mx-auto`}
        >
            <div className="flex justify-end mb-3.5">
                <BaseModal.CloseBtn />
            </div>
            {open && (
                <div className="grow overflow-auto">
                    <UnstakeLPContent {...props} />
                </div>
            )}
        </BaseModal>
    );
}

export default UnstakeLPModal;
