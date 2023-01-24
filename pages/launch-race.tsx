import BasicLayout from "components/Layout/Basic";
import LaunchRaceLayout from "components/Layout/LaunchRace";
import MainnetLayout from "components/Layout/Mainnet";
import React, { memo, useEffect } from "react";
import RewardPoolOverview from "views/reward-pool/RewardPoolOverview";
import ImgBgRace from "assets/images/bg-race.png";
import ImgRaceheading from "assets/images/race-heading.png";
import ImgRacePrize from "assets/images/race-prize.png";
import Image from "components/Image";
import GlowingButton from "components/GlowingButton";
import { useRecoilValue } from "recoil";
import { accAddressState, accIsLoggedInState } from "atoms/dappState";
import Avatar from "components/Avatar";
import ImgAvatar from "assets/images/avatar.png";
import { useConnectWallet } from "hooks/useConnectWallet";
import ICWallet from "assets/svg/wallet.svg";
import useSWR from "swr";
import logApi from "helper/logHelper";
import { QuestUserStatsModel } from "interface/quest";
import { formatAmount } from "helper/number";
import CardTooltip from "components/Tooltip/CardTooltip";
const swrLogApi = (url: string) => logApi.get(url).then((res) => res.data);
const _RacePointTable = () => {
    const isLoggedIn = useRecoilValue(accIsLoggedInState);
    const address = useRecoilValue(accAddressState);
    const connectWallet = useConnectWallet();
    const { data } = useSWR<QuestUserStatsModel>(
        address ? `/api/v1/wallet` : null,
        swrLogApi
    );

    return (
        <>
            <div className="relative py-9 px-10 bg-stake-dark-400">
                <div className="mb-12 hidden sm:block">
                    {isLoggedIn ? (
                        <button className="w-40 h-10 bg-ash-dark-600 hover:bg-ash-dark-500 flex items-center justify-center text-white font-bold">
                            <Avatar
                                src={ImgAvatar}
                                alt="avatar"
                                className="w-4 h-4"
                            />
                            <span className="ml-2 mr-5">
                                {address.slice(0, 4) +
                                    "..." +
                                    address.slice(address.length - 4)}
                            </span>
                        </button>
                    ) : (
                        <button
                            className="clip-corner-1 clip-corner-br bg-pink-600 text-white w-40 h-10 flex items-center justify-center"
                            onClick={() => connectWallet()}
                        >
                            <ICWallet className="h-5 w-5 mr-2" />
                            <span className="text-xs font-bold">
                                Connect wallet
                            </span>
                        </button>
                    )}
                </div>
                <div className="mt-28 sm:mt-0 grid sm:grid-cols-3 gap-4">
                    <div>
                        <div className="mb-5 font-bold text-xs text-white">
                            Total Race Points
                        </div>
                        <div className="font-bold text-2xl text-ash-green-500">
                            {isLoggedIn
                                ? formatAmount(data?.wallet.race_point || 0, {
                                      notation: "standard",
                                      isInteger: true,
                                  })
                                : "_"}
                        </div>
                    </div>
                    <div>
                        <div className="mb-5 font-bold text-xs text-white">
                            Friends invited
                        </div>
                        <div className="font-bold text-2xl text-white">
                            {isLoggedIn
                                ? formatAmount(data?.wallet.user_invited || 0, {
                                      notation: "standard",
                                      isInteger: true,
                                  })
                                : "_"}
                        </div>
                    </div>
                    <div>
                        <CardTooltip
                            content={
                                <>
                                    When the person you refer stakes governance
                                    and owns at least 200 veASH, you will
                                    receive an additional 100 Race Point bonus.
                                </>
                            }
                        >
                            <div className="mb-5 font-bold text-xs text-white underline">
                                Friends stake
                            </div>
                        </CardTooltip>
                        <div className="font-bold text-2xl text-white">
                            {isLoggedIn
                                ? formatAmount(data?.wallet.user_staked || 0, {
                                      notation: "standard",
                                      isInteger: true,
                                  })
                                : "_"}
                        </div>
                    </div>
                </div>
                <div className="absolute -right-4 xl:-right-18 top-1/4 sm:top-1/3 lg:top-1/2 -translate-y-full w-56 sm:w-72 md:w-80 lg:w-[28rem] xl:w-[33rem]">
                    <Image
                        src={ImgRacePrize}
                        alt="race prize"
                        layout="responsive"
                    />
                </div>
            </div>
        </>
    );
};
const RacePointTable = memo(_RacePointTable);
function LaunchRacePage() {
    const isLoggedIn = useRecoilValue(accIsLoggedInState);
    const address = useRecoilValue(accAddressState);
    const connectWallet = useConnectWallet();
    return (
        <BasicLayout>
            <LaunchRaceLayout>
                <div className="overflow-hidden max-w-full md:overflow-visible mt-[-6.25rem] pt-[6.25rem]">
                    <div className="ash-container px-6 lg:px-0 pt-14 relative">
                        <div className="absolute -z-10 -top-[6.25rem] bottom-0 -left-32 md:left-0 -right-44 md:-right-[calc(50vw-50%-4px)] mix-blend-lighten">
                            <Image
                                src={ImgBgRace}
                                alt=""
                                layout="responsive"
                                className="object-cover"
                            />
                        </div>
                        <div className="w-1/2 max-w-[555px] pb-10 mb:pb-0 relative">
                            <Image
                                src={ImgRaceheading}
                                alt="ashswap launch race"
                                layout="responsive"
                            />
                        </div>
                    </div>
                </div>
                <div className="overflow-hidden xl:overflow-visible relative">
                    <div className="ash-container px-6 lg:px-0">
                        <div className="md:mt-6 flex flex-col md:flex-row md:space-x-7.5 lg:space-x-0 md:justify-between items-center md:items-start">
                            <div className="order-2 md:order-1 md:w-1/3">
                                <div className="mb-11 font-bold text-lg text-ash-green-500">
                                    More friends, more prize
                                </div>
                                <div className="flex flex-col max-w-[18rem] space-y-4">
                                    <a
                                        href="https://medium.com/@ashswap/ashswap-launch-race-4463e9b1f47"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <GlowingButton className="w-full h-16 xl:h-[5.5rem] bg-ash-purple-500 hover:colored-drop-shadow-xs hover:colored-drop-shadow-ash-purple-500/30 font-bold text-lg text-white">
                                            How to join?
                                        </GlowingButton>
                                    </a>
                                    <a href="https://devnet.ashswap.io/ashpoint">
                                        <GlowingButton className="w-full h-16 xl:h-[5.5rem] bg-ash-dark-600 font-bold text-lg text-white">
                                            Open Ashswap
                                        </GlowingButton>
                                    </a>
                                </div>
                            </div>
                            <div className="mb-10 mt-18 md:mb-0 order-1 md:order-2 w-full md:w-2/3 relative">
                                <RacePointTable />
                            </div>
                        </div>
                    </div>
                </div>
            </LaunchRaceLayout>
        </BasicLayout>
    );
}

export default LaunchRacePage;
