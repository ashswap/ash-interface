import Image from "components/Image";
import React, { memo, useMemo } from "react";
import ImgMainnetUSDCLeft from "assets/images/mainnet-usdc-left.png";
import moment from "moment";
import { END_REWWARD_POOL, START_REWARD_POOL } from "const/mainnet";

function Header() {
    const timeline = useMemo(() => {
        return [START_REWARD_POOL, END_REWWARD_POOL].map(ts => moment.unix(ts).format("Do MMM, YYYY")).join(' - ');
    }, []);
    return (
        <div className="ash-container">
            <div className="flex flex-col items-center text-center">
                <h1 className="font-bold text-5xl text-white">
                    Mainnet Staking Event
                </h1>
                <div className="relative flex items-center">
                    <div className="absolute -left-7 -translate-x-full w-20 lg:w-[89px]">
                        <Image
                            src={ImgMainnetUSDCLeft}
                            alt="usdc"
                            layout="responsive"
                        />
                    </div>
                    <div className="font-amaz lg:text-9xl xl:text-[150px] text-pink-600 leading-none">
                        Reward Pool
                    </div>
                </div>
                <div className="mt-10 mb-5 font-bold text-lg text-yellow-600">
                    {timeline}
                </div>
                <div className="font-bold text-3xl text-white text-left">
                Stake ASH - as many <br /> as you can - to win <br /> the cake!
                </div>
            </div>
        </div>
    );
}

export default memo(Header);
