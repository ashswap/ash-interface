import BoostBar, { BoostBarProps } from "components/BoostBar";
import React, { useEffect, useMemo, useState } from "react";
import ICGovBoost from "assets/svg/gov-boost.svg";
import ICEqualSquare from "assets/svg/equal-square.svg";
import ICHexagonDuo from "assets/svg/hexagon-duo.svg";
import ICChevronRight from "assets/svg/chevron-right.svg";
import { IFarm } from "interface/farm";
import pools from "const/pool";
import Image from "next/image";
import { ACTIVE_FARMS, FARMS } from "const/farms";
import CardTooltip from "components/Tooltip/CardTooltip";
import GovVeASHStats from "../components/GovVeASHStats";
import Link from "next/link";
import useRouteModal from "hooks/useRouteModal";
import BoostCalcModal from "./BoostCalcModal";
import { useRouter } from "next/router";
import Avatar from "components/Avatar";
import BaseButton from "components/BaseButton";
import GlowingButton from "components/GlowingButton";
import { useScreenSize } from "hooks/useScreenSize";

const BoostBarValue = (
    props: Omit<BoostBarProps, "min" | "max" | "height">
) => {
    const MAX = 2.5;
    const MIN = 1;
    const { isMobile } = useScreenSize();
    return (
        <BoostBar {...props} height={isMobile ? 36 : 42} min={MIN} max={MAX}>
            <div className="flex items-center justify-between px-6 text-white h-full font-bold text-xs">
                {(props.value || 1) >= MAX ? (
                    <div>Max</div>
                ) : (
                    <div className="flex items-center">
                        <span className="mr-1">x{props.value}</span>
                        <ICGovBoost className="-mt-0.5" />
                    </div>
                )}
                <div className="flex items-center">
                    <span className="mr-1">x{MAX}</span>
                    <ICGovBoost className="-mt-0.5" />
                </div>
            </div>
        </BoostBar>
    );
};

const FarmRecord = ({
    farm,
    isOwner,
    label,
}: {
    farm: IFarm;
    isOwner: boolean;
    label?: string;
}) => {
    const pool = useMemo(() => {
        return pools.find((p) => p.lpToken.id === farm.farming_token_id);
    }, [farm]);
    if (!pool) return null;
    const [token1, token2] = pool.tokens;
    const boostValue = 1.5;
    const newBoostValue = 1.7;
    return (
        <div className="grid grid-cols-[minmax(0,auto)_1fr] sm:grid-cols-[minmax(0,auto)_1fr_2fr] md:grid-cols-[minmax(0,auto)_7.5rem_minmax(9.75rem,1fr)_0.8fr_2fr] lg:grid-cols-[minmax(0,auto)_10.5rem_minmax(9.75rem,1fr)_1fr_2fr] items-center">
            <div className="relative mr-4">
                <ICHexagonDuo
                    className={`w-9 h-9 sm:w-12 sm:h-12 stroke-transparent ${
                        isOwner
                            ? "fill-ash-cyan-500 colored-drop-shadow-[0px_4px_25px] colored-drop-shadow-ash-cyan-500/25"
                            : "fill-stake-dark-500"
                    }`}
                />
                <div
                    className={`absolute inset-0 flex items-center justify-center underline font-bold text-lg ${
                        isOwner ? "text-ash-dark-600" : "text-stake-gray-500"
                    }`}
                >
                    {label ? label : isOwner ? "O" : "T"}
                </div>
                <div className="absolute flex bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2">
                    <Avatar
                        src={token1.icon}
                        alt={token1.name}
                        className="w-4 h-4"
                    />
                    <Avatar
                        src={token2.icon}
                        alt={token2.name}
                        className="w-4 h-4 -ml-0.5"
                    />
                </div>
            </div>
            <div className="hidden sm:block text-sm text-stake-gray-500 font-bold mr-2 truncate">
                {token1.symbol}-{token2.symbol}
            </div>
            <div className="hidden md:block space-y-2">
                <div className="text-white text-xs font-bold">
                    veASH consumes
                </div>
                <div
                    className={`text-right h-[2.625rem] ${
                        isOwner ? "bg-ash-dark-400/30" : "bg-stake-dark-500"
                    }`}
                ></div>
                <div className="text-right text-xs font-medium">
                    {isOwner ? (
                        <>
                            <span className="text-stake-gray-500 underline">
                                Available:{" "}
                            </span>
                            <span className="text-ash-cyan-500 underline">
                                3,987 veASH
                            </span>
                        </>
                    ) : (
                        <>&nbsp;</>
                    )}
                </div>
            </div>
            <div className="hidden md:block border-t border-dashed border-stake-gray-500 relative">
                <div className="absolute -right-1 -top-4.5 text-ash-gray-500 text-2xl">
                    &rsaquo;
                </div>
            </div>
            <div className={`${isOwner ? "" : "mb-6"}`}>
                <BoostBarValue
                    value={boostValue}
                    newVal={newBoostValue}
                    disabled={!isOwner}
                    veLine={isOwner}
                    topLabel
                />
            </div>
        </div>
    );
};
function GovBoostStatus() {
    const router = useRouter();
    const { encode, modalParams, showModal, onCloseModal } =
        useRouteModal("calc_boost");
    const [openCalc, setOpenCalc] = useState(false);
    useEffect(() => setOpenCalc(showModal), [showModal]);
    useEffect(() => console.log(modalParams), [modalParams]);
    return (
        <>
            <div className="bg-stake-dark-300 p-6 sm:px-11 sm:pb-8 sm:pt-14">
                <div className="text-white font-bold text-lg sm:text-2xl mb-14">
                    Your boost status
                </div>
                <div className="space-y-9">
                    {ACTIVE_FARMS.map((f) => (
                        <FarmRecord
                            key={f.farm_address}
                            farm={f}
                            isOwner={true}
                        />
                    ))}
                </div>
                <div className="bg-stake-dark-500 py-4 px-8 text-yellow-600 text-xs font-bold mt-12 mb-8">
                    Boosting system will automatically uses all of your veASH
                    for maximum boosting action.
                </div>
                <div className="flex sm:justify-end space-x-2">
                    <BaseButton className="h-12 w-12 shrink-0 sm:w-auto bg-ash-dark-400 px-1 sm:px-6 uppercase text-sm font-bold">
                        <ICEqualSquare className="text-white w-4.5 h-4.5" />
                        <span className="hidden sm:inline ml-1">Calculate</span>
                    </BaseButton>
                    <GlowingButton
                        theme="pink"
                        className="h-12 w-full px-2 sm:px-12 uppercase text-sm font-bold text-white overflow-hidden"
                        wrapperClassName="grow sm:grow-0 overflow-hidden"
                    >
                        <span className="mr-4 truncate">Confirm new boost</span>
                        <ICChevronRight className="w-2 h-auto" />
                    </GlowingButton>
                </div>
            </div>
            <div className="bg-ash-dark-600 p-6 sm:px-11 sm:py-14">
                <div className="space-y-9">
                    {ACTIVE_FARMS.map((f) => (
                        <FarmRecord
                            key={f.farm_address}
                            farm={f}
                            isOwner={false}
                        />
                    ))}
                </div>
            </div>
            <BoostCalcModal
                isOpen={showModal}
                onRequestClose={() => onCloseModal()}
                farmAddress={modalParams?.farmAddress}
            />
        </>
    );
}

export default GovBoostStatus;
