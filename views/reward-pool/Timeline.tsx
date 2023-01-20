import { LAUNCH_TS, START_REWARD_POOL } from "const/mainnet";
import moment from "moment";
import React, { memo, useMemo } from "react";
import ImgBgMainnetPrac1 from "assets/images/bg-mainnet-prac1.png";
import Image from "components/Image";
import Heading from "./Heading";

function Timeline() {
    const startTime = useMemo(() => {
        return moment.unix(START_REWARD_POOL).format("Do MMM, YYYY");
    }, []);
    const endTime = useMemo(() => {
        return moment.unix(LAUNCH_TS).format("Do MMM, YYYY");
    }, []);
    return (
        <div className="py-40">
            <div className="relative flex">
                <div className="absolute inset-y-0 right-0 w-1/2 bg-yellow-600"></div>
                <div className="ash-container relative">
                    <div className="relative ml-20 sm:ml-40 md:ml-72 px-10 sm:px-24 lg:px-40 py-10 bg-yellow-600">
                        <div className="mb-4 lg:mb-10">
                            <div className="mb-0 lg:mb-4 font-bold text-base sm:text-lg lg:text-2xl text-ash-dark-600">
                                Stake Start__
                            </div>
                            <div className="flex items-start text-ash-dark-600">
                                <div className="font-bold text-sm sm:text-lg lg:text-2xl mr-1 sm:mr-3">
                                    {"//"}
                                </div>
                                <div className="font-bold text-xl sm:text-3xl lg:text-5xl">
                                    {startTime}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="mb-0 lg:mb-4 font-bold text-base sm:text-lg lg:text-2xl text-ash-dark-600">
                                Reward Distributes
                            </div>
                            <div className="flex items-start text-ash-dark-600">
                                <div className="font-bold text-sm sm:text-lg lg:text-2xl mr-1 sm:mr-3">
                                    {"//"}
                                </div>
                                <div className="font-bold text-xl sm:text-3xl lg:text-5xl">
                                    {endTime}
                                </div>
                            </div>
                        </div>
                        <div className="absolute -left-14 top-18 -translate-y-1/2 -translate-x-1/2 w-44 sm:w-60 md:w-72 lg:w-auto">
                            <Heading className="font-bold text-xl sm:text-3xl md:text-4xl lg:text-5xl text-ash-dark-600">
                                Timeline
                            </Heading>
                        </div>
                    </div>
                    <div className="absolute bottom-0 right-0 sm:right-7.5 w-20 sm:w-24 lg:w-auto">
                        <Image src={ImgBgMainnetPrac1} alt="bg" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(Timeline);
