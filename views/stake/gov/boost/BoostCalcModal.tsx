import ICChevronDown from "assets/svg/chevron-down.svg";
import ICGovBoost from "assets/svg/gov-boost.svg";
import { accAddressState } from "atoms/dappState";
import { farmQuery } from "atoms/farmsState";
import {
    govTotalSupplyVeASH,
    govUnlockTSState,
    govVeASHAmtState
} from "atoms/govState";
import BigNumber from "bignumber.js";
import BaseModal, { BaseModalType } from "components/BaseModal";
import BasePopover from "components/BasePopover";
import BoostBar from "components/BoostBar";
import InputCurrency from "components/InputCurrency";
import { FARMS } from "const/farms";
import pools, { POOLS_MAP_LP } from "const/pool";
import { VE_ASH_DECIMALS } from "const/tokens";
import { toEGLDD } from "helper/balance";
import { formatAmount } from "helper/number";
import useGetSlopeUsed from "hooks/useFarmContract/useGetSlopeUsed";
import useInputNumberString from "hooks/useInputNumberString";
import { useScreenSize } from "hooks/useScreenSize";
import moment from "moment";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import FarmsState from "views/stake/farms/FarmsState";
const calcBoost = (
    lpAmt: BigNumber,
    totalLP: BigNumber,
    ve: BigNumber,
    totalVe: BigNumber
) => {
    const farmAmt = BigNumber.min(
        lpAmt
            .multipliedBy(0.4)
            .plus(totalLP.multipliedBy(0.6).multipliedBy(ve).div(totalVe)),
        lpAmt
    );
    const boost = farmAmt.div(lpAmt).div(0.4);
    return BigNumber.max(boost.isNaN() ? 1 : boost, 1);
};

const calcVeForMaxBoost = (
    lpAmt: BigNumber,
    totalLP: BigNumber,
    totalVe: BigNumber
) => {
    return totalVe.multipliedBy(lpAmt).div(totalLP);
};

const calcLockedASH = (ve: BigNumber, lockDuration: number) => {
    return ve.multipliedBy(4 * 365 * 24 * 3600).div(lockDuration);
}

const LockOptions = [
    { value: 4 * 365 * 24 * 3600, label: "4 years" },
    { value: 3 * 365 * 24 * 3600, label: "3 years" },
    { value: 2 * 365 * 24 * 3600, label: "2 years" },
    { value: 365 * 24 * 3600, label: "1 year" },
];

