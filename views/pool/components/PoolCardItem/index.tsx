import { AccountInfoSliceNetworkType } from "@multiversx/sdk-dapp/types";
import Down from "assets/svg/down-white.svg";
import { accIsLoggedInState, networkConfigState } from "atoms/dappState";
import { PoolsState } from "atoms/poolsState";
import AddLiquidityModal from "components/AddLiquidityModal";
import Avatar from "components/Avatar";
import GlowingButton from "components/GlowingButton";
import TextAmt from "components/TextAmt";
import CardTooltip from "components/Tooltip/CardTooltip";
import OnboardTooltip from "components/Tooltip/OnboardTooltip";
import { formatAmount } from "helper/number";
import { getTokenFromId } from "helper/token";
import { useOnboarding } from "hooks/useOnboarding";
import { useScreenSize } from "hooks/useScreenSize";
import IPool, { EPoolState } from "interface/pool";
import { Unarray } from "interface/utilities";
import { useState, useEffect, useMemo } from "react";
import { useRecoilValue } from "recoil";

const NTokensHeader = ({ pool }: { pool: IPool }) => {
    const n = useMemo(() => pool.tokens.length, [pool.tokens.length]);
    const name = useMemo(
        () => pool.tokens.map((t) => t.symbol).join("/"),
        [pool.tokens]
    );

    return n === 2 ? (
        <div className="flex flex-row justify-between items-start mb-12 h-16 sm:-mr-4">
            <div className="overflow-hidden">
                <div className="text-text-input-3 text-xs pb-2.5">Deposit</div>
                <div className="text-2xl font-bold truncate">
                    <span>
                        {getTokenFromId(pool.tokens[0].identifier).symbol}
                    </span>
                    <span className="text-sm px-3">&</span>
                    <span>
                        {getTokenFromId(pool.tokens[1].identifier).symbol}
                    </span>
                </div>
            </div>
            <div className="shrink-0 flex flex-row justify-between items-center">
                {pool.tokens.map((_t) => {
                    const t = getTokenFromId(_t.identifier);
                    return (
                        <Avatar
                            key={t.identifier}
                            src={t.logoURI}
                            alt={t.symbol}
                            className="w-[3.25rem] h-[3.25rem] -ml-2.5 first:ml-0"
                        />
                    );
                })}
            </div>
        </div>
    ) : (
        <div className="flex flex-row justify-between items-start mb-12 h-16 sm:-mr-4">
            <div className="overflow-hidden">
                <div className="text-text-input-3 text-xs pb-2.5">Deposit</div>
                <div className="font-bold text-lg text-white truncate">
                    {name}
                </div>
            </div>
            <div className="flex flex-wrap justify-center max-w-[4.5rem]">
                {pool.tokens.map((_t) => {
                    const t = getTokenFromId(_t.identifier);
                    return (
                        <Avatar
                            key={t.identifier}
                            src={t.logoURI}
                            alt={t.symbol}
                            className="w-9 h-9 -ml-2.5 first:ml-0 last:ml-0 last:-mt-2.5"
                        />
                    );
                })}
            </div>
        </div>
    );
};

