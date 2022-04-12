import { Slider } from "antd";
import Checkbox from "components/Checkbox";
import HeadlessModal, {
    HeadlessModalDefaultHeader,
} from "components/HeadlessModal";
import InputCurrency from "components/InputCurrency";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { theme } from "tailwind.config";
import LockPeriod from "./LockPeriod";
import ICChevronRight from "assets/svg/chevron-right.svg";
import { ASH_TOKEN, VE_ASH_DECIMALS } from "const/tokens";
import { useWallet } from "context/wallet";
import { toEGLD, toEGLDD, toWei } from "helper/balance";
import BigNumber from "bignumber.js";
import moment from "moment";
import { useStakeGov } from "context/gov";
import { fractionFormat } from "helper/number";
import { useScreenSize } from "hooks/useScreenSize";
import { useOnboarding } from "hooks/useOnboarding";
import Tooltip from "components/Tooltip";
import useMediaQuery from "hooks/useMediaQuery";
type props = {
    open: boolean;
    onClose: () => void;
};
const predefinedLockPeriod = [
    // test purpose
    { value: 1 / 48, label: "30 minutes" },
    { value: 7, label: "7 days" },
    { value: 30, label: "30 days" },
    { value: 365, label: "1 year" },
    { value: 365 * 2, label: "2 years" },
    { value: 365 * 3, label: "3 year" },
    { value: 365 * 4, label: "4 year" },
];
const maxLock = 4 * 365;
const minLock = 1 / 48;
const FirstStakeContent = ({ open, onClose }: props) => {
    const [lockPeriod, setLockPeriod] = useState(7);
    const [isAgree, setIsAgree] = useState(false);
    const { balances, insufficientEGLD } = useWallet();
    const { lockASH, estimateVeASH, totalSupplyVeASH } = useStakeGov();
    const ASHBalance = useMemo(() => balances[ASH_TOKEN.id], [balances]);
    const [lockAmt, setLockAmt] = useState<BigNumber>(new BigNumber(0));
    const [rawLockAmt, setRawLockAmt] = useState("");
    const [onboardingStakeGov, setOnboardedStakeGov] =
        useOnboarding("stake_gov_1st");
    const [openOnboardStakeTooltip, setOpenOnboardTooltip] = useState(false);
    const isTouchScreen = useMediaQuery("(hover: none)");
    const screenSize = useScreenSize();

    const setMaxLockAmt = useCallback(() => {
        setLockAmt(ASHBalance.balance);
        setRawLockAmt(
            toEGLD(ASH_TOKEN, ASHBalance.balance.toString()).toString(10)
        );
    }, [ASHBalance]);
    const insufficientASH = useMemo(() => {
        if (!ASHBalance) return true;
        return lockAmt.gt(ASHBalance.balance);
    }, [ASHBalance, lockAmt]);
    const canStake = useMemo(() => {
        return (
            !insufficientEGLD &&
            !insufficientASH &&
            lockAmt.gt(0) &&
            lockPeriod >= minLock &&
            lockPeriod <= maxLock &&
            isAgree
        );
    }, [insufficientEGLD, lockAmt, lockPeriod, isAgree, insufficientASH]);
    const lock = useCallback(async () => {
        const tx = await lockASH(
            lockAmt,
            lockPeriod === minLock
                ? new BigNumber(moment().add(30, "minutes").unix())
                : new BigNumber(moment().add(lockPeriod, "days").unix())
        );
        if (tx) {
            onClose();
        }
    }, [lockASH, lockAmt, lockPeriod, onClose]);
    const estimatedVeASH = useMemo(() => {
        return estimateVeASH(lockAmt, lockPeriod);
    }, [estimateVeASH, lockPeriod, lockAmt]);
    const fEstimatedVeASH = useMemo(() => {
        const num = toEGLDD(VE_ASH_DECIMALS, estimatedVeASH).toNumber();
        return num === 0
            ? "_"
            : fractionFormat(num, { maximumFractionDigits: num < 1 ? 8 : 2 });
    }, [estimatedVeASH]);
    const estimateCapacity = useMemo(() => {
        if (estimatedVeASH.eq(0)) return "_";
        const pct = estimatedVeASH
            .multipliedBy(100)
            .div(totalSupplyVeASH.plus(estimatedVeASH));
        return pct.lt(0.01) ? "< 0.01" : pct.toFixed(2);
    }, [estimatedVeASH, totalSupplyVeASH]);
    useEffect(() => {
        if (isTouchScreen) {
            setOpenOnboardTooltip(true);
        }
    }, [isTouchScreen]);
    return (
        <>
            <div className="mt-4 px-6 lg:px-20 pb-12 overflow-auto relative">
                <div className="text-pink-600 text-2xl font-bold mb-9 lg:mb-14">
                    Governance Stake
                </div>
                <div className="sm:flex sm:space-x-8 lg:space-x-24 mb-24">
                    <div className="flex flex-col flex-grow mb-16 lg:mb-0">
                        <div className="w-full flex sm:grid sm:grid-cols-2 sm:gap-x-4 lg:gap-x-7.5 mb-12">
                            <div className="w-1/3 sm:w-auto mr-5 sm:mr-0">
                                <div className="text-ash-gray-500 text-xs lg:text-sm font-bold mb-2 lg:mb-4">
                                    Token
                                </div>
                                <div className="bg-ash-dark-400/30 h-14 lg:h-18 px-4 lg:px-7 flex items-center">
                                    <div className="w-3.5 h-3.5 lg:w-7 lg:h-7 bg-pink-600 rounded-full mr-3"></div>
                                    <div className="text-white text-sm lg:text-lg font-bold">
                                        {ASH_TOKEN.name}
                                    </div>
                                </div>
                            </div>
                            <div className="w-2/3 sm:w-auto">
                                <div className="text-ash-gray-500 text-xs lg:text-sm font-bold mb-2 lg:mb-4">
                                    Input Amount
                                </div>
                                <InputCurrency
                                    className={`w-full text-white text-lg font-bold bg-ash-dark-400 h-14 lg:h-18 px-4.5 lg:px-6 flex items-center text-right outline-none border ${
                                        insufficientASH
                                            ? "border-ash-purple-500"
                                            : "border-transparent"
                                    }`}
                                    value={rawLockAmt}
                                    onChange={(e) => {
                                        const raw = e.target.value.trim();
                                        const lockAmt = toWei(ASH_TOKEN, raw);
                                        setRawLockAmt(raw);
                                        setLockAmt(lockAmt);
                                    }}
                                />
                                <div className="text-right text-2xs lg:text-xs mt-2">
                                    <span className="text-ash-gray-500">
                                        Balance:{" "}
                                    </span>
                                    <span
                                        className="text-earn cursor-pointer"
                                        onClick={() => setMaxLockAmt()}
                                    >
                                        {ASHBalance
                                            ? toEGLD(
                                                  ASH_TOKEN,
                                                  ASHBalance.balance.toString()
                                              ).toFixed(2)
                                            : "_"}{" "}
                                        {ASH_TOKEN.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Tooltip
                            open={onboardingStakeGov && openOnboardStakeTooltip}
                            onOpenChange={(val) =>
                                val && setOpenOnboardTooltip(onboardingStakeGov)
                            }
                            onArrowClick={() => {
                                if (openOnboardStakeTooltip) {
                                    setOpenOnboardTooltip(false);
                                    setOnboardedStakeGov(true);
                                }
                            }}
                            strategy={
                                screenSize.isMobile ? "absolute" : "fixed"
                            }
                            placement="bottom"
                            arrowStyle={() => ({ left: 56 })}
                            content={
                                <div
                                    style={{
                                        filter: screenSize.isMobile
                                            ? ""
                                            : "drop-shadow(0px 4px 50px rgba(0, 0, 0, 0.5))",
                                    }}
                                    className="sm:backdrop-blur-[30px]"
                                >
                                    <div className="clip-corner-4 clip-corner-bl bg-ash-dark-600 p-[1px] max-w-full sm:max-w-[23rem] backdrop-blur-[30px] sm:mx-6">
                                        <div className="clip-corner-4 clip-corner-bl bg-ash-dark-400 px-12 pt-14 pb-11">
                                            <div className="font-bold text-lg leading-tight mb-8">
                                                You cannot claim back your ASH
                                                until the lock duration ends.
                                            </div>
                                            <ul>
                                                <li className="text-sm font-bold">
                                                    <span className="text-stake-green-500">
                                                        1
                                                    </span>{" "}
                                                    ASH locked for{" "}
                                                    <span className="text-stake-green-500">
                                                        4 years
                                                    </span>{" "}
                                                    ={" "}
                                                    <span className="text-stake-green-500">
                                                        1
                                                    </span>{" "}
                                                    veASH
                                                </li>
                                                <li className="text-sm font-bold">
                                                    <span className="text-stake-green-500">
                                                        1
                                                    </span>{" "}
                                                    ASH locked for{" "}
                                                    <span className="text-stake-green-500">
                                                        3 years
                                                    </span>{" "}
                                                    ={" "}
                                                    <span className="text-stake-green-500">
                                                        0.75
                                                    </span>{" "}
                                                    veASH
                                                </li>
                                                <li className="text-sm font-bold">
                                                    <span className="text-stake-green-500">
                                                        1
                                                    </span>{" "}
                                                    ASH locked for{" "}
                                                    <span className="text-stake-green-500">
                                                        2 years
                                                    </span>{" "}
                                                    ={" "}
                                                    <span className="text-stake-green-500">
                                                        0.5
                                                    </span>{" "}
                                                    veASH
                                                </li>
                                                <li className="text-sm font-bold">
                                                    <span className="text-stake-green-500">
                                                        1
                                                    </span>{" "}
                                                    ASH locked for{" "}
                                                    <span className="text-stake-green-500">
                                                        1 year
                                                    </span>{" "}
                                                    ={" "}
                                                    <span className="text-stake-green-500">
                                                        0.25
                                                    </span>{" "}
                                                    veASH
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            }
                        >
                            <div>
                                <div className="text-sm underline font-bold text-ash-gray-500 mb-4">
                                    Lock period
                                </div>
                                <LockPeriod
                                    lockDay={lockPeriod}
                                    min={minLock}
                                    max={maxLock}
                                    options={predefinedLockPeriod}
                                    lockDayChange={(val) =>
                                        setLockPeriod(val > 0 ? val : minLock)
                                    }
                                />
                                <div className="overflow-hidden mt-8">
                                    <Slider
                                        className="ash-slider ash-slider-pink my-0"
                                        step={1}
                                        marks={{
                                            [minLock]: "",
                                            [maxLock / 4]: "",
                                            [maxLock / 2]: "",
                                            [(maxLock * 3) / 4]: "",
                                            [maxLock]: "",
                                        }}
                                        handleStyle={{
                                            backgroundColor:
                                                theme.extend.colors.pink[600],
                                            borderRadius: 0,
                                            border:
                                                "2px solid " +
                                                theme.extend.colors.pink[600],
                                            width: 7,
                                            height: 7,
                                        }}
                                        min={minLock}
                                        max={maxLock}
                                        value={lockPeriod}
                                        onChange={(e) => setLockPeriod(e)}
                                    />
                                    <div className="flex justify-between mt-1">
                                        <div className="text-xs lg:text-sm font-bold text-white">
                                            7 days
                                        </div>
                                        <div className="text-xs lg:text-sm font-bold text-pink-600">
                                            Max
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Tooltip>
                    </div>
                    <div className="w-full sm:w-1/3 lg:w-[17.8125rem] flex-shrink-0 bg-stake-dark-500 py-[2.375rem] px-10">
                        <div className="text-white text-lg font-bold mb-16">
                            Estimate Staking
                        </div>
                        <div className="flex flex-col space-y-11">
                            <div>
                                <div className="text-stake-gray-500 text-xs underline mb-2">
                                    VeASH Receive
                                </div>
                                <div className="text-white text-lg font-bold">
                                    {fEstimatedVeASH}
                                </div>
                            </div>
                            <div>
                                <div className="text-stake-gray-500 text-xs underline mb-2">
                                    Your capacity
                                </div>
                                <div className="text-white text-lg font-bold">
                                    {estimateCapacity}%
                                </div>
                            </div>
                            <div>
                                <div className="text-stake-gray-500 text-xs underline mb-2">
                                    Unlock Time
                                </div>
                                <div className="text-white text-lg font-bold min-h-[3rem]">
                                    {moment()
                                        .add(lockPeriod, "days")
                                        .format("DD MMM, yyyy")}
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
                                        href="https://docs.ashswap.io/testnet-guides/governance-staking"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <b className="text-white">
                                            <u>AshSwap Stake Guide</u>
                                        </b>
                                    </a>{" "}
                                    and understand the risks of providing
                                    liquidity, including impermanent loss.
                                </span>
                            }
                        />
                    </div>
                    <div className="w-full sm:w-[17.8125rem] flex-shrink-0">
                        <div className="border-notch">
                            <button
                                className={`clip-corner-1 clip-corner-tl transition w-full h-12 flex items-center justify-center text-sm font-bold text-white ${
                                    canStake ? "bg-pink-600" : "bg-ash-dark-500"
                                }`}
                                disabled={!canStake}
                                onClick={() => canStake && lock()}
                            >
                                {insufficientEGLD ? (
                                    "INSUFFICIENT EGLD BALANCE"
                                ) : insufficientASH ? (
                                    "INSUFFICIENT ASH BALANCE"
                                ) : (
                                    <div className="flex items-center">
                                        <div className="mr-2">STAKE</div>
                                        <ICChevronRight className="w-2 h-auto" />
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
function FirstStakeModal({ open, onClose }: props) {
    const { isMobile } = useScreenSize();
    return (
        <>
            <HeadlessModal
                open={open}
                onClose={() => onClose()}
                transition={`${isMobile ? "btt" : "center"}`}
            >
                <div className="bg-stake-dark-400 p-4 fixed bottom-0 inset-x-0 sm:static sm:mt-28 sm:ash-container flex flex-col max-h-full">
                    <HeadlessModalDefaultHeader onClose={() => onClose()} />
                    <FirstStakeContent open={open} onClose={onClose} />
                </div>
            </HeadlessModal>
        </>
    );
}

export default FirstStakeModal;
