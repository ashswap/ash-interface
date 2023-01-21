import Image from "components/Image";
import React, { memo, useMemo } from "react";
import moment from "moment";
import { END_REWWARD_POOL, START_REWARD_POOL } from "const/mainnet";

function Header() {
    const timeline = useMemo(() => {
        return [START_REWARD_POOL, END_REWWARD_POOL].map(ts => moment.unix(ts).format("HH:mm Do MMM, YYYY")).join(' - ');
    }, []);
    return (
        <div className="ash-container">
            <div className="flex flex-col items-center text-center">
                <h1 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-5xl text-white">
                    ASH Staking
                </h1>
                <div className="relative flex items-center">
                    <div className="font-amaz text-5xl sm:text-6xl md:text-7xl lg:text-9xl xl:text-[150px] text-pink-600 leading-none">
                        Reward Pool
                    </div>
                </div>
                <div className="mt-10 mb-5 font-bold text-base sm:text-lg text-yellow-600">
                    {timeline}
                </div>
                <div className="font-bold text-base sm:text-3xl text-white text-left">
                 Stake ASH to win the cake! <br /> More ASH, more Reward
                </div>
            </div>
        </div>
    );
}

export default memo(Header);
