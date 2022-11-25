import BaseModal from "components/BaseModal";
import { useScreenSize } from "hooks/useScreenSize";
import React, { useMemo, useState } from "react";
import ICBribe from "assets/svg/bribe.svg";
import ICChevronDown from "assets/svg/chevron-down.svg";
import ICChevronRight from "assets/svg/chevron-right.svg";
import ICLock from "assets/svg/lock.svg";
import BasePopover from "components/BasePopover";
import { FARMS, FARMS_MAP } from "const/farms";
import { POOLS_MAP_LP } from "const/pool";
import Avatar from "components/Avatar";
import { Slider } from "antd";
import { theme } from "tailwind.config";
import GlowingButton from "components/GlowingButton";
import OnboardTooltip from "components/Tooltip/OnboardTooltip";
import { useOnboarding } from "hooks/useOnboarding";
import CardTooltip from "components/Tooltip/CardTooltip";
import TextAmt from "components/TextAmt";

interface Props {
    open?: boolean;
    onClose?: () => void;
}
const FarmWeightVotingContent = ({ open, onClose }: Props) => {
    const [selectedFarm, setSelectedFarm] = useState(FARMS[0].farm_address);
    const [weight, setWeight] = useState(0);
    const [onboardingDAOFarmBribe, setOnboardedDAOFarmBribe] = useOnboarding(
        "dao_farm_weight_bribe"
    );
    const pool = useMemo(() => {
        const lp = FARMS_MAP[selectedFarm].farming_token_id;
        return POOLS_MAP_LP[lp];
    }, [selectedFarm]);
    return (
        <div className="px-6 lg:px-20 pb-12 overflow-auto relative">
            <div className="sm:flex sm:space-x-8 lg:space-x-24 mb-7">
                <div className="flex flex-col grow mb-16 lg:mb-0">
                    <div className="font-bold text-2xl text-white mb-14">
                        Voting Panel
                    </div>
                    <div className="mb-6">
                        <div className="font-bold text-sm text-stake-gray-500 mb-4">
                            Select a Pool to vote
                        </div>
                        <div className="flex items-center">
                            <div className="grow mr-8">
                                <BasePopover
                                    className="absolute text-white left-0 top-2 w-full overflow-auto bg-ash-dark-700 "
                                    options={{
                                        placement: "bottom-start",
                                        modifiers: [
                                            { options: { offset: [0, 8] } },
                                        ],
                                    }}
                                    button={() => (
                                        <div className="w-full h-18 px-7 flex items-center justify-between text-xs sm:text-lg font-bold text-stake-gray-500 bg-ash-dark-400 cursor-pointer">
                                            {selectedFarm ? (
                                                <>
                                                    <div className="flex items-center">
                                                        <div className="flex mr-2">
                                                            {pool.tokens.map(
                                                                (t, i) => (
                                                                    <Avatar
                                                                        key={
                                                                            t.identifier
                                                                        }
                                                                        src={
                                                                            t.logoURI
                                                                        }
                                                                        className={`w-4 h-4 ${
                                                                            i ===
                                                                            0
                                                                                ? ""
                                                                                : "-ml-1"
                                                                        }`}
                                                                    />
                                                                )
                                                            )}
                                                        </div>
                                                        <div>
                                                            {pool?.tokens
                                                                .map(
                                                                    (t) =>
                                                                        t.symbol
                                                                )
                                                                .join("-")}
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>Select farm to start</>
                                            )}
                                            <ICChevronDown className="w-2 h-auto ml-1" />
                                        </div>
                                    )}
                                >
                                    {({ close }) => {
                                        return (
                                            <ul className="py-6 max-h-52">
                                                {FARMS.map((f) => {
                                                    const [t1, t2] =
                                                        POOLS_MAP_LP[
                                                            f.farming_token_id
                                                        ].tokens;
                                                    return (
                                                        <li
                                                            key={f.farm_address}
                                                            className="relative"
                                                        >
                                                            <button
                                                                className="w-full py-3 text-left px-6 text-xs font-bold"
                                                                onClick={() => {
                                                                    setSelectedFarm(
                                                                        f.farm_address
                                                                    );
                                                                    close();
                                                                }}
                                                            >
                                                                {t1.symbol}-
                                                                {t2.symbol}
                                                            </button>
                                                            {f.farm_address ===
                                                                selectedFarm && (
                                                                <span className="absolute w-[3px] h-5 bg-ash-cyan-500 top-1/2 -translate-y-1/2 left-0"></span>
                                                            )}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        );
                                    }}
                                </BasePopover>
                            </div>
                            <div>
                                <OnboardTooltip
                                    placement="right"
                                    open={onboardingDAOFarmBribe}
                                    onArrowClick={() =>
                                        setOnboardedDAOFarmBribe(true)
                                    }
                                    content={
                                        <OnboardTooltip.Panel className="max-w-[14rem]">
                                            <div className="p-5 font-bold text-xs text-white">
                                                This{" "}
                                                <span className="text-stake-green-500">
                                                    farm bribed
                                                </span>{" "}
                                                has been activated!!{" "}
                                                <span className="text-stake-green-500">
                                                    Click
                                                </span>{" "}
                                                on it for more details!
                                            </div>
                                        </OnboardTooltip.Panel>
                                    }
                                >
                                    <CardTooltip
                                        autoPlacement
                                        content={<div className="w-52 p-4">
                                            <div className="font-bold text-lg leading-tight text-stake-gray-500 mb-5"><span className="text-pink-600">Vote</span> to earn rewards</div>
                                            <div className="mb-4">
                                                <div className="font-bold text-xs text-stake-gray-500 mb-2">Total treasure</div>
                                                <div className="text-white">
                                                    <span>$</span><TextAmt number={123.123} className="font-bold"/>
                                                </div>
                                            </div>
                                            <div className="px-3 py-2 bg-ash-dark-400">
                                                <div className="flex items-center font-bold text-2xs mb-2">
                                                    <ICLock className="w-3 h-3 mr-1"/>
                                                    <div className="underline">Lock reward</div>
                                                </div>
                                                <div className="font-bold text-xs text-white">03th Oct, 2022</div>
                                            </div>
                                        </div>}
                                    >
                                        <div>
                                            <ICBribe className="w-16 h-16 text-pink-600/80" />
                                        </div>
                                    </CardTooltip>
                                </OnboardTooltip>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="font-bold text-sm text-stake-gray-500 mb-4">
                            Vote power
                        </div>
                        <div className="h-18 px-7 flex items-center justify-end font-semibold text-lg bg-ash-dark-400 mb-4">
                            {(weight * 100) / 10000}%
                        </div>
                        <div>
                            <Slider
                                className="ash-slider ash-slider-pink my-0"
                                step={1}
                                marks={{
                                    "0": "",
                                    "2500": "",
                                    "5000": "",
                                    "7500": "",
                                    "10000": "",
                                }}
                                handleStyle={{
                                    backgroundColor:
                                        theme.extend.colors.pink[600],
                                    borderRadius: 0,
                                    border:
                                        "2px solid " +
                                        theme.extend.colors.pink[600],
                                    width: 7,
                                    height: 7,
                                }}
                                min={0}
                                max={10000}
                                value={weight}
                                tooltipVisible={false}
                                onChange={(e) => setWeight(e)}
                            />
                            <div className="flex justify-between mt-1">
                                <div className="text-xs lg:text-sm font-bold text-stake-gray-500">
                                    0%
                                </div>
                                <div className="text-xs lg:text-sm font-bold text-stake-gray-500">
                                    100%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full sm:w-1/3 lg:w-[17.8125rem] shrink-0 bg-stake-dark-500 py-[2.375rem] px-10">
                    <div className="font-bold text-lg text-white mb-14">
                        Estimated Increase
                    </div>
                    <div className="mb-10">
                        <div className="font-semibold text-xs text-stake-gray-500 mb-2">
                            Total vote on this Farm
                        </div>
                        <div className="font-bold text-lg text-stake-gray-500 mb-2 line-through">
                            158
                        </div>
                        <div className="font-bold text-lg text-white mb-2">
                            158
                        </div>
                    </div>
                    <div>
                        <div className="font-semibold text-xs text-stake-gray-500 mb-2">
                            Farm weight changes
                        </div>
                        <div className="font-bold text-lg text-stake-gray-500 mb-2 line-through">
                            158
                        </div>
                        <div className="font-bold text-lg text-white mb-2">
                            158
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-end">
                <div className="w-full sm:w-1/3 lg:w-[17.8125rem]">
                    <GlowingButton
                        theme="pink"
                        className="w-full h-12 flex items-center"
                    >
                        <span className="font-bold text-sm uppercase mr-2">
                            Vote
                        </span>
                        <ICChevronRight className="w-3 h-3" />
                    </GlowingButton>
                </div>
            </div>
        </div>
    );
};

function FarmWeightVotingModal({ open, onClose }: Props) {
    const screenSize = useScreenSize();
    return (
        <BaseModal
            isOpen={!!open}
            onRequestClose={() => onClose?.()}
            type={screenSize.isMobile ? "drawer_btt" : "modal"}
            className="clip-corner-4 clip-corner-tl bg-stake-dark-400 p-4 sm:w-screen sm:ash-container flex flex-col max-h-full"
        >
            <div className="flex justify-end mb-4">
                <BaseModal.CloseBtn />
            </div>
            <div className="grow overflow-auto">
                <FarmWeightVotingContent open={open} onClose={onClose} />
            </div>
        </BaseModal>
    );
}

export default FarmWeightVotingModal;
