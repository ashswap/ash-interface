import Input from "components/Input";
import React, { useState } from "react";
import ICSearch from "assets/svg/search.svg";
import GlowingButton from "components/GlowingButton";
import BribeCard from "./BribeCard";
import { FARMS } from "const/farms";
import FarmBribeModal from "./FarmBribeModal";

function BribeOverview() {
    const [keyword, setKeyword] = useState("");
    const [isOpenBribe, setIsOpenBribe] = useState(false);
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
                        onClick={() => setIsOpenBribe(true)}
                    >
                        Create Bribe
                    </GlowingButton>
                </div>
                <div className="mt-20 lg:mt-0 lg:w-2/3 grid md:grid-cols-2 gap-x-7.5 gap-y-14">
                    {FARMS.map((f) => (
                        <BribeCard
                            key={f.farm_address}
                            farmAddress={f.farm_address}
                        />
                    ))}
                </div>
            </div>
            <FarmBribeModal
                isOpen={isOpenBribe}
                onRequestClose={() => setIsOpenBribe(false)}
            />
        </>
    );
}

export default BribeOverview;
