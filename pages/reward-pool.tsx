import BasicLayout from "components/Layout/Basic";
import MainnetLayout from "components/Layout/Mainnet";
import React from "react";
import RewardPoolOverview from "views/reward-pool/RewardPoolOverview";

function RewardPoolPage() {
    return (
        <BasicLayout>
            <MainnetLayout>
                <RewardPoolOverview />
            </MainnetLayout>
        </BasicLayout>
    );
}

export default RewardPoolPage;
