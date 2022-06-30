import BoostBar from "components/BoostBar";
import React, { useEffect, useMemo, useState } from "react";
import ICGovBoost from "assets/svg/gov-boost.svg";
import ICEqualSquare from "assets/svg/equal-square.svg";
import { IFarm } from "interface/farm";
import pools from "const/pool";
import Image from "next/image";
import { FARMS } from "const/farms";
import CardTooltip from "components/Tooltip/CardTooltip";
import GovVeASHStats from "../components/GovVeASHStats";
import Link from "next/link";
import useRouteModal from "hooks/useRouteModal";
import BoostCalcModal from "./BoostCalcModal";
import { useRouter } from "next/router";

const BoostBarValue = ({ value = 1 }: { value: number }) => {
    const MAX = 2.5;
    const MIN = 1;
    return (
        <BoostBar height={42} value={value} min={MIN} max={MAX}>
            <div className="flex items-center justify-between px-6 text-white h-full font-bold text-xs">
                {value >= MAX ? (
                    <div>Max</div>
                ) : (
                    <div className="flex items-center">
                        <span className="mr-1">x{value}</span>
                        <ICGovBoost className="-mt-0.5" />
                    </div>
                )}
                <div className="flex items-center">
                    <span className="mr-1">x2.5</span>
                    <ICGovBoost className="-mt-0.5" />
                </div>
            </div>
        </BoostBar>
    );
};

const FarmRecord = ({ farm }: { farm: IFarm }) => {
    const pool = useMemo(() => {
        return pools.find((p) => p.lpToken.id === farm.farming_token_id);
    }, [farm]);
    if (!pool) return null;
    const [token1, token2] = pool.tokens;
    return (
        <div className="flex">
            <div className="w-1/3">
                <div className="flex mb-2">
                    <div className="w-4 h-4 rounded-full overflow-hidden">
                        <Image
                            src={token1.icon}
                            alt={token1.name}
                            layout="responsive"
                        />
                    </div>
                    <div className="w-4 h-4 rounded-full overflow-hidden -ml-0.5">
                        <Image
                            src={token2.icon}
                            alt={token2.name}
                            layout="responsive"
                        />
                    </div>
                </div>
                <div className="text-stake-gray-500 text-xs font-bold">
                    {token1.name} {token2.name}
                </div>
            </div>
            <div className="w-2/3">
                <BoostBarValue value={1.75} />
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
            <div className="flex">
                <div className="bg-stake-dark-300 w-2/3 px-11 pt-[3.75rem] pb-8 mr-7.5">
                    <div className="text-2xl font-bold text-white mb-11">
                        Your boost status
                    </div>
                    <div className="flex text-xs font-bold mb-11">
                        <div className="text-stake-gray-500 w-1/3">
                            Your farms
                        </div>
                        <div className="flex justify-between w-2/3">
                            <div className="text-white underline">
                                Current boost
                            </div>
                            <div className="text-stake-gray-500 underline">
                                Max boost
                            </div>
                        </div>
                    </div>
                    <div className="space-y-7 mb-12">
                        {FARMS.map((f) => (
                            <FarmRecord key={f.farm_address} farm={f} />
                        ))}
                    </div>
                    <div>
                        <Link
                            href={{
                                pathname: "/stake/gov/boost",
                                query: {
                                    p: encode({
                                        farmAddress: FARMS[0].farm_address,
                                    }),
                                },
                            }}
                            shallow
                        >
                            <a>
                                <button className="h-12 px-6 bg-ash-dark-600 flex items-center">
                                    <ICEqualSquare className="w-3 h-3 text-pink-600 mr-2" />
                                    <span className="text-sm font-bold text-stake-gray-500">
                                        Calculate
                                    </span>
                                </button>
                            </a>
                        </Link>
                    </div>
                </div>
                <div className="bg-stake-dark-400 w-1/3 px-10 pt-[3.75rem] pb-8">
                    <div className="bg-ash-dark-400/30 px-4 py-5 mb-6">
                        <div className="px-5 mt-2 mb-7 uppercase underline text-stake-gray-500 font-bold text-sm">
                            Dream veash needed
                        </div>
                        <div className="flex items-center px-5">
                            <div className="w-4.5 h-4.5 rounded-full bg-ash-purple-500 mr-2"></div>
                            <span className="text-white text-lg font-bold">
                                0
                            </span>
                        </div>
                    </div>
                    <div className="bg-ash-dark-400/30 px-4 py-5">
                        {/* <div className="px-3 mt-2 mb-7 uppercase underline text-stake-gray-500 font-bold text-sm">YOUR veASH</div>
                    <div className="flex items-center px-3">
                        <div className="w-4.5 h-4.5 rounded-full bg-ash-purple-500 mr-2"></div>
                        <span className="text-white text-lg font-bold">0</span>
                    </div> */}
                        <div className="mt-2">
                            <GovVeASHStats />
                        </div>
                    </div>
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
