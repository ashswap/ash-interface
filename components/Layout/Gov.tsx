import React from "react";
import StakeLayout from "./stake";

function GovLayout({ children }: any) {
    return (
        <StakeLayout>
            {children}
        </StakeLayout>
    );
}


export default GovLayout;