type BoostCalcProps = { farmAddress?: string };
const BoostCalc = ({ farmAddress: farmAddressProp }: BoostCalcProps) => {
    const [farmAddress, setFarmAddress] = useState<string | undefined>(
        farmAddressProp
    );
    const [lpValue, setLpValue] = useState(new BigNumber(0));
    const [TVL, setTVL] = useState(new BigNumber(0));
    const [totalVeASH, setTotalVeASH] = useState(new BigNumber(0));
    const [ownVeASH, setOwnVeASH] = useState(new BigNumber(0));
    const [slopeUsed, setSlopeUsed] = useState(new BigNumber(0));
    const [isUserInput, setIsUserInput] = useState(false);
    const [selectedLock, setSelectedLock] = useState(LockOptions[0]);

    const farmData = useRecoilValue(farmQuery(farmAddress || ""));
    const ownVeASHRecoil = useRecoilValue(govVeASHAmtState);
    const veASHSupplyRecoil = useRecoilValue(govTotalSupplyVeASH);
    const unlockTS = useRecoilValue(govUnlockTSState);
    const accAddress = useRecoilValue(accAddressState);

    const [lpValueStr, setLpValueStr] = useInputNumberString(lpValue);
    const [TVLStr, setTVLStr] = useInputNumberString(TVL);
    const [totalVeStr, setTotalVeStr] = useInputNumberString(totalVeASH);
    const [ownVeStr, setOwnVeStr] = useInputNumberString(ownVeASH);

    const getSlopeUsed = useGetSlopeUsed();

    useEffect(() => {
        setFarmAddress(farmAddressProp);
    }, [farmAddressProp]);

    useEffect(() => {
        if (!farmAddress) return;
        getSlopeUsed(farmAddress, accAddress).then((slope) =>
            setSlopeUsed(slope)
        );
    }, [farmAddress, accAddress, getSlopeUsed]);

    const unlockTSNum = useMemo(() => unlockTS.toNumber(), [unlockTS]);

    const veUsed = useMemo(() => {
        return slopeUsed.multipliedBy(unlockTSNum - moment().unix());
    }, [unlockTSNum, slopeUsed]);

    const veForMaxBoost = useMemo(() => {
        return calcVeForMaxBoost(lpValue, TVL, totalVeASH);
    }, [lpValue, TVL, totalVeASH]);

    const ashForMaxBoost = useMemo(() => {
        return calcLockedASH(veForMaxBoost, selectedLock.value);
    }, [veForMaxBoost, selectedLock.value]);

    useEffect(() => {
        if (farmAddress && !isUserInput) {
            setLpValue(
                farmData?.stakedData?.totalStakedLPValue || new BigNumber(0)
            );
            setTVL(farmData?.totalLiquidityValue || new BigNumber(0));
            setOwnVeASH(
                toEGLDD(VE_ASH_DECIMALS, ownVeASHRecoil.minus(veUsed)) ||
                    new BigNumber(0)
            );
            setTotalVeASH(
                toEGLDD(VE_ASH_DECIMALS, veASHSupplyRecoil) || new BigNumber(0)
            );
        }
    }, [
        farmAddress,
        farmData,
        veASHSupplyRecoil,
        ownVeASHRecoil,
        isUserInput,
        veUsed,
    ]);

    useEffect(() => {
        setIsUserInput(false);
    }, [farmAddress]);

    const boost = useMemo(
        () => calcBoost(lpValue, TVL, ownVeASH, totalVeASH),
        [lpValue, TVL, ownVeASH, totalVeASH]
    );
    const farm = useMemo(() => {
        return FARMS.find((f) => f.farm_address === farmAddress);
    }, [farmAddress]);
    const pool = useMemo(() => {
        if (!farm) return null;
        return pools.find((p) => p.lpToken.id === farm.farming_token_id)!;
    }, [farm]);
    const [token1, token2] = pool?.tokens || [];

    return (
        <div className="px-2 sm:px-12 py-4">
            <div className="flex justify-between mb-14">
                <div>
                    <div className="flex items-center mb-4">
                        {token1 && token2 ? (
                            <>
                                <div className="w-9 h-9">
                                    <Image
                                        src={token1?.icon}
                                        alt={token1?.name}
                                        layout="responsive"
                                    />
                                </div>
                                <div className="w-9 h-9 -ml-1">
                                    <Image
                                        src={token2?.icon}
                                        alt={token2?.name}
                                        layout="responsive"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-9 h-9 rounded-full bg-ash-dark-400"></div>
                                <div className="w-9 h-9 rounded-full bg-ash-dark-400 -ml-1"></div>
                            </>
                        )}
                    </div>
                    <BasePopover
                        className="absolute text-white left-0 mt-2 w-max overflow-auto bg-ash-dark-700 "
                        options={{ placement: "bottom-start" }}
                        button={() => (
                            <div className="text-sm font-bold text-stake-gray-500 cursor-pointer flex">
                                {pool ? (
                                    <>
                                        {token1?.symbol}-{token2?.symbol}
                                    </>
                                ) : (
                                    <>Select farm to start</>
                                )}
                                <ICChevronDown className="w-2 h-auto ml-1" />
                            </div>
                        )}
                    >
                        {({ close }) => {
                            return (
                                <ul className="py-6">
                                    {FARMS.map((f) => {
                                        const [t1, t2] =
                                            POOLS_MAP_LP[f.farming_token_id]
                                                .tokens;
                                        return (
                                            <li
                                                key={f.farm_address}
                                                className="relative"
                                            >
                                                <button
                                                    className="w-full py-3 text-left px-6 text-xs font-bold"
                                                    onClick={() => {
                                                        setFarmAddress(
                                                            f.farm_address
                                                        );
                                                        close();
                                                    }}
                                                >
                                                    {t1.symbol}-{t2.symbol}
                                                </button>
                                                {f.farm_address ===
                                                    farmAddress && (
                                                    <span className="absolute w-[3px] h-5 bg-ash-cyan-500 top-1/2 -translate-y-1/2 left-0"></span>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            );
                        }}
                    </BasePopover>
                </div>
                <div className="text-right"></div>
            </div>

            <div className="flex">
                <div className="flex-grow">
                    <div className="w-2/3 relative">
                        <div className="flex flex-col mb-4">
                            <div className="text-xs font-bold text-stake-gray-500 mb-2">
                                Your LP deposit value
                            </div>
                            <div className="relative">
                                <InputCurrency
                                    className="bg-ash-dark-400 text-right h-10 px-7 text-stake-gray-500 outline-none text-sm w-full"
                                    placeholder="0"
                                    value={lpValueStr}
                                    onChange={(e) => {
                                        setIsUserInput(true);
                                        setLpValueStr(e.target.value);
                                        setLpValue(
                                            new BigNumber(e.target.value)
                                        );
                                    }}
                                />
                                <div className="absolute right-0 w-1/4 border-t border-ash-gray-600 translate-x-full top-1/2"></div>
                            </div>
                        </div>
                        <div className="flex flex-col mb-4">
                            <div className="text-xs font-bold text-stake-gray-500 mb-2">
                                Total Farm liquidity
                            </div>
                            <div className="relative">
                                <InputCurrency
                                    className="bg-ash-dark-400 text-right h-10 px-7 text-stake-gray-500 outline-none text-sm w-full"
                                    placeholder="0"
                                    value={TVLStr}
                                    onChange={(e) => {
                                        setIsUserInput(true);
                                        setTVLStr(e.target.value);
                                        setTVL(new BigNumber(e.target.value));
                                    }}
                                />
                                <div className="absolute right-0 w-1/2 border-t border-ash-gray-600 translate-x-full top-1/2">
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
                                    className="bg-ash-dark-400 text-right h-10 px-7 text-stake-gray-500 outline-none text-sm w-full"
                                    placeholder="0"
                                    value={totalVeStr}
                                    onChange={(e) => {
                                        setIsUserInput(true);
                                        setTotalVeStr(e.target.value);
                                        setTotalVeASH(
                                            new BigNumber(e.target.value || 0)
                                        );
                                    }}
                                />
                                <div className="absolute right-0 w-1/4 border-t border-ash-gray-600 translate-x-full top-1/2"></div>
                            </div>{" "}
                        </div>
                        <div className="absolute top-11 bottom-5 right-0 w-1/4 translate-x-full border-r border-ash-gray-600"></div>
                    </div>
                    <div className="w-1/3"></div>
                </div>
                <div className="w-36 pl-1 flex flex-col justify-center text-right">
                    <div className="relative z-10">
                        <div className="text-xs font-bold text-stake-gray-500 underline mb-2">
                            Max boost possible
                        </div>
                        <BoostBar height={40} value={2.5} disabled>
                            <div className="px-4 h-full flex items-center justify-end text-lg font-bold text-stake-gray-500">
                                <span>x</span>
                                <span className="text-white">2.50</span>
                                <ICGovBoost className="w-3.5 h-3.5 inline-block -mt-0.5 ml-1" />
                            </div>
                        </BoostBar>
                        <div className="absolute inset-x-0 -bottom-3.5 translate-y-full flex flex-col items-end">
                            <div className="text-xs font-bold text-stake-gray-500 underline mb-2">
                                veASH for max boost
                            </div>
                            <div className="flex items-center text-pink-600">
                                <ICChevronDown className="w-2 h-auto mr-2" />
                                <span className="text-lg font-bold">
                                    {formatAmount(veForMaxBoost.toNumber())}
                                </span>
                            </div>
                            <div className="text-xs font-semibold text-stake-gray-500 mb-1 mt-2">
                                ~{formatAmount(ashForMaxBoost.toNumber())} ASH
                            </div>
                            <div className="flex items-center">
                                <div className="text-xs font-semibold text-stake-gray-500 mr-1">
                                    locked for
                                </div>
                                <BasePopover
                                    className="absolute text-white left-0 overflow-auto bg-ash-dark-700 w-full"
                                    options={{ placement: "bottom" }}
                                    button={() => (
                                        <div className="text-2xs font-bold text-stake-gray-500 bg-ash-dark-400 cursor-pointer flex items-center justify-between h-6 w-18 px-2">
                                            {selectedLock.label}
                                            <ICChevronDown className="w-2 h-auto ml-1" />
                                        </div>
                                    )}
                                >
                                    {({ close }) => {
                                        return (
                                            <ul className="py-2">
                                                {LockOptions.map((opt) => {
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative h-10 mt-16 mb-3">
                <div className="absolute -top-3 right-0 h-full border-l border-ash-gray-600">
                    <div className="absolute -right-1 -bottom-1.5 text-ash-gray-600 text-sm">
                        &#x2304;
                    </div>
                </div>
            </div>
            <div className="flex items-end mb-16">
                <div className="flex-grow">
                    <div className="w-2/3">
                        <div className="flex flex-col">
                            <div className="text-xs font-bold text-stake-gray-500 mb-2">
                                Your current veASH
                            </div>
                            <div className="relative">
                                <InputCurrency
                                    className="bg-ash-dark-400 text-right h-10 px-7 text-stake-gray-500 outline-none text-sm w-full"
                                    placeholder="0"
                                    value={ownVeStr}
                                    onChange={(e) => {
                                        setIsUserInput(true);
                                        setOwnVeStr(e.target.value);
                                        setOwnVeASH(
                                            new BigNumber(e.target.value)
                                        );
                                    }}
                                />
                                <div className="absolute right-0 w-1/2 border-t border-ash-gray-600 translate-x-full top-1/2">
                                    <div className="absolute -right-1 -top-4.5 text-ash-gray-600 text-2xl">
                                        &rsaquo;
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-36 pl-1 flex flex-col justify-center text-right">
                    <div className="text-xs font-bold text-stake-gray-500 underline mb-2">
                        Boost
                    </div>
                    <BoostBar
                        height={40}
                        value={0}
                        newVal={boost.toNumber()}
                        hiddenCurrentBar
                    >
                        <div className="px-4 h-full flex items-center justify-end text-lg font-bold text-stake-gray-500">
                            <span>x</span>
                            <span className="text-white">
                                {formatAmount(boost.toNumber())}
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
    return (
        <>
            {/* TODO: replace fetching farm state with whole new app state from service latter */}
            {modalProps.isOpen && <FarmsState />}
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
