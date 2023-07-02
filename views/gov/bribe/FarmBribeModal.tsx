import BaseModal, { BaseModalType } from "components/BaseModal";
import { useScreenSize } from "hooks/useScreenSize";
import React, { useCallback, useMemo, useState } from "react";
import ICChevronDown from "assets/svg/chevron-down.svg";
import ICChevronRight from "assets/svg/chevron-right.svg";
import BasePopover from "components/BasePopover";
import { FARMS, FARMS_MAP } from "const/farms";
import { POOLS_MAP_LP } from "const/pool";
import Avatar from "components/Avatar";
import { TOKENS, TOKENS_MAP } from "const/tokens";
import { IESDTInfo } from "helper/token/token";
import InputCurrency from "components/InputCurrency";
import GlowingButton from "components/GlowingButton";
import { useRecoilValue } from "recoil";
import { ashswapBaseState } from "atoms/ashswap";
import { tokenBalanceSelector, tokenMapState } from "atoms/tokensState";
import { formatAmount } from "helper/number";
import { TokenAmount } from "helper/token/tokenAmount";
import useAddRewardAmount from "hooks/useFarmBribeContract/useAddRewardAmount";
import useInputNumberString from "hooks/useInputNumberString";
import BigNumber from "bignumber.js";
import { Address, TokenTransfer } from "@multiversx/sdk-core/out";

