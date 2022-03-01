import ICArrowRight from "assets/svg/arrow-right.svg";
import InfoLayout from "components/Layout/Info";
import React, { ReactElement } from "react";

function InfoPage() {
    return (
        <div>
            <div className="text-white py-7 max-w-6xl mx-auto px-6 sm:px-0">
                <ul className="flex space-x-1 text-xs mb-6">
                    <li>Dashboard</li>
                    <li className="text-ash-gray-500">
                        <ICArrowRight className="inline mr-1" />
                        <span>Overview</span>
                    </li>
                </ul>
                <div className="text-4xl font-bold">Overview</div>
                <div className="flex flex-wrap mx-[-1.125rem]">
                    <div className="w-full lg:w-[42%] px-[1.125rem]">
                        <div className="bg-ash-dark-600 h-80">Volumn chart</div>
                        <div className="bg-ash-dark-600 h-80">
                            Liquidity chart
                        </div>
                    </div>
                    <div className="w-full lg:w-[58%] px-[1.125rem]">
                        <div className="bg-ash-dark-600 h-80">
                            Trending grow chart
                        </div>
                    </div>
                </div>
                <div className="h-[2000px] w-full"></div>
            </div>
        </div>
    );
}

InfoPage.getLayout = function getLayout(page: ReactElement) {
    return <InfoLayout>{page}</InfoLayout>;
};

export default InfoPage;
