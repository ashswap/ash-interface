import GovLayout from "components/Layout/Gov";
import React from "react";
import GovMenu from "views/stake/gov/components/GovMenu";
import DAODetailWrapper from "views/stake/gov/dao/detail";

function DAODetailDyn({proposalID}: {proposalID: number}) {
    return (
        <GovLayout>
            <div className="ash-container text-white pt-[1.875rem]">
                <div className="mb-7">
                    <h1 className="text-pink-600 text-2xl md:text-5xl font-bold mb-7 md:mb-11">
                        <span className="text-white">Ashswap </span>Proposal
                    </h1>
                    <GovMenu />
                </div>
                <DAODetailWrapper proposalID={proposalID} />
            </div>
        </GovLayout>
    );
}

export default DAODetailDyn;
