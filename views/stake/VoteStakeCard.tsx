import React from "react";
import MetalCard from "./MetalCard";
import ImgVoteGem from "assets/images/vote-gem.png";
import ImgVoteStakeRisk from "assets/images/vote-stake-risk.png";
import Image from "components/Image";

function VoteStakeCard() {
    return (
        <MetalCard gemImg={ImgVoteGem}>
            <div>
                <div className="px-12">
                    <div className="text-pink-600 text-2xl font-bold h-[3.75rem] mt-14 mr-10 mb-6">
                        Governance Stake
                    </div>
                    <div className="mb-12">
                        <div className="text-ash-gray-500 text-sm font-bold mb-3">
                            APR
                        </div>
                        <div className="text-pink-600 text-lg font-bold">
                            359%
                        </div>
                    </div>
                    <div className="mb-12">
                        <div className="text-ash-gray-500 text-sm font-bold mb-2">
                            RISK
                        </div>
                        <div className="flex items-center justify-between h-12">
                            <div className="text-lg font-bold">Low</div>
                            <div>
                                <Image
                                    src={ImgVoteStakeRisk}
                                    width={145}
                                    height={48}
                                    alt="risk"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="text-ash-gray-500 text-sm font-bold mb-4">
                            TIPS
                        </div>
                        <div className="text-ash-gray-500 text-sm leading-6 h-[8.5rem]">
                            Stake for Voting!
                        </div>
                    </div>
                </div>
                <div
                    className="h-0.5 blur-[2px]"
                    style={{
                        backgroundImage:
                            "radial-gradient(50% 50% at 50% 50%, rgba(183, 183, 215, 0.5) 0%, rgba(183, 183, 215, 0) 100%)",
                    }}
                ></div>
                <div className="px-9 py-8">
                    <button className="h-14 px-4 bg-ash-dark-400 text-center flex items-center justify-center text-white text-sm font-bold w-full">
                        Coming Soon
                    </button>
                </div>
            </div>
        </MetalCard>
    );
}

export default VoteStakeCard;
