import React from "react";
import MetalCard from "./MetalCard";
import ImgMintGem from "assets/images/mint-gem.png";
import ImgMintStakeRisk from "assets/images/mint-stake-risk.png";
import Image from "components/Image";
import Link from "next/link";

function MintStakeCard() {
    return (
        <MetalCard gemImg={ImgMintGem}>
            <div>
                <div className="px-12">
                    <div className="text-stake-green-500 text-2xl font-bold h-[3.75rem] mt-14 mb-6">
                        Mint Stake
                    </div>
                    <div className="mb-12">
                        <div className="text-ash-gray-500 text-sm font-bold mb-3">
                            APR
                        </div>
                        <div className="text-stake-green-500 text-lg font-bold">
                            depend on your actions
                        </div>
                    </div>
                    <div className="mb-12">
                        <div className="text-ash-gray-500 text-sm font-bold mb-2">
                            RISK
                        </div>
                        <div className="flex items-center justify-between h-12">
                            <div className="text-lg font-bold">Medium</div>
                            <div>
                                <Image
                                    src={ImgMintStakeRisk}
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
                            Stake to{" "}
                            <span className="text-white underline font-bold">
                                mint $AOC
                            </span>
                            . You can both use AOC for continuous investing and
                            lock LP-Token to earn swap fee.
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
                <div className="px-9 py-8 flex space-x-2">
                    <button className="grow h-14 px-4 bg-ash-dark-400 text-center flex items-center justify-center text-white text-sm font-bold cursor-pointer">
                        More Details
                    </button>
                    <Link href="/stake/mint">
                        <button className="w-[5.75rem] h-14 px-4 bg-stake-green-500 text-center flex items-center justify-center text-ash-dark-400 text-sm font-bold">
                            Stake
                        </button>
                    </Link>
                </div>
            </div>
        </MetalCard>
    );
}

export default MintStakeCard;
