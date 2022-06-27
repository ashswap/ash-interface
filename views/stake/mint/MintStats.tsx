import React, { useState } from "react";
import ICMinus from "assets/svg/minus.svg";
import ICPlus from "assets/svg/plus.svg";
import ImgUsdt from "assets/images/usdt-icon.png";
import Image from "next/image";
import ImgMintRisk from "assets/images/mint-stake-risk.png";
import MintAOCModal from "components/MintAOCModal";

const LPStat = () => {
    return (
        <div className="flex justify-between items-end">
            <div>
                <div className="flex items-center mb-4">
                    <div className="rounded-full overflow-hidden w-4 h-4">
                        <Image
                            src={ImgUsdt}
                            alt="token icon"
                            width={16}
                            height={16}
                        />
                    </div>
                    <div className="rounded-full overflow-hidden w-4 h-4 -ml-1">
                        <Image
                            src={ImgUsdt}
                            alt="token icon"
                            width={16}
                            height={16}
                        />
                    </div>
                    <div className="text-stake-gray-500 text-sm font-bold ml-1.5">
                        LP-USDTUSDC
                    </div>
                </div>
                <div className="text-lg">
                    <span className="text-stake-gray-500">$&nbsp;</span>
                    <span className="text-white font-bold">351,691,291.01</span>
                </div>
            </div>
            <div className="flex space-x-2">
                <button className="clip-corner-1 clip-corner-br bg-ash-dark-400 w-12 h-12 text-ash-purple-500 flex justify-center items-center">
                    <ICMinus />
                </button>
                <button className="clip-corner-1 clip-corner-bl bg-ash-dark-400 w-12 h-12 text-stake-green-500 flex justify-center items-center">
                    <ICPlus />
                </button>
            </div>
        </div>
    );
};
function MintStats() {
    const [openMint, setOpenMint] = useState(false);
    return (
        <>
            <div className="flex flex-col md:flex-row">
                <div className="md:w-[21.875rem] shrink-0 flex flex-col px-7 lg:px-9 pb-9 pt-7 lg:pt-14 bg-stake-dark-400 mb-4 md:mb-0 md:mr-[1.875rem]">
                    <h2 className="text-lg md:text-2xl mb-10 md:mb-11 font-bold text-white">
                        Your stats
                    </h2>
                    <div className="grow">
                        <div className="mb-10 md:mb-12">
                            <LPStat />
                        </div>
                        <div className="mb-10 md:mb-12">
                            <LPStat />
                        </div>
                        <div className="mb-10 md:mb-12">
                            <LPStat />
                        </div>
                    </div>
                    <button
                        className="bg-stake-green-500 w-full h-14 md:h-18 text-ash-dark-400 text-sm md:text-lg font-bold flex items-center justify-center text-center"
                        onClick={() => setOpenMint(true)}
                    >
                        Stake more LP
                    </button>
                </div>
                <div className="grow px-7 lg:px-16 pt-7 lg:pt-14 pb-9 bg-stake-dark-400">
                    <h2 className="text-lg md:text-2xl mb-10 md:mb-11 font-bold text-white">
                        Overall stats
                    </h2>
                    <div className="grid lg:grid-cols-2 gap-[1.875rem] mb-[6.75rem]">
                        <div className="bg-ash-dark-400/30 px-9 md:px-4 py-6">
                            <div className="text-stake-gray-500 mb-5 text-sm font-bold">
                                APR
                            </div>
                            <div className="text-lg font-bold text-stake-green-500">
                                Depend on your actions
                            </div>
                        </div>
                        <div className="bg-ash-dark-400/30 px-9 md:px-4 py-6">
                            <div className="text-stake-gray-500 mb-2 text-sm font-bold">
                                RISK
                            </div>
                            <div className="flex items-center justify-between -mr-4">
                                <div className="text-lg font-bold">Medium</div>
                                <Image
                                    src={ImgMintRisk}
                                    alt="mint risk"
                                    width={145}
                                    height={48}
                                />
                            </div>
                        </div>
                        <div className="bg-ash-dark-400/30 px-9 md:px-4 py-6">
                            <div className="text-stake-gray-500 mb-5 text-sm font-bold">
                                TOTAL VALUE OF LOCKED LP
                            </div>
                            <div className="text-lg">
                                <span className="text-stake-gray-500">
                                    $&nbsp;
                                </span>
                                <span className="text-white font-bold">
                                    51,691,291.012512
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="w-[15.875rem] max-w-full">
                        <div className="text-sm font-bold text-stake-gray-500 mb-4">
                            TIPS
                        </div>
                        <div className="text-sm">
                            Your{" "}
                            <span className="font-bold underline">
                                LP-Tokens
                            </span>{" "}
                            will automatically stake here after deposit
                            liquidity for farming. Just lie on the bed & watch
                            it farming!
                        </div>
                    </div>
                </div>
            </div>
            <MintAOCModal open={openMint} onClose={() => setOpenMint(false)} />
        </>
    );
}

export default MintStats;
