import BasicLayout from "components/Layout/Basic";
import StakeLayout from "components/Layout/stake";
import React, { ReactElement, useState } from "react";
import LPStakeCard from "views/stake/LPStakeCard";
import MintStakeCard from "views/stake/MintStakeCard";
import VoteStakeCard from "views/stake/VoteStakeCard";
import ICChevronLeft from "assets/svg/chevron-left.svg";
import ICChevronRight from "assets/svg/chevron-right.svg";
import { useScreenSize } from "hooks/useScreenSize";

const Slide = ({
    children,
    active,
    isPrev,
    isNext,
}: {
    children: any;
    active: boolean;
    isPrev: boolean;
    isNext: boolean;
}) => {
    return (
        <div
            className={`transition ease-out duration-500 delay-75 w-full ${
                active ? "relative scale-100 z-[2]" : "absolute scale-90"
            } ${isNext && "translate-x-11 md:translate-x-12 z-[0]"} ${
                isPrev && "-translate-x-11 md:-translate-x-12 z-[1]"
            }`}
        >
            {children}
            {!active && (
                <div className="absolute inset-0 bg-black/30 clip-corner-tr-[14px] clip-corner-bevel"></div>
            )}
        </div>
    );
};
function StakePage() {
    const [activeIndex, setActiveIndex] = useState(1);
    const screenSize = useScreenSize();
    return (
        <div className="pb-36">
            <div className="ash-container py-9">
                <h2 className="text-[2rem] sm:text-5xl font-bold text-white mb-6 text-center">
                    Start your plan
                </h2>
                <div className="text-sm sm:text-lg font-bold text-[#B7B7D7] sm:text-white mb-14 text-center">
                    Stake là việc khóa lại các{" "}
                    <span className="underline">LP-Token</span> để tạo thêm lợi
                    nhuận
                </div>
                {screenSize.lg && (
                    <div className="grid grid-cols-3 gap-[1.875rem]">
                        <LPStakeCard />
                        <MintStakeCard />
                        <VoteStakeCard />
                    </div>
                )}
            </div>
            {!screenSize.lg && (
                <div className="flex">
                    <div className="relative mx-auto max-w-full">
                        <div className="flex space-x-1 justify-center mb-4">
                            <div
                                className={`transition-all ease-in-out duration-200 h-1 ${
                                    activeIndex === 0
                                        ? "w-4 bg-ash-cyan-500"
                                        : "w-1 bg-ash-gray-300"
                                }`}
                            ></div>
                            <div
                                className={`transition-all ease-in-out duration-200 h-1 ${
                                    activeIndex === 1
                                        ? "w-4 bg-stake-green-500"
                                        : "w-1 bg-ash-gray-300"
                                }`}
                            ></div>
                            <div
                                className={`transition-all ease-in-out duration-200 h-1 ${
                                    activeIndex === 2
                                        ? "w-4 bg-pink-600"
                                        : "w-1 bg-ash-gray-300"
                                }`}
                            ></div>
                        </div>
                        <div className="px-10">
                            <div className="relative transition-all flex w-[350px] sm:w-[400px] max-w-full">
                                <Slide
                                    active={activeIndex === 0}
                                    isPrev={activeIndex === 1}
                                    isNext={activeIndex === 2}
                                >
                                    <LPStakeCard />
                                </Slide>
                                <Slide
                                    active={activeIndex === 1}
                                    isPrev={activeIndex === 2}
                                    isNext={activeIndex === 0}
                                >
                                    <MintStakeCard />
                                </Slide>
                                <Slide
                                    active={activeIndex === 2}
                                    isPrev={activeIndex === 0}
                                    isNext={activeIndex === 1}
                                >
                                    <VoteStakeCard />
                                </Slide>
                            </div>
                        </div>
                        <button
                            className="absolute top-1/2 -translate-y-1/2 left-4 text-white z-10"
                            onClick={() =>
                                setActiveIndex((val) =>
                                    val - 1 >= 0 ? val - 1 : 2
                                )
                            }
                        >
                            <ICChevronLeft />
                        </button>
                        <button
                            className="absolute top-1/2 -translate-y-1/2 right-4 text-white z-10"
                            onClick={() =>
                                setActiveIndex((val) =>
                                    val + 1 <= 2 ? val + 1 : 0
                                )
                            }
                        >
                            <ICChevronRight />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

StakePage.getLayout = function getLayout(page: ReactElement) {
    return <StakeLayout>{page}</StakeLayout>;
};

export default StakePage;