function PoolCardItem({
    poolData,
    withTooltip,
}: {
    poolData: Unarray<PoolsState["poolToDisplay"]>;
    withTooltip?: boolean;
}) {
    const { pool } = poolData;
    const [isExpand, setIsExpand] = useState<boolean>(false);
    const [openAddLiquidity, setOpenAddLiquidity] = useState<boolean>(false);
    const loggedIn = useRecoilValue(accIsLoggedInState);
    useEffect(() => {
        if (window && openAddLiquidity && loggedIn) {
            let dataLayer = (window as any).dataLayer || [];
            dataLayer.push({
                event: "click_deposit",
            });
        }
    }, [openAddLiquidity]);
    const network: AccountInfoSliceNetworkType =
        useRecoilValue(networkConfigState).network;
    const {
        tvl,
        apr: tradingAPR,
        volume_usd: volume24h,
    } = poolData.poolStats || {};
    const screenSize = useScreenSize();
    const [onboardingPoolDeposit, setOnboardedPoolDeposit] =
        useOnboarding("pool_deposit");
    return (
        <div
            className={`bg-ash-dark-700 clip-corner-4 clip-corner-tr pt-8 pb-5 px-6 sm:px-11 text-white`}
        >
            <NTokensHeader pool={pool} />
            <div className="flex flex-row my-12 justify-between items-center">
                <div>
                    <CardTooltip
                        content={
                            <>
                                Estimation for growth of your deposit over a
                                year, based on trading activity in the past 24
                                hours.
                            </>
                        }
                    >
                        <div className="text-text-input-3 text-xs mb-4 underline">
                            Trading APR
                        </div>
                    </CardTooltip>

                    <div className="text-yellow-600 font-bold text-lg leading-tight">
                        {formatAmount(tradingAPR || 0, {
                            notation: "standard",
                        })}
                        %
                    </div>
                </div>
            </div>
            <OnboardTooltip
                open={onboardingPoolDeposit && screenSize.md}
                zIndex={10}
                placement="left"
                disabled={!withTooltip}
                onArrowClick={() => setOnboardedPoolDeposit(true)}
                content={
                    <OnboardTooltip.Panel>
                        <div className="p-3 max-w-[8rem] text-xs font-bold">
                            <span className="text-stake-green-500">
                                Deposit{" "}
                            </span>
                            <span>a pool to start your Farm & Earn</span>
                        </div>
                    </OnboardTooltip.Panel>
                }
            >
                <div>
                    <GlowingButton
                        theme="pink"
                        className="w-full clip-corner-1 clip-corner-br h-14 text-sm font-bold text-white underline"
                        wrapperClassName="hover:colored-drop-shadow-xs"
                        disabled={poolData.state === EPoolState.Inactive}
                        onClick={() => {
                            if (poolData.state === EPoolState.Inactive) return;
                            setOpenAddLiquidity(true);
                            setOnboardedPoolDeposit(true);
                        }}
                    >
                        Deposit
                    </GlowingButton>
                </div>
            </OnboardTooltip>

            <div className="bg-bg my-4 text-text-input-3">
                <div className="flex flex-row justify-between items-center h-12 px-4">
                    <CardTooltip
                        content={
                            <>
                                Total value of overall deposited tokens in this
                                pool.
                            </>
                        }
                    >
                        <div className="underline text-2xs">
                            Total Liquidity
                        </div>
                    </CardTooltip>
                    <div className="text-sm">
                        $
                        <TextAmt
                            number={tvl || 0}
                            options={{ notation: "standard" }}
                        />
                    </div>
                </div>
                <div className="flex flex-row justify-between items-center h-12 px-4">
                    <CardTooltip
                        content={
                            <>
                                Total value of token traded in the past 24
                                hours.
                            </>
                        }
                    >
                        <div className="underline text-2xs">24H Volume</div>
                    </CardTooltip>
                    <div className="text-sm">
                        $
                        <TextAmt
                            number={volume24h || 0}
                            options={{ notation: "standard" }}
                        />
                    </div>
                </div>
                {isExpand && (
                    <>
                        <div className="flex flex-row justify-between items-center h-12 px-4">
                            <CardTooltip
                                content={
                                    <>
                                        Estimation for growth of your deposit
                                        over a year, based on trading activity
                                        in the past 24 hours.
                                    </>
                                }
                            >
                                <div className="underline text-2xs">
                                    Trading APR
                                </div>
                            </CardTooltip>
                            <div className="text-sm">
                                {formatAmount(tradingAPR || 0, {
                                    notation: "standard",
                                })}
                                %
                            </div>
                        </div>
                    </>
                )}
            </div>

            {isExpand && (
                <div className="text-center mb-8">
                    <a
                        href={`${network.explorerAddress}/tokens/${pool.lpToken.identifier}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-earn underline text-2xs font-bold hover:text-earn hover:underline"
                    >
                        View LP Distribution
                    </a>
                </div>
            )}

            <div
                className="flex flex-row justify-center items-center select-none cursor-pointer py-2"
                onClick={() => setIsExpand(!isExpand)}
            >
                <div className="font-bold text-sm mr-2">
                    {isExpand ? "Hide" : "Detail"}
                </div>
                <Down
                    style={{
                        transform: `rotate(${isExpand ? "180" : "0"}deg)`,
                    }}
                />
            </div>

            <AddLiquidityModal
                open={openAddLiquidity}
                onClose={() => setOpenAddLiquidity(false)}
                poolData={poolData}
            />
        </div>
    );
}

export default PoolCardItem;
