import { TokenTransfer } from "@multiversx/sdk-core/out";
import ICBribe from "assets/svg/bribe.svg";
import ICChevronRight from "assets/svg/chevron-right.svg";
import { accIsLoggedInState } from "atoms/dappState";
import { tokenBalanceSelector } from "atoms/tokensState";
import BigNumber from "bignumber.js";
import Avatar from "components/Avatar";
import BaseModal from "components/BaseModal";
import GlowingButton from "components/GlowingButton";
import InputCurrency from "components/InputCurrency";
import { TOKENS_MAP } from "const/tokens";
import { formatAmount } from "helper/number";
import { useConnectWallet } from "hooks/useConnectWallet";
import useDBCreateBribe from "hooks/useDAOBribeContract/useDBCreateBribe";
import useInputNumberString from "hooks/useInputNumberString";
import { useCallback, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import DAODropdown from "../components/DAODropdown";
import { IN_POOL_TOKENS } from "const/pool";

type Props = {
    proposalID: number;
};
function DAOCreateBribe({ proposalID }: Props) {
    const isLoggedIn = useRecoilValue(accIsLoggedInState);
    const connectWallet = useConnectWallet();
    const [isOpenModal, setIsOpenModal] = useState(false);

    const [selectedTokenId, setSelectedTokenId] = useState("");
    const selectedTokenBalance = useRecoilValue(
        tokenBalanceSelector(selectedTokenId)
    );
    const [inputValue, setInputValue] = useState(new BigNumber(""));
    const [inputStr, setInputStr] = useInputNumberString(
        inputValue,
        TOKENS_MAP[selectedTokenId]?.decimals
    );
    const { dbCreateBribe } = useDBCreateBribe();
    const isInsufficient = useMemo(() => {
        return selectedTokenBalance && inputValue.gt(selectedTokenBalance.egld);
    }, [selectedTokenBalance, inputValue]);
    const canCreateBribe = useMemo(() => {
        return !!selectedTokenId && inputValue.gt(0) && !isInsufficient;
    }, [selectedTokenId, inputValue, isInsufficient]);

    const onCreateBribe = useCallback(async () => {
        const token = TOKENS_MAP[selectedTokenId];
        if (!token) return;
        await dbCreateBribe(proposalID, [
            TokenTransfer.fungibleFromAmount(
                token.identifier,
                inputValue,
                token.decimals
            ),
        ]);
        setIsOpenModal(false);
    }, [dbCreateBribe, inputValue, proposalID, selectedTokenId]);
    return (
        <div>
            <div className="px-9 py-10 bg-stake-dark-300">
                <div className="mb-6 font-bold text-2xl text-white">
                    Add more reward to Bribe
                </div>
                <div className="font-bold text-xs text-stake-gray-500">
                    to attract more{" "}
                    <span className="text-stake-green-500">[Approve Vote]</span>{" "}
                    on this proposal
                </div>
                {isLoggedIn ? (
                    <GlowingButton
                        theme="pink"
                        className="mt-16 w-full h-18 font-bold text-sm text-white uppercase"
                        onClick={() => setIsOpenModal(true)}
                    >
                        <ICBribe className="mr-3 w-7 h-auto" />
                        <span>Add reward to bribe</span>
                    </GlowingButton>
                ) : (
                    <GlowingButton
                        theme="pink"
                        className="mt-16 w-full h-18 font-bold text-sm text-white uppercase"
                        onClick={connectWallet}
                    >
                        Connect Wallet
                    </GlowingButton>
                )}
            </div>
            <BaseModal
                isOpen={isOpenModal}
                onRequestClose={() => setIsOpenModal(false)}
                className={`bg-stake-dark-400 text-white p-4 flex flex-col overflow-hidden max-h-full w-screen max-w-[40rem] mx-auto`}
            >
                <div className="flex justify-end mb-3.5">
                    <BaseModal.CloseBtn />
                </div>
                <div className="flex-grow overflow-auto">
                    <div className="px-6 lg:px-12 pb-12 overflow-auto relative">
                        <div className="font-bold text-2xl text-white mb-12">
                            Create Bribe
                        </div>

                        <div className="min-h-[20rem]">
                            <div className="grid grid-cols-2 gap-7.5 mt-8">
                                <div>
                                    <div className="font-bold text-sm text-stake-gray-500 mb-4">
                                        Reward Token
                                    </div>
                                    <DAODropdown
                                        value={selectedTokenId}
                                        onSelect={(id) => {
                                            setSelectedTokenId(id as string);
                                            setInputValue(new BigNumber(""));
                                        }}
                                        options={IN_POOL_TOKENS.map((t) => ({
                                            value: t.identifier,
                                            label: (
                                                <div className="flex items-center">
                                                    <Avatar
                                                        src={t.logoURI}
                                                        alt={t.name}
                                                        className="mr-1 w-4 h-4"
                                                    />
                                                    <span>{t.symbol}</span>
                                                </div>
                                            ),
                                        }))}
                                        buttonClassName="h-18"
                                    />
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-stake-gray-500 mb-4">
                                        Input Amount
                                    </div>
                                    <InputCurrency
                                        placeholder="0.00"
                                        className="w-full h-18 px-7 outline-none bg-ash-dark-400 font-semibold text-lg text-white text-right placeholder:text-ash-gray-600"
                                        decimals={
                                            TOKENS_MAP[selectedTokenId]
                                                ?.decimals
                                        }
                                        disabled={!selectedTokenId}
                                        value={inputStr}
                                        onChange={(e) => {
                                            setInputStr(e.target.value);
                                            setInputValue(
                                                new BigNumber(e.target.value)
                                            );
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
                                                    setInputValue(
                                                        selectedTokenBalance.egld
                                                    )
                                                }
                                            >
                                                {formatAmount(
                                                    selectedTokenBalance.egld.toNumber()
                                                )}{" "}
                                                {
                                                    TOKENS_MAP[selectedTokenId]
                                                        .symbol
                                                }
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
                                onClick={onCreateBribe}
                            >
                                <span className="mr-2">Create bribe</span>
                                <ICChevronRight className="w-3 h-3" />
                            </GlowingButton>
                        </div>
                    </div>
                </div>
            </BaseModal>
        </div>
    );
}

export default DAOCreateBribe;
