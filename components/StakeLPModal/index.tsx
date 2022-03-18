import HeadlessModal, {
    HeadlessModalDefaultHeader,
} from "components/HeadlessModal";
import { FarmsState } from "context/farms";
import { useScreenSize } from "hooks/useScreenSize";
import { Unarray } from "interface/utilities";
import React, { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { toEGLDD, toWei } from "helper/balance";
import { useWallet } from "context/wallet";
import BigNumber from "bignumber.js";
import InputCurrency from "components/InputCurrency";
import Checkbox from "components/Checkbox";
import ICChevronRight from "assets/svg/chevron-right.svg";
type props = {
    open: boolean;
    onClose: () => void;
    farmData: Unarray<FarmsState["farmRecords"]>;
};
const StakeLPContent = ({ open, onClose, farmData }: props) => {
    const { pool, poolStats } = farmData;
    const [token0, token1] = pool.tokens;
    const [isAgree, setIsAgree] = useState(false);
    const {balances, insufficientEGLD} = useWallet();
    const [stakeAmt, setStakeAmt] = useState<BigNumber>(new BigNumber(0));
    const [rawStakeAmt, setRawStakeAmt] = useState("");
    const LPBalance = useMemo(() => balances[pool.lpToken.id], [balances, pool.lpToken]);
    const setMaxStakeAmt = useCallback(() => {
        if(!LPBalance) return;
        setStakeAmt(LPBalance.balance); setRawStakeAmt(toEGLDD(pool.lpToken.decimals, LPBalance.balance.toString()).toString(10))
    }, [LPBalance, pool]);
    const lpName = useMemo(() => {
        return `LP-${token0.name}${token1.name}`;
    }, [token0.name, token1.name]);
    const canStake = useMemo(() => {
        return isAgree && stakeAmt.gt(0);
    }, [isAgree, stakeAmt]);
    const stake = useCallback(() => {

    }, []);
    return <div className="mt-3.5 px-6 lg:px-20 pb-12 overflow-auto">
    <div className="text-2xl font-bold text-ash-cyan-500 mb-9 lg:mb-14">
        Stake {lpName}
    </div>
    <div className="sm:flex sm:space-x-8 lg:space-x-24 mb-18">
        <div className="flex flex-col flex-grow mb-16 lg:mb-0">
            <div className="w-full grid grid-cols-2 gap-x-4 lg:gap-x-7.5">
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
                        className="w-full text-white text-lg font-bold bg-ash-dark-400 h-14 lg:h-18 px-6 flex items-center text-right outline-none"
                        value={rawStakeAmt}
                        onChange={(e) => {
                            if(!LPBalance) return;
                            const raw = e.target.value.trim();
                            const lockAmt = toWei(
                                pool.lpToken,
                                raw
                            );
                            if (
                                lockAmt.gt(LPBalance.balance)
                            ) {
                                setMaxStakeAmt();
                            } else {
                                setRawStakeAmt(raw);
                                setStakeAmt(lockAmt);
                            }
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
                            {LPBalance
                                ? toEGLDD(
                                      pool.lpToken.decimals,
                                      LPBalance.balance.toString()
                                  ).toFixed(2)
                                : "_"}{" "}
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
                        _
                    </div>
                </div>
                <div>
                    <div className="text-ash-gray-500 text-xs mb-2">
                    Emission APR
                    </div>
                    <div className="text-white text-lg font-bold">
                        _
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
                            href="https://docs.ashswap.io/guides/add-remove-liquidity"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <b className="text-white">
                                <u>AshSwap Pools Guide</u>
                            </b>
                        </a>{" "}
                        and understand the risks of providing
                        liquidity, including impermanent loss.
                    </span>
                }
            />
        </div>
        <div className="w-full sm:w-1/3 lg:w-[17.8125rem] flex-shrink-0">
            <div className="border-notch">
                <button
                    className={`clip-corner-1 clip-corner-tl transition w-full h-12 flex items-center justify-center text-sm font-bold text-stake-dark-400 ${
                        canStake
                            ? "bg-ash-cyan-500"
                            : "bg-ash-dark-500"
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
}
function StakeLPModal(props: props) {
    const { open, onClose, farmData } = props;
    const screenSize = useScreenSize();
    return (
        <HeadlessModal
            open={!!open}
            onClose={() => onClose && onClose()}
            transition={screenSize.isMobile ? "btt" : "center"}
        >
            <div
                className={`bg-stake-dark-400 text-white p-4 fixed bottom-0 inset-x-0 sm:static sm:mt-28 sm:ash-container flex flex-col max-h-full max-w-[51.75rem] mx-auto`}
            >
                <HeadlessModalDefaultHeader
                    onClose={() => onClose && onClose()}
                />
                {open && <StakeLPContent {...props}/>}
            </div>
        </HeadlessModal>
    );
}

export default StakeLPModal;
