import { farmToDisplayState, farmViewTypeState } from "atoms/farmsState";
import { useScreenSize } from "hooks/useScreenSize";
import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import FarmCard from "./FarmCard";
import FarmFilter, { ViewType } from "./FarmFilter";
import FarmListLayoutContainer from "./FarmListLayoutContainer";
const FarmItems = () => {
    const viewType = useRecoilValue(farmViewTypeState);
    const farmToDisplay = useRecoilValue(farmToDisplayState);
    const screenSize = useScreenSize();

    return (
        <>
            {viewType === ViewType.Card ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-7.5 gap-y-16">
                    {farmToDisplay.map((p) => {
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
                        <FarmListLayoutContainer className="bg-stake-dark-400 text-text-input-3 h-12 text-2xs sm:text-xs border-b border-ash-dark-400 px-4 lg:px-10">
                            <div className="overflow-hidden">#Farm</div>
                            <div className="text-2xs sm:text-xs font-bold underline text-white">
                                {screenSize.md ? "Emission APR" : "E-APR"}
                            </div>
                            <div className="text-2xs sm:text-xs underline text-right pr-2.5 sm:pr-3.5">
                                {screenSize.md ? "Farm Boost" : "Boost"}
                            </div>
                            <div className="hidden md:block text-2xs sm:text-xs underline text-right">
                                ASH Earned
                            </div>
                            <div className="hidden md:block text-2xs sm:text-xs underline text-right">
                                LP-Staked
                            </div>
                            <div className="text-2xs sm:text-xs underline text-right">
                                Total Liquidity
                            </div>
                            <div className="hidden sm:block w-3.5 flex-shrink-0"></div>
                        </FarmListLayoutContainer>

                        {farmToDisplay.map((p, i) => {
                            return (
                                <div
                                    key={p.pool.address}
                                    className={`bg-stake-dark-400`}
                                >
                                    <FarmCard
                                        farmData={p}
                                        viewType={viewType}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </>
    );
};
function FarmLayout() {
    return (
        <div>
            <FarmFilter />
            <div className="mt-10">
                <FarmItems />
            </div>
        </div>
    );
}

export default FarmLayout;
