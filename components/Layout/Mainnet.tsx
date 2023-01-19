import React, { PropsWithChildren } from "react";
import ImgBgMainnet from "assets/images/bg-mainnet.png";
function MainnetLayout({ children }: PropsWithChildren<{}>) {
    return (
        <div className="relative min-h-screen">
            <div
                className="absolute inset-0  bg-cover bg-top bg-no-repeat mt-52"
                style={{
                    backgroundImage: `url(${ImgBgMainnet.src})`,
                }}
            ></div>
            <div className="absolute inset-0 border-t border-t-[#33324A]">
                <div className="absolute inset-0 ash-container border-x border-x-[#33324A]">
                    <div className="absolute inset-0 left-1/3 border-l border-l-[#33324A]"></div>
                </div>
            </div>
            <div className="relative">{children}</div>
        </div>
    );
}

export default MainnetLayout;
