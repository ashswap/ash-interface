import ICChevronRight from "assets/svg/chevron-right.svg";
import BigNumber from "bignumber.js";
import BaseModal from "components/BaseModal";
import Checkbox from "components/Checkbox";
import InputCurrency from "components/InputCurrency";
import TextAmt from "components/TextAmt";
import { blockTimeMs } from "const/dappConfig";
import { ASH_TOKEN } from "const/tokens";
import { FarmsState, useFarms } from "context/farms";
import { useWallet } from "context/wallet";
import { toEGLDD, toWei } from "helper/balance";
import { formatAmount } from "helper/number";
import { useScreenSize } from "hooks/useScreenSize";
import { Unarray } from "interface/utilities";
import Image from "next/image";
import React, { useCallback, useMemo, useState } from "react";
type props = {
    open: boolean;
    onClose: () => void;
    farmData: Unarray<FarmsState["farmRecords"]>;
};
const StakeLPContent = ({ open, onClose, farmData }: props) => {
    const { pool, poolStats, farm, farmTokenSupply, ashPerBlock, emissionAPR } =
        farmData;
    const [token0, token1] = pool.tokens;
    const [isAgree, setIsAgree] = useState(false);
    const { balances, insufficientEGLD } = useWallet();
    const [stakeAmt, setStakeAmt] = useState<BigNumber>(new BigNumber(0));
    const [rawStakeAmt, setRawStakeAmt] = useState("");
    const { enterFarm } = useFarms();
    const LPBalance = useMemo(
        () => balances[pool.lpToken.id],
        [balances, pool.lpToken]
    );
    const setMaxStakeAmt = useCallback(() => {
        if (!LPBalance) return;
        setStakeAmt(LPBalance.balance);
        setRawStakeAmt(
            toEGLDD(pool.lpToken.decimals, LPBalance.balance).toString(10)
        );
    }, [LPBalance, pool]);
    const ashPerDay = useMemo(() => {
        const totalAshPerDay = ashPerBlock
            .multipliedBy(24 * 60 * 60)
            .div(blockTimeMs / 1000);
        const shareOfFarm = stakeAmt.div(farmTokenSupply.plus(stakeAmt));
        return totalAshPerDay.multipliedBy(shareOfFarm);
    }, [stakeAmt, farmTokenSupply, ashPerBlock]);
    const lpName = useMemo(() => {
        return `LP-${token0.name}${token1.name}`;
    }, [token0.name, token1.name]);
    const insufficientLP = useMemo(() => {
        return (
            !LPBalance ||
            LPBalance.balance.eq(0) ||
            stakeAmt.gt(LPBalance.balance)
        );
    }, [LPBalance, stakeAmt]);
    const canStake = useMemo(() => {
        return (
            isAgree && stakeAmt.gt(0) && !insufficientLP && !insufficientEGLD
        );
    }, [isAgree, stakeAmt, insufficientLP, insufficientEGLD]);
    const stake = useCallback(async () => {
        const { sessionId } = await enterFarm(stakeAmt, farm);
        if (sessionId && onClose) {
            onClose();
        }
    }, [enterFarm, stakeAmt, farm, onClose]);
    return (
        <div className="px-6 lg:px-20 pb-12 overflow-auto">
            <div className="text-2xl font-bold text-ash-cyan-500 mb-9 lg:mb-14">
                Stake {lpName}
            </div>
            <div className="sm:flex sm:space-x-8 lg:space-x-24 mb-18">
                <div className="flex flex-col flex-grow mb-16 lg:mb-0">
                    <div className="w-full grid md:grid-cols-2 gap-y-6 gap-x-4 lg:gap-x-7.5">
                        <div>
                            <div className="text-ash-gray-500 text-xs lg:text-sm font-bold mb-2 lg:mb-4">
                                Token
                            </div>
                            <div className="bg-ash-dark-400/30 h-14 lg:h-18 px-6 flex items-center">
                                <div className="flex mr-2">
                                    <div className="w-4 h-4">
                                        <Image
                                            src={token0.icon}
                                            alt={`${token0.name} icon`}
                                            layout="responsive"
                                        />
                                    </div>
                                    <div className="w-4 h-4 -ml-1">
                                        <Image
                                            src={token1.icon}
                                            alt={`${token1.name} icon`}
                                            layout="responsive"
                                        />
                                    </div>
                                </div>
                                <div className="text-ash-gray-500 text-sm lg:text-lg font-bold">
                                    {lpName}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="text-ash-gray-500 text-xs lg:text-sm font-bold mb-2 lg:mb-4">
                                Input Amount
                            </div>
                            <InputCurrency
                                className={`w-full text-white text-lg font-bold bg-ash-dark-400 h-14 lg:h-18 px-6 flex items-center text-right outline-none border ${
                                    insufficientLP
                                        ? "border-ash-purple-500"
                                        : "border-transparent"
                                }`}
                                value={rawStakeAmt}
                                onChange={(e) => {
                                    const raw = e.target.value.trim();
                                    const lockAmt = toWei(pool.lpToken, raw);
                                    setRawStakeAmt(raw);
                                    setStakeAmt(lockAmt);
                                }}
                            />
                            <div className="text-right text-2xs lg:text-xs mt-2">
                                <span className="text-ash-gray-500">
                                    Balance:{" "}
                                </span>
                                <span
                                    className="text-earn cursor-pointer"
                                    onClick={() => setMaxStakeAmt()}
                                >
                                    <TextAmt
                                        number={
                                            LPBalance
                                                ? toEGLDD(
                                                      pool.lpToken.decimals,
                                                      LPBalance.balance
                                                  )
                                                : 0
                                        }
                                    />{" "}
                                    {lpName}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full sm:w-1/3 lg:w-[17.8125rem] flex-shrink-0 bg-stake-dark-500 py-[2.375rem] px-10">
                    <div className="text-white text-lg font-bold mb-16">
                        Estimate Farming
                    </div>
                    <div className="flex flex-col space-y-11">
                        <div>
                            <div className="text-ash-gray-500 text-xs mb-2">
                                ASH earn per day
                            </div>
                            <div className="text-white text-lg font-bold">
                                <TextAmt
                                    number={toEGLDD(
                                        ASH_TOKEN.decimals,
                                        ashPerDay
                                    )}
                                    decimalClassName="text-stake-gray-500"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="text-ash-gray-500 text-xs mb-2">
                                Emission APR
                            </div>
                            <div className="text-white text-lg font-bold">
                                {formatAmount(emissionAPR?.toNumber() || 0, {
                                    notation: "standard",
                                })}
                                %
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="sm:flex sm:space-x-8 lg:space-x-24">
                <div className="w-full mb-12 sm:mb-0 sm:flex-grow">
                    <Checkbox
                        checked={isAgree}
                        onChange={setIsAgree}
                        text={
                            <span className="text-ash-gray-500">
                                I verify that I have read the{" "}
                                <a
                                    href="https://docs.ashswap.io/testnet-guides/liquidity-staking"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <b className="text-white">
                                        <u>AshSwap Liquidity Staking Guide</u>
                                    </b>
                                </a>{" "}
                                and understand the risks of providing liquidity,
                                including impermanent loss.
                            </span>
                        }
                    />
                </div>
                <div className="w-full sm:w-1/3 lg:w-[17.8125rem] flex-shrink-0">
                    <div className="border-notch">
                        <button
                            className={`clip-corner-1 clip-corner-tl transition w-full h-12 flex items-center justify-center text-sm font-bold ${
                                canStake
                                    ? "bg-ash-cyan-500 text-stake-dark-400"
                                    : "bg-ash-dark-500 text-white"
                            }`}
                            disabled={!canStake}
                            onClick={() => canStake && stake()}
                        >
                            {insufficientEGLD ? (
                                "INSUFFICIENT EGLD BALANCE"
                            ) : (
                                <div className="flex items-center">
                                    <div className="mr-2">STAKE</div>
                                    <ICChevronRight className="w-2 h-auto" />
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
function StakeLPModal(props: props) {
    const { open, onClose, farmData } = props;
    const screenSize = useScreenSize();
    return (
        <>
            <BaseModal
                isOpen={!!open}
                onRequestClose={() => onClose?.()}
                type={screenSize.isMobile ? "drawer_btt" : "modal"}
                className={`bg-stake-dark-400 text-white p-4 sm:ash-container flex flex-col overflow-hidden max-h-full max-w-[51.75rem] mx-auto`}
            >
                <div className="flex justify-end mb-3.5">
                    <BaseModal.CloseBtn />
                </div>
                <div className="flex-grow overflow-auto">
                    <StakeLPContent {...props} />
                </div>
            </BaseModal>
        </>
    );
}

export default StakeLPModal;
