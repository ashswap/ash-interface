import React from "react";
import GovState from "views/stake/gov/GovRecoilState";
import StakeLayout from "./stake";

function GovLayout({ children }: any) {
    return (
        <StakeLayout>
            <GovState/>
            {children}
        </StakeLayout>
    );
}


export default GovLayout;
