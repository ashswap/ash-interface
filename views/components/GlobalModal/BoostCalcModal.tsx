import { offset } from "@popperjs/core";
import ICChevronDown from "assets/svg/chevron-down.svg";
import ICGovBoost from "assets/svg/gov-boost.svg";
import { farmPoolQuery, farmQuery, farmRecordsState } from "atoms/farmsState";
import { govTotalSupplyVeASHSelector } from "atoms/govState";
import { poolStatsRefresherAtom } from "atoms/poolsState";
import BigNumber from "bignumber.js";
import Avatar from "components/Avatar";
import BaseModal, { BaseModalType } from "components/BaseModal";
import BasePopover from "components/BasePopover";
import BoostBar from "components/BoostBar";
import InputCurrency from "components/InputCurrency";
import CardTooltip from "components/Tooltip/CardTooltip";
import { POOLS_MAP_LP } from "const/pool";
import { ASH_TOKEN, VE_ASH_DECIMALS } from "const/tokens";
import { toEGLDD } from "helper/balance";
import { calcYieldBoost } from "helper/farmBooster";
import { formatAmount } from "helper/number";
import { estimateVeASH } from "helper/voteEscrow";
import useInputNumberString from "hooks/useInputNumberString";
import { useScreenSize } from "hooks/useScreenSize";
import { memo, useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";

const LOCK_OPTS_BOY = [
    { value: 2 * 7 * 24 * 3600, label: "2 weeks" },
    { value: 7 * 24 * 3600, label: "1 week" },
];
const LOCK_OPTS_MAIN = [
    { value: 4 * 365 * 24 * 3600, label: "4 years" },
    { value: 3 * 365 * 24 * 3600, label: "3 years" },
    { value: 2 * 365 * 24 * 3600, label: "2 years" },
    { value: 365 * 24 * 3600, label: "1 year" },
];
const LOCK_OPTS = LOCK_OPTS_MAIN;

const FarmDropdown = memo(function FarmDropdown({
    farmAddress,
    onChange,
}: {
    farmAddress: string;
    onChange: (val: string) => void;
}) {
    const pool = useRecoilValue(farmPoolQuery(farmAddress));
    const farmRecords = useRecoilValue(farmRecordsState);
    const activeAshFarms = useMemo(
        () => farmRecords.filter((f) => f.ashPerSec.gt(0)),
        [farmRecords]
    );
    return (
        <BasePopover
            className="absolute text-white left-0 top-2 w-max overflow-auto bg-ash-dark-700 "
            options={{
                placement: "bottom-start",
                modifiers: [{ ...offset, options: { offset: [0, 8] } }],
            }}
            button={() => (
                <div className="text-xs sm:text-sm font-bold text-stake-gray-500 cursor-pointer flex">
                    {pool ? (
                        <>{pool.tokens.map((t) => t.symbol).join(" - ")}</>
                    ) : (
                        <>Select farm to start</>
                    )}
                    <ICChevronDown className="w-2 h-auto ml-1" />
                </div>
            )}
        >
            {({ close }) => {
                return (
                    <ul className="py-6 max-h-[400px] overflow-auto">
                        {activeAshFarms.map((f) => {
                            const _pool = POOLS_MAP_LP[f.farm.farming_token_id];
                            return (
                                <li key={f.farm.farm_address} className="relative">
                                    <button
                                        className="w-full py-3 text-left px-6 text-xs font-bold"
                                        onClick={() => {
                                            onChange(f.farm.farm_address);
                                            close();
                                        }}
                                    >
                                        {_pool.tokens
                                            .map((t) => t.symbol)
                                            .join(" - ")}
                                    </button>
                                    {f.farm.farm_address === farmAddress && (
                                        <span className="absolute w-[3px] h-5 bg-ash-cyan-500 top-1/2 -translate-y-1/2 left-0"></span>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                );
            }}
        </BasePopover>
    );
});

type BoostCalcProps = { farmAddress?: string };
const BoostCalc = ({ farmAddress: farmAddressProp }: BoostCalcProps) => {
    const [farmAddress, setFarmAddress] = useState<string | undefined>(
        farmAddressProp
    );
    const [lpValue, setLpValue] = useState(new BigNumber(0));
    const [TVLExcludeOwnLPValue, setTVLExcludeOwnLPValue] = useState(
        new BigNumber(0)
    );
    const [totalCurrentVeASH, setTotalCurrentVeASH] = useState(
        new BigNumber(0)
    );
    const [ashInput, setAshInput] = useState(new BigNumber(0));
    const [isUserInput, setIsUserInput] = useState(false);
    const [selectedLock, setSelectedLock] = useState(LOCK_OPTS[0]);

    const farmData = useRecoilValue(farmQuery(farmAddress || ""));
    const veASHSupplyRecoil = useRecoilValue(govTotalSupplyVeASHSelector);
    const pool = useRecoilValue(farmPoolQuery(farmAddress || ""));

    const [lpValueStr, setLpValueStr] = useInputNumberString(lpValue);
    const [totalCurrentVeStr, setTotalCurrentVeStr] =
        useInputNumberString(totalCurrentVeASH);
    const [ashInputStr, setAshInputStr] = useInputNumberString(ashInput);

    useEffect(() => {
        setFarmAddress(farmAddressProp);
    }, [farmAddressProp]);

    const currentFarmSupplyWei = useMemo(() => {
        if (!farmData) return new BigNumber(0);
        return farmData.farmTokenSupply;
    }, [farmData]);

    const existFarmTokenBal = useMemo(() => {
        return (
            farmData?.stakedData?.farmTokens.reduce(
                (total, t) => total.plus(t.balance),
                new BigNumber(0)
            ) || new BigNumber(0)
        );
    }, [farmData]);

    const totalLPExcludeOwnLPWei = useMemo(() => {
        if (!farmData) return new BigNumber(0);
        return TVLExcludeOwnLPValue.multipliedBy(farmData.lpLockedAmt).div(
            farmData.totalLiquidityValue
        );
    }, [farmData, TVLExcludeOwnLPValue]);

    const lpWei = useMemo(() => {
        if (!farmData) return new BigNumber(0);
        return lpValue
            .multipliedBy(farmData.lpLockedAmt)
            .div(farmData.totalLiquidityValue);
    }, [lpValue, farmData]);

    const veForMaxBoost = useMemo(() => {
        return totalCurrentVeASH
            .multipliedBy(lpValue)
            .div(TVLExcludeOwnLPValue);
    }, [lpValue, totalCurrentVeASH, TVLExcludeOwnLPValue]);

    const maxYieldBoost = useMemo(() => {
        // if (veForMaxBoost.eq(0)) return 1;
        const totalLP = lpWei.plus(totalLPExcludeOwnLPWei);
        const boost = calcYieldBoost(
            lpWei,
            totalLP,
            veForMaxBoost.multipliedBy(10 ** VE_ASH_DECIMALS),
            totalCurrentVeASH
                .plus(veForMaxBoost)
                .multipliedBy(10 ** VE_ASH_DECIMALS),
            currentFarmSupplyWei,
            existFarmTokenBal
        );
        return boost;
    }, [
        lpWei,
        veForMaxBoost,
        totalLPExcludeOwnLPWei,
        totalCurrentVeASH,
        currentFarmSupplyWei,
        existFarmTokenBal,
    ]);

    const veAshInput = useMemo(() => {
        return toEGLDD(
            VE_ASH_DECIMALS,
            estimateVeASH(
                ashInput.multipliedBy(
                    new BigNumber(10).exponentiatedBy(VE_ASH_DECIMALS)
                ),
                selectedLock.value
            )
        );
    }, [ashInput, selectedLock]);

    const boost = useMemo(() => {
        return calcYieldBoost(
            lpWei,
            lpWei.plus(totalLPExcludeOwnLPWei),
            veAshInput.multipliedBy(10 ** VE_ASH_DECIMALS),
            totalCurrentVeASH
                .plus(veAshInput)
                .multipliedBy(10 ** VE_ASH_DECIMALS),
            currentFarmSupplyWei,
            existFarmTokenBal
        );
    }, [
        lpWei,
        totalLPExcludeOwnLPWei,
        veAshInput,
        totalCurrentVeASH,
        currentFarmSupplyWei,
        existFarmTokenBal,
    ]);

    const ashStakeMaxBoostArr = useMemo(() => {
        return [
            veForMaxBoost,
            veForMaxBoost.div(0.75),
            veForMaxBoost.div(0.5),
            veForMaxBoost.div(0.25),
        ].map((ash, i) => ({
            amt: ash.toNumber(),
            year: 4 - i,
        }));
    }, [veForMaxBoost]);

    // const ashStakeMaxBoostArr = useMemo(() => {
    //     return [veForMaxBoost, veForMaxBoost.div(0.5)].map((ash, i) => ({
    //         amt: ash.toNumber(),
    //         week: 2 - i,
    //     }));
    // }, [veForMaxBoost]);

    useEffect(() => {
        if (farmAddress && !isUserInput) {
            setLpValue(
                farmData?.stakedData?.totalStakedLPValue || new BigNumber(0)
            );
            setTVLExcludeOwnLPValue(
                farmData?.totalLiquidityValue.minus(
                    farmData?.stakedData?.totalStakedLPValue || new BigNumber(0)
                ) || new BigNumber(0)
            );
            setTotalCurrentVeASH(
                toEGLDD(VE_ASH_DECIMALS, veASHSupplyRecoil) || new BigNumber(0)
            );
        }
    }, [farmAddress, farmData, veASHSupplyRecoil, isUserInput]);

    useEffect(() => {
        setIsUserInput(false);
    }, [farmAddress]);

    return (
        <div className="px-2 sm:px-12 py-4">
            <div className="flex justify-between mb-14">
                <div className="shrink-0">
                    <div className="flex items-center mb-4">
                        {pool &&
                            pool.tokens.map((t) => {
                                return (
                                    <Avatar
                                        key={t.identifier}
                                        src={t.logoURI}
                                        alt={t.name}
                                        className="w-9 h-9 -ml-1 first:ml-0"
                                    />
                                );
                            })}
                    </div>
                    <FarmDropdown
                        farmAddress={farmAddress || ""}
                        onChange={(val) => setFarmAddress(val)}
                    />
                </div>
                <div className="text-right text-2xl font-bold text-white ml-4">
                    Calculate your boost
                </div>
            </div>

            <div className="flex">
                <div className="flex-grow">
                    <div className="w-3/4 sm:w-2/3 relative">
                        <div className="flex flex-col mb-4">
                            <div className="text-xs font-bold text-stake-gray-500 mb-2">
                                Your LP deposit value
                            </div>
                            <div className="relative">
                                <InputCurrency
                                    className="bg-ash-dark-400 text-right h-10 px-2 sm:px-7 text-stake-gray-500 outline-none text-sm w-full"
                                    placeholder="0"
                                    value={lpValueStr}
                                    decimals={pool?.lpToken.decimals || 0}
                                    onChange={(e) => {
                                        setIsUserInput(true);
                                        setLpValueStr(e.target.value);
                                        setLpValue(
                                            new BigNumber(e.target.value)
                                        );
                                    }}
                                />
                                <div className="absolute right-0 w-1/6 sm:w-1/4 border-t border-ash-gray-600 translate-x-full top-1/2"></div>
                            </div>
                        </div>
                        <div className="flex flex-col mb-4">
                            <div className="text-xs font-bold text-stake-gray-500 mb-2">
                                <CardTooltip
                                    content={
                                        <>
                                            Total volume locked of this farm in
                                            AshSwap platforms
                                        </>
                                    }
                                >
                                    <span className="underline">
                                        Total Farm liquidity
                                    </span>
                                </CardTooltip>
                            </div>
                            <div className="relative">
                                <InputCurrency
                                    className="bg-ash-dark-400 text-right h-10 px-2 sm:px-7 text-stake-gray-500 outline-none text-sm w-full disabled:cursor-not-allowed"
                                    placeholder="0"
                                    value={TVLExcludeOwnLPValue.toFixed(3)}
                                    disabled
                                />
                                <div className="absolute right-0 w-1/3 sm:w-1/2 border-t border-ash-gray-600 translate-x-full top-1/2">
                                    <div className="absolute -right-1 -top-4.5 text-ash-gray-600 text-2xl">
                                        &rsaquo;
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="text-xs font-bold text-stake-gray-500 mb-2">
                                Total veASH in platform
                            </div>
                            <div className="relative">
                                <InputCurrency
                                    className="bg-ash-dark-400 text-right h-10 px-2 sm:px-7 text-stake-gray-500 outline-none text-sm w-full"
                                    placeholder="0"
                                    value={totalCurrentVeStr}
                                    decimals={VE_ASH_DECIMALS}
                                    onChange={(e) => {
                                        setIsUserInput(true);
                                        setTotalCurrentVeStr(e.target.value);
                                        setTotalCurrentVeASH(
                                            new BigNumber(e.target.value || 0)
                                        );
                                    }}
                                />
                                <div className="absolute right-0 w-1/6 sm:w-1/4 border-t border-ash-gray-600 translate-x-full top-1/2"></div>
                            </div>{" "}
                        </div>
                        <div className="absolute top-11 bottom-5 right-0 w-1/6 sm:w-1/4 translate-x-full border-r border-ash-gray-600"></div>
                    </div>
                    <div className="w-1/3"></div>
                </div>
                <div className="w-32 sm:w-36 pl-1 flex flex-col justify-center text-right shrink-0">
                    <div className="relative z-10">
                        <div className="text-xs font-bold text-stake-gray-500 underline mb-2">
                            <CardTooltip
                                content={
                                    <>
                                        Max boost possible shows the maximum of
                                        boost that you can reach. It&apos;s not
                                        always be 2,5 times, go calculator or
                                        Boost Guide to learn more.
                                    </>
                                }
                            >
                                <span>Max boost possible</span>
                            </CardTooltip>
                        </div>
                        <BoostBar
                            height={40}
                            value={maxYieldBoost}
                            disabled
                            hiddenCurrentBar
                        >
                            <div className="px-4 h-full flex items-center justify-end text-lg font-bold text-stake-gray-500">
                                <span>x</span>
                                <span className="text-white">
                                    {formatAmount(maxYieldBoost)}
                                </span>
                                <ICGovBoost className="w-3.5 h-3.5 inline-block -mt-0.5 ml-1" />
                            </div>
                        </BoostBar>
                        <div className="absolute inset-x-0 -bottom-3.5 translate-y-full flex flex-col items-end">
                            <CardTooltip
                                content={
                                    <div className="text-xs text-white space-y-2">
                                        {ashStakeMaxBoostArr.map(
                                            ({ amt, year }) => {
                                                return (
                                                    <div key={year}>
                                                        {formatAmount(amt)} ASH
                                                        locked for {year}{" "}
                                                        <span className="text-stake-green-500">
                                                            year
                                                            {year > 1
                                                                ? "s"
                                                                : ""}
                                                        </span>
                                                    </div>
                                                );
                                            }
                                        )}
                                        {/* {ashStakeMaxBoostArr.map(
                                            ({ amt, week }) => {
                                                return (
                                                    <div key={week}>
                                                        {formatAmount(amt)} ASH
                                                        locked for {week}{" "}
                                                        <span className="text-stake-green-500">
                                                            week
                                                            {week > 1
                                                                ? "s"
                                                                : ""}
                                                        </span>
                                                    </div>
                                                );
                                            }
                                        )} */}
                                    </div>
                                }
                            >
                                <div className="text-xs font-bold text-pink-600 underline mb-2">
                                    veASH for max boost
                                </div>
                            </CardTooltip>
                            <div className="flex items-center text-pink-600">
                                <ICChevronDown className="w-2 h-auto mr-2" />
                                <span className="text-lg font-bold">
                                    {veForMaxBoost.isNaN()
                                        ? "invalid"
                                        : formatAmount(
                                              veForMaxBoost.toNumber()
                                          )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative h-10 mt-5 mb-3">
                <div className="absolute -top-3 right-1.5 h-full border-l border-ash-gray-600">
                    <div className="absolute -left-1 -bottom-1.5 text-ash-gray-600 text-sm">
                        &#x2304;
                    </div>
                </div>
            </div>
            <div className="flex items-end mb-16">
                <div className="flex-grow">
                    <div className="w-3/4 sm:w-2/3">
                        <div className="flex flex-col">
                            <div className="text-xs font-bold text-stake-gray-500 mb-2">
                                <CardTooltip
                                    content={
                                        <>
                                            ASH/veASH you will use for boost up
                                            your farm.
                                        </>
                                    }
                                >
                                    <span className="underline">
                                        ASH consumes for boost
                                    </span>
                                </CardTooltip>
                            </div>
                            <div className="relative">
                                <div className="flex items-center bg-ash-dark-400 h-10 pl-2">
                                    <BasePopover
                                        className="absolute text-white left-0 overflow-auto bg-ash-dark-700 w-full"
                                        options={{ placement: "bottom" }}
                                        button={() => (
                                            <div className="text-2xs font-bold text-stake-gray-500 bg-stake-gray-500/10 cursor-pointer flex items-center justify-between h-6 w-18 px-2">
                                                {selectedLock.label}
                                                <ICChevronDown className="w-2 h-auto ml-1" />
                                            </div>
                                        )}
                                    >
                                        {({ close }) => {
                                            return (
                                                <ul className="py-2">
                                                    {LOCK_OPTS.map((opt) => {
                                                        return (
                                                            <li
                                                                key={opt.value}
                                                                className="relative w-full"
                                                            >
                                                                <button
                                                                    className="w-full py-1 text-left px-3 text-2xs font-bold"
                                                                    onClick={() => {
                                                                        setSelectedLock(
                                                                            opt
                                                                        );
                                                                        close();
                                                                    }}
                                                                >
                                                                    {opt.label}
                                                                </button>
                                                                {opt.value ===
                                                                    selectedLock.value && (
                                                                    <span className="absolute w-[3px] h-5 bg-ash-cyan-500 top-1/2 -translate-y-1/2 left-0"></span>
                                                                )}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            );
                                        }}
                                    </BasePopover>
                                    <InputCurrency
                                        className="bg-transparent text-right h-10 px-2 sm:px-7 text-stake-gray-500 outline-none text-sm w-full"
                                        placeholder="0"
                                        value={ashInputStr}
                                        decimals={ASH_TOKEN.decimals}
                                        onChange={(e) => {
                                            setIsUserInput(true);
                                            setAshInputStr(e.target.value);
                                            setAshInput(
                                                new BigNumber(e.target.value)
                                            );
                                        }}
                                    />
                                </div>
                                <div className="absolute inset-x-0 -bottom-1 translate-y-full text-right text-xs font-semibold text-stake-gray-500">
                                    ~{formatAmount(veAshInput.toNumber())} veASH
                                </div>
                                <div className="absolute right-0 w-1/3 sm:w-1/2 border-t border-ash-gray-600 translate-x-full top-1/2">
                                    <div className="absolute -right-1 -top-4.5 text-ash-gray-600 text-2xl">
                                        &rsaquo;
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-32 sm:w-36 pl-1 flex flex-col justify-center text-right shrink-0">
                    <div className="text-xs font-bold text-stake-gray-500 underline mb-2">
                        Boost
                    </div>
                    <BoostBar
                        height={40}
                        value={0}
                        newVal={boost}
                        hiddenCurrentBar
                    >
                        <div className="px-4 h-full flex items-center justify-end text-lg font-bold text-stake-gray-500">
                            <span>x</span>
                            <span className="text-white">
                                {formatAmount(boost)}
                            </span>
                            <ICGovBoost className="w-3.5 h-3.5 inline-block -mt-0.5 ml-1" />
                        </div>
                    </BoostBar>
                </div>
            </div>
        </div>
    );
};
function BoostCalcModal({
    farmAddress,
    ...modalProps
}: BaseModalType & BoostCalcProps) {
    const screenSize = useScreenSize();
    const poolStatsRefresher = useRecoilValue(poolStatsRefresherAtom);
    useEffect(() => {
        if (modalProps.isOpen) {
            poolStatsRefresher?.();
        }
    }, [modalProps.isOpen, poolStatsRefresher]);
    return (
        <>
            <BaseModal
                {...modalProps}
                type={screenSize.isMobile ? "drawer_btt" : "modal"}
                className={`bg-stake-dark-400 text-white p-4 flex flex-col overflow-hidden max-h-full w-screen max-w-[40rem] mx-auto`}
            >
                <div className="flex justify-end mb-3.5">
                    <BaseModal.CloseBtn />
                </div>
                <div className="flex-grow overflow-auto">
                    <BoostCalc farmAddress={farmAddress} />
                </div>
            </BaseModal>
        </>
    );
}

export default BoostCalcModal;
