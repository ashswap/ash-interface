import PoolCardItem from "components/PoolCardItem";
import { ViewType } from "components/PoolFilter";
import PoolListItem from "components/PoolListItem";
import StakedPoolCardItem from "components/StakedPoolCardItem";
import StakedPoolListItem from "components/StakedPoolListItem";
import { usePools } from "context/pools";
import IPool from "interface/pool";
import { useMemo } from "react";
import styles from "./ListPool.module.css";

interface Props {
    items: IPool[];
    className?: string | undefined;
    view?: ViewType;
}

const ListPool = (props: Props) => {
    const { poolToDisplay, stakedOnly } = usePools();

    const stakedPools = useMemo(() => {
        return poolToDisplay.filter((p) => !!p.stakedData);
    }, [poolToDisplay]);
    const nonStakedPools = useMemo(() => {
        return poolToDisplay.filter((p) => !p.stakedData);
    }, [poolToDisplay]);

    return (
        <div className={props.className}>
            {props.view === ViewType.Card ? (
                <>
                    <div className={`${styles.containerCard}`}>
                        {!stakedOnly && poolToDisplay.map((p) => {
                            return (
                                <div key={p.pool.address}>
                                    {!!p.stakedData ? (
                                        <StakedPoolCardItem poolData={p} />
                                    ) : (
                                        <PoolCardItem poolData={p} />
                                    )}
                                </div>
                            );
                        })}
                        {stakedOnly && stakedPools.map(p => <StakedPoolCardItem key={p.pool.address} poolData={p}/>)}
                    </div>
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