type FarmBribeModalProps = {
    onCreateBribe?: (
        farmAddress: string,
        tokenPayments: TokenTransfer[]
    ) => void;
};
const FarmBribeContent = ({ onCreateBribe }: FarmBribeModalProps) => {
    const ashBase = useRecoilValue(ashswapBaseState);
    const [selectedFarmAddress, setSelectedFarm] = useState("");
    const [selectedTokenId, setSelectedTokenId] = useState("");
    const selectedTokenBalance = useRecoilValue(
        tokenBalanceSelector(selectedTokenId)
    );
    const [inputValue, setInputValue] = useState(new BigNumber(""));
    const [inputStr, setInputStr] = useInputNumberString(
        inputValue,
        TOKENS_MAP[selectedTokenId]?.decimals
    );
    const { addRewardAmount } = useAddRewardAmount();
    const tokenMap = useRecoilValue(tokenMapState);
    const pool = useMemo(() => {
        const lp = FARMS_MAP[selectedFarmAddress]?.farming_token_id;
        return POOLS_MAP_LP[lp];
    }, [selectedFarmAddress]);
    const searchFarms = useMemo(() => {
        return ashBase.farmController?.farms?.map((f) => f.address).join(",");
    }, [ashBase.farmController]);
    const farms = useMemo(() => {
        if (!searchFarms) return [];
        return FARMS.filter((f) => searchFarms.includes(f.farm_address));
    }, [searchFarms]);
    const isInsufficient = useMemo(() => {
        return selectedTokenBalance && inputValue.gt(selectedTokenBalance.egld);
    }, [selectedTokenBalance, inputValue]);
    const canCreateBribe = useMemo(() => {
        return (
            !!selectedTokenId &&
            !!selectedFarmAddress &&
            inputValue.gt(0) &&
            !isInsufficient
        );
    }, [selectedTokenId, selectedFarmAddress, inputValue, isInsufficient]);
    const createBribe = useCallback(async () => {
        if (!canCreateBribe) return;
        const tokenPayment = TokenTransfer.fungibleFromAmount(
            selectedTokenId,
            inputValue,
            TOKENS_MAP[selectedTokenId].decimals
        );
        await addRewardAmount(new Address(selectedFarmAddress), [tokenPayment]);
        onCreateBribe?.(selectedFarmAddress, [tokenPayment]);
    }, [
        canCreateBribe,
        selectedTokenId,
        selectedFarmAddress,
        inputValue,
        addRewardAmount,
        onCreateBribe,
    ]);

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
                            {selectedFarmAddress ? (
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
                                {farms.map((f) => {
                                    const tokens =
                                        POOLS_MAP_LP[f.farming_token_id].tokens;
                                    return (
                                        <li
                                            key={f.farm_address}
                                            className="relative"
                                        >
                                            <button
                                                className="flex items-center w-full py-3 text-left px-6 text-xs font-bold"
                                                onClick={() => {
                                                    setSelectedFarm(
                                                        f.farm_address
                                                    );
                                                    close();
                                                }}
                                            >
                                                <div className="flex mr-2">
                                                    {tokens.map((t) => (
                                                        <Avatar
                                                            key={t.identifier}
                                                            src={t.logoURI}
                                                            alt={t.name}
                                                            className="w-4 h-4 -ml-1 first:ml-0"
                                                        />
                                                    ))}
                                                </div>
                                                {tokens
                                                    .map((t) => t.symbol)
                                                    .join("-")}
                                            </button>
                                            {f.farm_address ===
                                                selectedFarmAddress && (
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
                                    {selectedTokenId ? (
                                        <>
                                            <div className="flex items-center">
                                                <Avatar
                                                    key={selectedTokenId}
                                                    src={
                                                        TOKENS_MAP[
                                                            selectedTokenId
                                                        ].logoURI
                                                    }
                                                    className={`w-4 h-4 mr-2`}
                                                />
                                                <div>
                                                    {
                                                        TOKENS_MAP[
                                                            selectedTokenId
                                                        ].symbol
                                                    }
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
                                        {ashBase.farmBribe?.whitelistTokens.map(
                                            (t) => {
                                                if (!t.id) return;
                                                const token = TOKENS_MAP[t.id];
                                                return (
                                                    <li
                                                        key={t.id}
                                                        className="relative"
                                                    >
                                                        <button
                                                            className="flex items-center w-full py-3 text-left px-6 text-xs font-bold"
                                                            onClick={() => {
                                                                setSelectedTokenId(
                                                                    t.id as string
                                                                );
                                                                setInputValue(
                                                                    new BigNumber(
                                                                        ""
                                                                    )
                                                                );
                                                                close();
                                                            }}
                                                        >
                                                            <Avatar src={token.logoURI} alt={token.name} className="w-4 h-4 mr-2"/>
                                                            {
                                                                token
                                                                    .symbol
                                                            }
                                                        </button>
                                                        {t.id ===
                                                            selectedTokenId && (
                                                            <span className="absolute w-[3px] h-5 bg-ash-cyan-500 top-1/2 -translate-y-1/2 left-0"></span>
                                                        )}
                                                    </li>
                                                );
                                            }
                                        )}
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
                            placeholder="0.00"
                            className="w-full h-18 px-7 outline-none bg-ash-dark-400 font-semibold text-lg text-white text-right placeholder:text-ash-gray-600"
                            decimals={TOKENS_MAP[selectedTokenId]?.decimals}
                            disabled={!selectedTokenId}
                            value={inputStr}
                            onChange={(e) => {
                                setInputStr(e.target.value);
                                setInputValue(new BigNumber(e.target.value));
                            }}
                        />
                        {selectedTokenId && selectedTokenBalance && (
                            <div className="mt-2 font-semibold text-xs text-right">
                                <span className="text-ash-gray-600">
                                    Balance:{" "}
                                </span>
                                <span
                                    className="text-cyan-500 cursor-pointer"
                                    onClick={() =>
                                        setInputValue(selectedTokenBalance.egld)
                                    }
                                >
                                    {formatAmount(
                                        selectedTokenBalance.egld.toNumber()
                                    )}{" "}
                                    {TOKENS_MAP[selectedTokenId].symbol}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="sm:flex justify-end">
                <GlowingButton
                    theme="pink"
                    className="w-full sm:w-72 h-12 font-bold text-sm text-white uppercase"
                    disabled={!canCreateBribe}
                    onClick={() => createBribe()}
                >
                    <span className="mr-2">Create bribe</span>
                    <ICChevronRight className="w-3 h-3" />
                </GlowingButton>
            </div>
        </div>
    );
};

function FarmBribeModal({
    onCreateBribe,
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
                    <FarmBribeContent onCreateBribe={onCreateBribe} />
                </div>
            </BaseModal>
        </>
    );
}

export default FarmBribeModal;
