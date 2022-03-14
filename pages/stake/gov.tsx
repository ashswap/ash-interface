import StakeLayout from "components/Layout/stake";
import React, { ReactElement } from "react";
import ICArrowRight from "assets/svg/arrow-right.svg";
import GovStats from "views/stake/gov/GovStats";
import StakeGovProvider from "context/gov";

function GovPage() {
    return (
        <StakeGovProvider>
            <div className="ash-container text-white pt-[1.875rem]">
                <ul className="flex space-x-1 mb-4 md:mb-[3.25rem] text-sm md:text-lg font-bold">
                    <li>Stake</li>
                    <li className="text-ash-gray-500">
                        <ICArrowRight className="inline mr-1" />
                        <span>Governance Stake</span>
                    </li>
                </ul>
                <div className="flex justify-between">
                    <h1 className="text-pink-600 text-2xl md:text-5xl font-bold mb-7 md:mb-11">
                        Governance Stake
                    </h1>
                    <div className="hidden md:flex space-x-2">
                        <button className="bg-pink-600/20 text-pink-600 h-12 px-6 flex items-center justify-center">
                            Weekly Summary
                        </button>
                        <button className="bg-pink-600 text-white h-12 px-6 flex items-center justify-center">
                            Add/Manage Stake
                        </button>
                    </div>
                </div>
                <GovStats />
            </div>
        </StakeGovProvider>
    );
}
GovPage.getLayout = function getLayout(page: ReactElement) {
    return <StakeLayout>{page}</StakeLayout>;
};
export default GovPage;
