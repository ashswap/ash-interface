import BaseModal, { BaseModalType } from "components/BaseModal";
import { useScreenSize } from "hooks/useScreenSize";
import React, { useMemo, useState } from "react";
import ICChevronDown from "assets/svg/chevron-down.svg";
import ICChevronRight from "assets/svg/chevron-right.svg";
import BasePopover from "components/BasePopover";
import { FARMS, FARMS_MAP } from "const/farms";
import { POOLS_MAP_LP } from "const/pool";
import Avatar from "components/Avatar";
import { TOKENS } from "const/tokens";
import { IESDTInfo } from "helper/token/token";
import InputCurrency from "components/InputCurrency";
import GlowingButton from "components/GlowingButton";

const WHITELIST_TOKENS = TOKENS;
type FarmBribeModalProps = {};
const FarmBribeContent = ({}: FarmBribeModalProps) => {
    const [selectedFarm, setSelectedFarm] = useState("");
    const [selectedToken, setSelectedToken] = useState<IESDTInfo | undefined>();
    const pool = useMemo(() => {
        const lp = FARMS_MAP[selectedFarm]?.farming_token_id;
        return POOLS_MAP_LP[lp];
    }, [selectedFarm]);
    return (
        <div className="px-6 lg:px-12 pb-12 overflow-auto relative">
            <div className="font-bold text-2xl text-white mb-12">
                Create Bribe
            </div>
            <div className="font-bold text-sm text-stake-gray-500 mb-4">
                Select a Farm that you would like to offer rewards
            </div>
            <div className="min-h-[25rem]">
                <BasePopover
                    className="absolute text-white left-0 top-2 w-full max-h-72 overflow-auto bg-ash-dark-700 "
                    options={{
                        placement: "bottom-start",
                        modifiers: [
                            { name: "offset", options: { offset: [0, 8] } },
                        ],
                    }}
                    button={() => (
                        <div className="w-full h-18 px-7 flex items-center justify-between text-xs sm:text-lg font-bold text-stake-gray-500 bg-ash-dark-400 cursor-pointer">
                            {selectedFarm ? (
                                <>
                                    <div className="flex items-center">
                                        <div className="flex mr-2">
                                            {pool.tokens.map((t, i) => (
                                                <Avatar
                                                    key={t.identifier}
                                                    src={t.logoURI}
                                                    className={`w-4 h-4 ${
                                                        i === 0 ? "" : "-ml-1"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <div>
                                            {pool?.tokens
                                                .map((t) => t.symbol)
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
                                        POOLS_MAP_LP[f.farming_token_id].tokens;
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
                                                {t1.symbol}-{t2.symbol}
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
                <div className="grid grid-cols-2 gap-7.5 mt-8">
                    <div>
                        <div className="font-bold text-sm text-stake-gray-500 mb-4">
                            Reward Token
                        </div>
                        <BasePopover
                            className="absolute text-white left-0 top-2 w-full max-h-72 overflow-auto bg-ash-dark-700 "
                            options={{
                                placement: "bottom-start",
                                modifiers: [
                                    {
                                        name: "offset",
                                        options: { offset: [0, 8] },
                                    },
                                ],
                            }}
                            button={() => (
                                <div className="w-full h-18 px-7 flex items-center justify-between text-xs sm:text-lg font-bold text-stake-gray-500 bg-ash-dark-400 cursor-pointer">
                                    {selectedToken ? (
                                        <>
                                            <div className="flex items-center">
                                                <Avatar
                                                    key={
                                                        selectedToken.identifier
                                                    }
                                                    src={selectedToken.logoURI}
                                                    className={`w-4 h-4 mr-2`}
                                                />
                                                <div>
                                                    {selectedToken.symbol}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>Select token</>
                                    )}
                                    <ICChevronDown className="w-2 h-auto ml-1" />
                                </div>
                            )}
                        >
                            {({ close }) => {
                                return (
                                    <ul className="py-6 max-h-52">
                                        {WHITELIST_TOKENS.map((t) => {
                                            return (
                                                <li
                                                    key={t.identifier}
                                                    className="relative"
                                                >
                                                    <button
                                                        className="w-full py-3 text-left px-6 text-xs font-bold"
                                                        onClick={() => {
                                                            setSelectedToken(t);
                                                            close();
                                                        }}
                                                    >
                                                        {t.symbol}
                                                    </button>
                                                    {t.identifier ===
                                                        selectedToken?.identifier && (
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
                        <div className="font-bold text-sm text-stake-gray-500 mb-4">
                            Input Amount
                        </div>
                        <InputCurrency
                            placeholder="0"
                            className="w-full h-18 px-7 outline-none bg-ash-dark-400 font-semibold text-lg text-white text-right placeholder:text-ash-gray-600"
                        />
                        <div className="mt-2 font-semibold text-xs text-right">
                            <span className="text-ash-gray-600">Balance: </span>
                            <span className="text-cyan-500 cursor-pointer">
                                123.123 USDT
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="sm:flex justify-end">
                <GlowingButton
                    theme="pink"
                    className="w-full sm:w-72 h-12 font-bold text-sm text-white uppercase"
                >
                    <span className="mr-2">Create bribe</span>
                    <ICChevronRight className="w-3 h-3" />
                </GlowingButton>
            </div>
        </div>
    );
};

function FarmBribeModal({
    ...modalProps
}: BaseModalType & FarmBribeModalProps) {
    const screenSize = useScreenSize();
    return (
        <>
            <BaseModal
                {...modalProps}
                type={screenSize.isMobile ? "drawer_btt" : "modal"}
                className={`bg-stake-dark-400 text-white p-4 flex flex-col overflow-hidden max-h-full w-screen max-w-[40rem] mx-auto`}
            >
                <div className="flex justify-end mb-3.5">
                    <BaseModal.CloseBtn />
                </div>
                <div className="flex-grow overflow-auto">
                    <FarmBribeContent />
                </div>
            </BaseModal>
        </>
    );
}

export default FarmBribeModal;
