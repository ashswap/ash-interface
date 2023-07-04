import StakeLayout from "components/Layout/stake";
import React, { ReactElement } from "react";
import ICArrowRight from "assets/svg/arrow-right.svg";
import MintStats from "views/stake/mint/MintStats";
import BasicLayout from "components/Layout/Basic";

function MintPage() {
    return (
        <div className="ash-container text-white pt-[1.875rem]">
            <ul className="flex space-x-1 mb-4 md:mb-[3.25rem] text-sm md:text-lg font-bold">
                <li>Stake</li>
                <li className="text-ash-gray-500">
                    <ICArrowRight className="inline mr-1" />
                    <span>Tokens</span>
                </li>
            </ul>
            <h1 className="text-stake-green-500 text-2xl md:text-5xl font-bold mb-7 md:mb-11">
                Mint Stake
            </h1>
            <MintStats />
        </div>
    );
}
MintPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <BasicLayout>
            <StakeLayout>{page}</StakeLayout>
        </BasicLayout>
    );
};
export default MintPage;
