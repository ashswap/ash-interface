import StakeLayout from "components/Layout/stake";
import React, { ReactElement } from "react";
import ICArrowRight from "assets/svg/arrow-right.svg";
import GovStats from "views/stake/gov/GovStats";
import FarmsProvider from "context/farms";
import FarmStats from "views/stake/farm/FarmStats";
import FarmLayout from "views/stake/farm/FarmLayout";

function FarmsPage() {
    return (
        <FarmsProvider>
            <div className="ash-container text-white pt-[1.875rem]">
                <ul className="flex space-x-1 mb-4 md:mb-[3.25rem] text-sm md:text-lg font-bold">
                    <li>Stake</li>
                    <li className="text-ash-gray-500">
                        <ICArrowRight className="inline mr-1" />
                        <span>Liquidity Stake</span>
                    </li>
                </ul>
                <div className="flex justify-between">
                    <h1 className="text-ash-cyan-500 text-2xl md:text-5xl font-bold mb-7 md:mb-11">
                    Liquidity Stake - Farming
                    </h1>
                </div>
                <div className="mb-24">
                <FarmStats />
                </div>
                <FarmLayout/>
            </div>
        </FarmsProvider>
    );
}
FarmsPage.getLayout = function getLayout(page: ReactElement) {
    return <StakeLayout>{page}</StakeLayout>;
};
export default FarmsPage;
