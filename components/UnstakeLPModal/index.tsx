import { Slider } from "antd";
import ICChevronRight from "assets/svg/chevron-right.svg";
import { accIsInsufficientEGLDState } from "atoms/dappState";
import { FarmsState } from "atoms/farmsState";
import BigNumber from "bignumber.js";
import BaseModal from "components/BaseModal";
import Checkbox from "components/Checkbox";
import InputCurrency from "components/InputCurrency";
import TextAmt from "components/TextAmt";
import CardTooltip from "components/Tooltip/CardTooltip";
import { blockTimeMs } from "const/dappConfig";
import { ASH_TOKEN } from "const/tokens";
import { toEGLDD, toWei } from "helper/balance";
import { formatAmount } from "helper/number";
import useExitFarm from "hooks/useExitFarm";
import { useScreenSize } from "hooks/useScreenSize";
import { Unarray } from "interface/utilities";
import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { theme } from "tailwind.config";
import { useDebounce } from "use-debounce";
type props = {
    open: boolean;
    onClose: () => void;
    farmData: Unarray<FarmsState["farmRecords"]>;
};
const UnstakeLPContent = ({ open, onClose, farmData }: props) => {
    const {
        pool,
        farm,
        stakedData,
        ashPerBlock,
        farmTokenSupply,
        emissionAPR,
    } = farmData;
    const [token0, token1] = pool.tokens;
    const [isAgree, setIsAgree] = useState(false);
    const [unStakeAmt, setUnStakeAmt] = useState<BigNumber>(new BigNumber(0));
    const [deboundedUnstakeAmt] = useDebounce(unStakeAmt, 500);
    const [rawStakeAmt, setRawStakeAmt] = useState("");
    const [unstakePct, setUnstakePct] = useState(0);
    const [rewardOnExit, setRewardOnExit] = useState(new BigNumber(0));
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

    const ashPerDay = useMemo(() => {
        if (!stakedData) return new BigNumber(0);
        const totalAshPerDay = ashPerBlock
            .multipliedBy(24 * 60 * 60)
            .div(blockTimeMs / 1000);
        const shareOfFarm = stakedData.totalStakedLP.div(farmTokenSupply);
        return totalAshPerDay.multipliedBy(shareOfFarm);
    }, [stakedData, farmTokenSupply, ashPerBlock]);

    const afterUnstakeAshPerDay = useMemo(() => {
        if (!stakedData) return new BigNumber(0);
        const totalAshPerDay = ashPerBlock
            .multipliedBy(24 * 60 * 60)
            .div(blockTimeMs / 1000);
        const newStaked = stakedData.totalStakedLP.minus(unStakeAmt);
        if (newStaked.lte(0)) return new BigNumber(0);
        const shareOfFarm = newStaked.div(farmTokenSupply.minus(unStakeAmt));
        return totalAshPerDay.multipliedBy(shareOfFarm);
    }, [stakedData, farmTokenSupply, ashPerBlock, unStakeAmt]);

    const lpName = useMemo(() => {
        return `LP-${token0.name}${token1.name}`;
    }, [token0.name, token1.name]);
    const insufficientFarmToken = useMemo(() => {
        if (!stakedData?.totalStakedLP) return true;
        return unStakeAmt.gt(stakedData?.totalStakedLP);
    }, [stakedData, unStakeAmt]);
    const canUnstake = useMemo(() => {
        return (
            isAgree &&
            unStakeAmt.gt(0) &&
            !insufficientFarmToken &&
            !insufficientEGLD
        );
    }, [isAgree, unStakeAmt, insufficientFarmToken, insufficientEGLD]);
    const unStake = useCallback(async () => {
        const { sessionId } = await exitFarm(unStakeAmt, farm);
        if (sessionId && onClose) {
            onClose();
        }
    }, [exitFarm, unStakeAmt, farm, onClose]);
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
            setRewardOnExit(val)
        );
    }, [deboundedUnstakeAmt, farm, estimateRewardOnExit]);

    return (
        <div className="px-6 lg:px-20 pb-12 overflow-auto">
            <div className="text-2xl font-bold text-yellow-600 mb-9 lg:mb-14">
                Unstake {lpName}
            </div>
            <div className="sm:flex sm:space-x-8 lg:space-x-24 mb-18">
                <div className="flex flex-col flex-grow mb-16 sm:mb-0">
                    <div className="w-full grid md:grid-cols-2 gap-y-6 gap-x-4 lg:gap-x-7.5 mb-11">
                        <div>
                            <div className="text-ash-gray-500 text-xs lg:text-sm font-bold mb-2 lg:mb-4">
                                Token
                            </div>
                            <div className="bg-ash-dark-400/30 h-14 lg:h-18 px-6 flex items-center">
                                <div className="flex mr-2">
                                    <div className="w-4 h-4">
                                        <Image
                                            src={token0.icon}
                                            alt={`${token0.name} icon`}
                                            layout="responsive"
                                        />
                                    </div>
                                    <div className="w-4 h-4 -ml-1">
                                        <Image
                                            src={token1.icon}
                                            alt={`${token1.name} icon`}
                                            layout="responsive"
                                        />
                                    </div>
                                </div>
                                <div className="text-ash-gray-500 text-sm lg:text-lg font-bold">
                                    {lpName}
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
                                onChange={(e) => {
                                    const raw = e.target.value.trim();
                                    const amt = toWei(pool.lpToken, raw);
                                    setRawStakeAmt(raw);
                                    setUnStakeAmt(amt);
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
                                    {lpName}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="mb-28">
                        <Slider
                            className="ash-slider ash-slider-yellow my-0"
                            step={1}
                            marks={{
                                0: "",
                                25: "",
                                50: "",
                                75: "",
                                100: "",
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
                    <div>
                        <CardTooltip
                            content={
                                <div>
                                    While unstaking your LP-Token, you also
                                    harvest your ASH farmed by the percentage of
                                    the LP-Token that would be unstaked.
                                </div>
                            }
                        >
                            <div className="inline-block text-stake-gray-500 font-bold text-xs lg:text-sm mb-2 lg:mb-4 underline">
                                You also harvest your farm by Unstaking
                            </div>
                        </CardTooltip>
                        <div className="h-14 lg:h-18 pl-7 pr-4.5 flex items-center justify-between bg-ash-dark-400/30 text-ash-gray-600">
                            <div className="flex items-center">
                                <div className="bg-pink-600 w-4 h-4 rounded-full mr-2"></div>
                                <div className="text-sm lg:text-lg font-bold">
                                    ASH
                                </div>
                            </div>
                            <div className="text-sm lg:text-lg font-bold">
                                <TextAmt
                                    number={toEGLDD(
                                        ASH_TOKEN.decimals,
                                        rewardOnExit
                                    )}
                                    options={{ notation: "standard" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full sm:w-1/3 lg:w-[17.8125rem] flex-shrink-0 bg-stake-dark-500 py-[2.375rem] px-10">
                    <div className="text-white text-lg font-bold mb-16">
                        Estimated Decrease
                    </div>
                    <div className="flex flex-col space-y-11">
                        <div>
                            <div className="text-ash-gray-500 text-xs mb-2">
                                ASH earn per day
                            </div>
                            <div
                                className={`text-lg font-bold ${
                                    unStakeAmt.gt(0)
                                        ? "text-ash-gray-500 line-through"
                                        : "text-white"
                                }`}
                            >
                                <TextAmt
                                    number={toEGLDD(
                                        ASH_TOKEN.decimals,
                                        ashPerDay
                                    )}
                                    options={{ notation: "standard" }}
                                    decimalClassName={`${
                                        unStakeAmt.gt(0)
                                            ? ""
                                            : "text-stake-gray-500"
                                    }`}
                                />
                            </div>
                            {unStakeAmt.gt(0) && (
                                <div className="text-white text-lg font-bold">
                                    <TextAmt
                                        number={toEGLDD(
                                            ASH_TOKEN.decimals,
                                            afterUnstakeAshPerDay
                                        )}
                                        options={{ notation: "standard" }}
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="text-ash-gray-500 text-xs mb-2">
                                Emission APR
                            </div>
                            <div className="text-white text-lg font-bold">
                                {formatAmount(emissionAPR?.toNumber() || 0, {
                                    notation: "standard",
                                })}
                                %
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="sm:flex sm:space-x-8 lg:space-x-24">
                <div className="w-full mb-12 sm:mb-0 sm:flex-grow">
                    <Checkbox
                        checked={isAgree}
                        onChange={setIsAgree}
                        text={
                            <span className="text-ash-gray-500">
                                I verify that I have read the{" "}
                                <a
                                    href="https://docs.ashswap.io/testnet-guides/liquidity-staking"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <b className="text-white">
                                        <u>AshSwap Liquidity Staking Guide</u>
                                    </b>
                                </a>{" "}
                                and understand the risks of providing liquidity,
                                including impermanent loss.
                            </span>
                        }
                    />
                </div>
                <div className="w-full sm:w-1/3 lg:w-[17.8125rem] flex-shrink-0">
                    <div className="border-notch">
                        <button
                            className={`clip-corner-1 clip-corner-tl transition w-full h-12 flex items-center justify-center text-sm font-bold ${
                                canUnstake
                                    ? "bg-yellow-600 text-stake-dark-400"
                                    : "bg-ash-dark-500 text-white"
                            }`}
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
                        </button>
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
                <div className="flex-grow overflow-auto">
                    <UnstakeLPContent {...props} />
                </div>
            )}
        </BaseModal>
    );
}

export default UnstakeLPModal;
