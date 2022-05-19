import PoolCardItem from "components/PoolCardItem";
import { ViewType } from "components/PoolFilter";
import PoolListItem from "components/PoolListItem";
import StakedPoolCardItem from "components/StakedPoolCardItem";
import StakedPoolListItem from "components/StakedPoolListItem";
import { usePools } from "context/pools";
import IPool from "interface/pool";
import Link from "next/link";
import { useMemo } from "react";
import styles from "./ListPool.module.css";
import ImgAshSleep from "assets/images/ash-sleep.png";
import Image from "next/image";

interface Props {
    items: IPool[];
    className?: string | undefined;
    view?: ViewType;
}

const ListPool = (props: Props) => {
    const { poolToDisplay, stakedOnly, setStakedOnly } = usePools();

    const stakedPools = useMemo(() => {
        return poolToDisplay.filter((p) => !!p.liquidityData);
    }, [poolToDisplay]);
    const nonStakedPools = useMemo(() => {
        return poolToDisplay.filter((p) => !p.liquidityData);
    }, [poolToDisplay]);

    const firstUnstakePoolIndex = useMemo(() => {
        return poolToDisplay.findIndex((p) => !p.liquidityData);
    }, [poolToDisplay]);

    return (
        <div className={props.className}>
            {props.view === ViewType.Card ? (
                <>
                    <div className={`${styles.containerCard}`}>
                        {!stakedOnly &&
                            poolToDisplay.map((p, i) => {
                                return (
                                    <div key={p.pool.address}>
                                        {!!p.liquidityData ? (
                                            <StakedPoolCardItem poolData={p} />
                                        ) : (
                                            <PoolCardItem
                                                poolData={p}
                                                withTooltip={
                                                    firstUnstakePoolIndex === i
                                                }
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        {stakedOnly &&
                            stakedPools.map((p) => (
                                <StakedPoolCardItem
                                    key={p.pool.address}
                                    poolData={p}
                                />
                            ))}
                    </div>
                    {stakedOnly && stakedPools.length === 0 && (
                        <div>
                            <div className="p-4 sm:px-6 sm:py-3.5 bg-stake-dark-400 text-yellow-500 text-xs sm:text-sm font-bold sm:text-center mb-14 sm:mb-18">
                                <span>If you staked your LP tokens in a LP-Stake Farm, </span>
                                <Link href="/stake/farms"><a><span className="underline text-yellow-500">unstake</span></a></Link>
                                <span> them to see them here.</span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="text-lg sm:text-[2rem] font-bold text-ash-gray-600">Your phoenix is still sleeping</div>
                                <div className="w-36 sm:w-48 mb-3 sm:mb-4">
                                    <Image src={ImgAshSleep} alt="ash sleep" layout="responsive" className="mix-blend-luminosity"/>
                                </div>
                                <button className="clip-corner-1 clip-corner-br bg-pink-600 w-44 sm:w-56 h-12 sm:h-14 flex items-center justify-center text-center text-xs sm:text-sm font-bold" onClick={() => setStakedOnly(false)}>
                                    Add liquidity
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <>
                    {stakedPools?.length > 0 && (
                        <div className={`${styles.containerList} mb-2 md:mb-8`}>
                            <div
                                className={`flex items-center bg-ash-dark-600 text-text-input-3 h-12 text-2xs sm:text-xs border-b border-ash-dark-400`}
                            >
                                <div className="w-8/12 px-4 sm:px-11 flex items-center">
                                    <div className="flex-grow flex space-x-4">
                                        <div className="w-7/12 sm:w-1/2">
                                            #Pool
                                        </div>
                                        <div className="w-5/12 sm:w-1/4 text-right sm:text-left">
                                            Your Liquidity
                                        </div>
                                        <div className="hidden sm:block w-1/4">
                                            Your capacity
                                        </div>
                                    </div>
                                    <div className="hidden sm:block w-[7.25rem]"></div>
                                </div>
                                <div className="hidden sm:block w-4/12 pl-11 pr-1 border-l border-l-ash-gray-500">
                                    Total Farming
                                </div>
                                <div className="block sm:hidden w-4/12 text-right pr-4">
                                    Farming
                                </div>
                            </div>
                            {stakedPools.map((p, i) => {
                                return (
                                    <div
                                        key={p.pool.address}
                                        className={`${
                                            i % 2 === 0
                                                ? "bg-ash-dark-600"
                                                : "bg-black"
                                        }`}
                                    >
                                        <StakedPoolListItem poolData={p} />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {!stakedOnly && nonStakedPools?.length > 0 && (
                        <div className={`${styles.containerList}`}>
                            <div className="bg-ash-dark-600 px-4 lg:pl-11 lg:pr-3 text-2xs sm:text-xs border-b border-ash-dark-400">
                                <div
                                    className={`flex text-text-input-3 h-12 items-center w-full sm:w-[80%] space-x-1`}
                                >
                                    <div className="hidden sm:block w-3/12">
                                        Deposite
                                    </div>
                                    <div className="sm:hidden w-[45%]">
                                        #Pool
                                    </div>
                                    <div className="w-[18%] sm:w-2/12 text-white">
                                        Trading APR
                                    </div>
                                    <div className="hidden sm:block w-3/12">
                                        Emission APR
                                    </div>
                                    <div className="hidden sm:block w-2/12 text-right sm:mr-1">
                                        Total Liquidity
                                    </div>
                                    <div className="w-[37%] sm:w-2/12 text-right sm:mr-4">
                                        24H Volume
                                    </div>
                                </div>
                            </div>
                            {nonStakedPools.map((p, i) => {
                                return (
                                    <div
                                        key={p.pool.address}
                                        className={`${
                                            i % 2 === 0
                                                ? "bg-ash-dark-600"
                                                : "bg-black"
                                        }`}
                                    >
                                        <PoolListItem poolData={p} />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ListPool;
