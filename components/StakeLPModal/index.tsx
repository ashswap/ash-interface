import ICChevronRight from "assets/svg/chevron-right.svg";
import {
    accIsInsufficientEGLDState,
    accIsLoggedInState,
} from "atoms/dappState";
import { FarmRecord } from "atoms/farmsState";
import { tokenMapState } from "atoms/tokensState";
import BigNumber from "bignumber.js";
import Avatar from "components/Avatar";
import BaseModal from "components/BaseModal";
import GlowingButton from "components/GlowingButton";
import InputCurrency from "components/InputCurrency";
import TextAmt from "components/TextAmt";
import { toEGLDD, toWei } from "helper/balance";
import useEnterFarm from "hooks/useFarmContract/useEnterFarm";
import { useScreenSize } from "hooks/useScreenSize";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { useDebounce } from "use-debounce";
import FarmAPRBreakdown from "views/farms/FarmAPRBreakdown";
type props = {
    open: boolean;
    onClose: () => void;
    farmData: FarmRecord;
};
const StakeLPContent = ({ open, onClose, farmData }: props) => {
    const loggedIn = useRecoilValue(accIsLoggedInState);
    const { pool, farm, farmTokenSupply, ashPerSec, ashBaseAPR } = farmData;
    const tokenMap = useRecoilValue(tokenMapState);
    const insufficientEGLD = useRecoilValue(accIsInsufficientEGLDState);
    const [stakeAmt, setStakeAmt] = useState<BigNumber>(new BigNumber(0));
    const [rawStakeAmt, setRawStakeAmt] = useState("");
    const [deboundRawStakeAmt] = useDebounce(rawStakeAmt, 500);
    useEffect(() => {
        if (window && loggedIn && deboundRawStakeAmt) {
            let dataLayer = (window as any).dataLayer || [];
            dataLayer.push({
                event: "input_stake_value",
                amount: deboundRawStakeAmt,
                lp_token: pool?.lpToken?.symbol,
            });
        }
    }, [deboundRawStakeAmt, loggedIn, pool]);
    const { enterFarm } = useEnterFarm();
    const LPBalance = useMemo(
        () => new BigNumber(tokenMap[pool.lpToken.identifier]?.balance || 0),
        [tokenMap, pool.lpToken]
    );
    const setMaxStakeAmt = useCallback(() => {
        if (!LPBalance) return;
        setStakeAmt(LPBalance);
        setRawStakeAmt(toEGLDD(pool.lpToken.decimals, LPBalance).toString(10));
    }, [LPBalance, pool]);
    const ashPerDayBase = useMemo(() => {
        const baseFarmToken = stakeAmt.multipliedBy(0.4);
        const totalAshPerDay = ashPerSec.multipliedBy(24 * 60 * 60);
        const shareOfFarm = baseFarmToken.div(
            farmTokenSupply.plus(baseFarmToken)
        );
        return totalAshPerDay.multipliedBy(shareOfFarm);
    }, [stakeAmt, farmTokenSupply, ashPerSec]);
    const ashPerDayMax = useMemo(() => {
        const totalAshPerDay = ashPerSec.multipliedBy(24 * 60 * 60);
        const shareOfFarm = stakeAmt.div(farmTokenSupply.plus(stakeAmt));
        return totalAshPerDay.multipliedBy(shareOfFarm);
    }, [stakeAmt, farmTokenSupply, ashPerSec]);
    const insufficientLP = useMemo(() => {
        return !LPBalance || LPBalance.eq(0) || stakeAmt.gt(LPBalance);
    }, [LPBalance, stakeAmt]);
    const canStake = useMemo(() => {
        return stakeAmt.gt(0) && !insufficientLP && !insufficientEGLD;
    }, [stakeAmt, insufficientLP, insufficientEGLD]);
    const stake = useCallback(async () => {
        const { sessionId } = await enterFarm(stakeAmt, farm);
        if (sessionId && onClose) {
            onClose();
        }
    }, [enterFarm, stakeAmt, farm, onClose]);
    return (
        <div className="px-6 lg:px-20 pb-12 overflow-auto">
            <div className="text-2xl font-bold text-ash-cyan-500 mb-9 lg:mb-14">
                Stake {pool?.lpToken?.symbol}
            </div>
            <div className="sm:flex sm:space-x-8 lg:space-x-24 mb-18">
                <div className="flex flex-col grow mb-16 lg:mb-0">
                    <div className="w-full grid lg:grid-cols-2 gap-y-6 gap-x-4 lg:gap-x-7.5">
                        <div>
                            <div className="text-ash-gray-500 text-xs lg:text-sm font-bold mb-2 lg:mb-4">
                                Token
                            </div>
                            <div className="bg-ash-dark-400/30 h-14 lg:h-18 px-6 flex items-center">
                                <div className="flex mr-2">
                                    {farmData.pool.tokens.map((t) => (
                                        <Avatar
                                            key={t.identifier}
                                            src={t.logoURI}
                                            alt={t.symbol}
                                            className="w-4 h-4 first:ml-0 -ml-1"
                                        />
                                    ))}
                                </div>
                                <div className="text-ash-gray-500 text-sm lg:text-lg font-bold">
                                    {pool?.lpToken?.symbol}
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
                                decimals={pool.lpToken.decimals}
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
                                                      LPBalance
                                                  )
                                                : 0
                                        }
                                    />{" "}
                                    {pool?.lpToken?.symbol}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full sm:w-1/2 lg:w-[18.4375rem] shrink-0 bg-stake-dark-500 py-9 px-7.5">
                    <FarmAPRBreakdown farmAddress={farm.farm_address} />
                </div>
            </div>
            <div className="sm:flex sm:space-x-8 lg:space-x-24">
                <div className="w-full mb-12 sm:mb-0 md:grow">
                    <span className="text-xs text-ash-gray-500">
                        Make sure you have read the{" "}
                        <a
                            href="https://docs.ashswap.io/testnet-guides/liquidity-staking"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <b className="text-white">
                                <u>AshSwap Liquidity Staking Guide</u>
                            </b>
                        </a>{" "}
                        and understood the associated risks.
                    </span>
                </div>
                <div className="w-full sm:w-1/2 lg:w-[18.4375rem] shrink-0">
                    <div className="border-notch-x border-notch-white/50">
                        <GlowingButton
                            theme="cyan"
                            className={`clip-corner-1 clip-corner-tl w-full h-12 text-sm font-bold`}
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
                        </GlowingButton>
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
                <div className="grow overflow-auto">
                    <StakeLPContent {...props} />
                </div>
            </BaseModal>
        </>
    );
}

export default StakeLPModal;
