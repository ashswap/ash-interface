import React, { PropsWithChildren } from "react";
import ImgBgRacePrac from "assets/images/bg-race-prac.png";
import Image from "components/Image";
import ImgMLogo from "assets/images/m-logo.png";
import SvgLaunchRace from "assets/svg/launch-race.svg";
import Countdown from "components/Coundown";
import { LAUNCH_TS } from "const/mainnet";
function LaunchRaceLayout({ children }: PropsWithChildren<{}>) {
    return (
        <div className="relative min-h-screen">
            <div
                className="max-h-[83rem] absolute -z-10 inset-0 bg-right-top bg-no-repeat"
                style={{
                    backgroundImage: `url(${ImgBgRacePrac.src})`,
                    backgroundSize: "min(calc(50vw + 400px), 100vw)",
                }}
            ></div>
            <div className="absolute inset-0 top-[6.25rem] border-t border-t-[#33324A]">
                <div className="absolute inset-0 ash-container border-x border-x-[#33324A]">
                    <div className="absolute inset-0 left-1/3 border-l border-l-[#33324A]"></div>
                </div>
            </div>
            <div className="relative w-full">
                {/* <div className="relative z-10 h-[6.5rem] px-6 flex items-center justify-between">
                    <div className="flex items-center space-x-1 sm:space-x-4">
                        <div className="w-8 sm:w-10 h-auto">
                            <Image
                                src={ImgMLogo}
                                alt="ashswap logo"
                                className="responsive"
                            />
                        </div>
                        <SvgLaunchRace className="w-32 sm:w-52 h-auto" />
                    </div>
                    <div>
                        <div className="mb-0.5 font-bold text-sm text-white">Mainnet going live in...</div>
                        <Countdown timestamp={LAUNCH_TS} xs />
                    </div>
                </div> */}
                {/* <div className="relative"></div> */}
                {children}
            </div>
        </div>
    );
}

export default LaunchRaceLayout;
