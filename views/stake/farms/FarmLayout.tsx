import { useFarms } from "context/farms";
import React, { useState } from "react";
import FarmCard from "./FarmCard";
import FarmFilter, { ViewType } from "./FarmFilter";

function FarmLayout() {
    const [viewType, setViewType] = useState<ViewType>(ViewType.Card);
    const { farmToDisplay: poolToDisplay, stakedOnly } = useFarms();

    return (
        <div>
            <FarmFilter
                viewType={viewType}
                onChangeViewType={(val) => setViewType(val)}
            />
            <div className="mt-10">
                {viewType === ViewType.Card ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-7.5 gap-y-16">
                        {poolToDisplay.map((p) => {
                            return (
                                <div key={p.pool.address}>
                                    <FarmCard farmData={p} viewType={viewType} />
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <>
                        <div className={`mb-2 md:mb-8`}>
                            <div
                                className={`flex items-center bg-stake-dark-400 text-text-input-3 h-12 text-2xs sm:text-xs border-b border-ash-dark-400 px-4 lg:px-10 space-x-2 lg:space-x-7.5`}
                            >
                                <div className="flex-grow overflow-hidden flex items-center space-x-2">
                                    <div className="flex-grow overflow-hidden">#Farm</div>
                                    <div className="flex-shrink-0 w-[18%] text-2xs sm:text-xs font-bold underline text-white">
                                        Emission APR
                                    </div>
                                    <div className="flex-shrink-0 w-1/5 lg:w-[18%] hidden md:block text-2xs sm:text-xs underline text-right">
                                        ASH Earned
                                    </div>
                                    <div className="flex-shrink-0 w-1/5 lg:w-[18%] hidden md:block text-2xs sm:text-xs underline text-right">
                                        LP-Staked
                                    </div>
                                    <div className="flex-shrink-0 w-1/3 md:w-1/5 lg:w-[18%] text-2xs sm:text-xs underline text-right">
                                        Total Liquidity
                                    </div>
                                </div>
                                <div className="hidden sm:block w-[11.5rem] lg:w-[13.5rem] flex-shrink-0"></div>
                            </div>

                            {poolToDisplay.map((p, i) => {
                                return (
                                    <div
                                        key={p.pool.address}
                                        className={`bg-stake-dark-400`}
                                    >
                                        <FarmCard farmData={p} viewType={viewType} />
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default FarmLayout;
