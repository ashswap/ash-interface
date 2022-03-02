import StakeLayout from "components/Layout/stake";
import React, { ReactElement } from "react";
import ICArrowRight from "assets/svg/arrow-right.svg";
import MintStats from "views/stake/mint/MintStats";

function MintPage() {
    return (
        <div className="ash-container text-white">
            <ul className="flex space-x-1 mb-[3.25rem] text-lg font-bold">
                <li>Stake</li>
                <li className="text-ash-gray-500">
                    <ICArrowRight className="inline mr-1" />
                    <span>Tokens</span>
                </li>
            </ul>
            <h1 className="text-stake-green-500 text-5xl font-bold mb-11">Mint Stake</h1>
            <MintStats/>
        </div>
    );
}
MintPage.getLayout = function getLayout(page: ReactElement) {
    return <StakeLayout>{page}</StakeLayout>;
};
export default MintPage;
