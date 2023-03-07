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
            <div className="mt-20 lg:flex lg:space-x-7.5">
                <div className="w-full lg:w-1/3">
                    <h2 className="font-bold text-3xl text-stake-gray-500 leading-tight mb-6">
                        Get more for your votes
                    </h2>
                    <Input
                        className="w-full md:max-w-80 h-12 px-5"
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
                    <div className="font-bold text-2xl text-white my-20">
                        - or -
                    </div>
                    <GlowingButton
                        theme="cyan"
                        className="w-full sm:max-w-xs h-20 flex items-center justify-center font-bold text-lg text-ash-dark-400"
                        onClick={() => isLoggedIn ? setIsOpenBribe(true) : connectWallet()}
                    >
                        Create Bribe
                    </GlowingButton>
                </div>
                <Transition
                    show={displayFarms.length > 0}
                    className="mt-20 lg:mt-0 lg:w-2/3 grid md:grid-cols-2 gap-x-7.5 gap-y-14"
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
                {!displayFarms.length && <div className="lg:w-2/3 flex justify-center">
                        <div className="flex items-center justify-center pt-20 pb-28">
                            <div className="w-36">
                                <Image
                                    src={ImgASHSleep}
                                    alt="ash sleep"
                                    layout="responsive"
                                    className="mix-blend-luminosity"
                                />
                            </div>
                            <div className="text-lg font-bold text-stake-gray-500">
                                <div>Bribery does not exist.</div>
                            </div>
                        </div>
                    </div>}
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
