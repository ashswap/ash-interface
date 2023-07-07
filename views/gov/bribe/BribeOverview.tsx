import { Transition } from "@headlessui/react";
import ICSearch from "assets/svg/search.svg";
import { ashswapBaseState } from "atoms/ashswap";
import GlowingButton from "components/GlowingButton";
import Image from "components/Image";
import Input from "components/Input";
import { TRANSITIONS } from "const/transitions";
import { useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { useDebounce } from "use-debounce";
import BribeCard from "./BribeCard";
import FarmBribeModal from "./FarmBribeModal";
import ImgASHSleep from "assets/images/ash-sleep.png";
import { useConnectWallet } from "hooks/useConnectWallet";
import { accIsLoggedInState } from "atoms/dappState";

function BribeOverview() {
    const [keyword, setKeyword] = useState("");
    const [debounceKeyword] = useDebounce(keyword, 500);
    const [isOpenBribe, setIsOpenBribe] = useState(false);
    const { farmBribe } = useRecoilValue(ashswapBaseState);
    const isLoggedIn = useRecoilValue(accIsLoggedInState);
    const connectWallet = useConnectWallet();

    const displayFarms = useMemo(() => {
        const lowercase = debounceKeyword.toLowerCase();
        return (
            (lowercase
                ? farmBribe?.farms.filter((f) =>
                      f.rewards.some((r) =>
                          r.tokenId.toLowerCase().includes(lowercase)
                      )
                  )
                : farmBribe?.farms) || []
        );
    }, [farmBribe, debounceKeyword]);

    return (
        <>
            <div className="mt-20">
                <div className="mb-14 sm:flex items-center justify-between gap-4">
                    <h2 className="mb-4 sm:mb-0 font-bold text-2xl text-stake-gray-500 leading-tight">
                        Get more for your votes
                    </h2>
                    <div className="shrink-0 flex gap-4">
                        <Input
                            className="grow md:min-w-[16rem] h-12 px-5"
                            backgroundClassName="bg-ash-dark-700"
                            textColorClassName="text-input-3"
                            placeholder="Search reward..."
                            type="text"
                            textAlign="left"
                            textClassName="font-normal text-xs md:text-sm"
                            suffix={<ICSearch />}
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value);
                            }}
                        />
                        <GlowingButton
                            theme="cyan"
                            className="shrink-0 lg:min-w-[10rem] h-12 px-4 clip-corner-1 clip-corner-br flex items-center justify-center font-bold text-sm text-ash-dark-400"
                            onClick={() =>
                                isLoggedIn
                                    ? setIsOpenBribe(true)
                                    : connectWallet()
                            }
                        >
                            Create Bribe
                        </GlowingButton>
                    </div>
                </div>
                <Transition
                    show={displayFarms.length > 0}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-7.5 gap-y-14"
                    {...TRANSITIONS.fadeIn}
                >
                    {displayFarms.map((f) => (
                        <Transition.Child
                            key={f.address}
                            {...TRANSITIONS.fadeZoomIn}
                        >
                            <BribeCard fbFarm={f} />
                        </Transition.Child>
                    ))}
                </Transition>
                {!displayFarms.length && (
                    <div className="flex justify-center">
                        <div className="flex items-center justify-center pt-20 pb-28">
                            <div className="w-36">
                                <Image
                                    src={ImgASHSleep}
                                    alt="ash sleep"
                                    className="w-full h-auto mix-blend-luminosity"
                                />
                            </div>
                            <div className="text-lg font-bold text-stake-gray-500">
                                <div>Bribery does not exist.</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <FarmBribeModal
                isOpen={isOpenBribe}
                onRequestClose={() => setIsOpenBribe(false)}
                onCreateBribe={() => setIsOpenBribe(false)}
            />
        </>
    );
}

export default BribeOverview;
