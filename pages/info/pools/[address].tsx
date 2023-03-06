import { AccountInfoSliceNetworkType } from "@multiversx/sdk-dapp/types";
import ICArrowRight from "assets/svg/arrow-right.svg";
import ICCopy from "assets/svg/copy.svg";
import ICNewTabRound from "assets/svg/new-tab-round.svg";
import ICPlus from "assets/svg/plus.svg";
import ICSwap from "assets/svg/swap.svg";
import { networkConfigState } from "atoms/dappState";
import BigNumber from "bignumber.js";
import Avatar from "components/Avatar";
import CopyBtn from "components/CopyBtn";
import InfoLayout from "components/Layout/Info";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import pools from "const/pool";
import { fetcher } from "helper/common";
import { formatAmount } from "helper/number";
import IPool from "interface/pool";
import { PoolStatsRecord } from "interface/poolStats";
import { TxStatsRecord } from "interface/txStats";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { ReactElement, useMemo } from "react";
import { useRecoilValue } from "recoil";
import useSWR from "swr";
import TxsTable from "views/info/components/TxsTable";
import PoolChart from "views/info/Pools/[address]/PoolChart";
const getTotalFees = (
    stats: PoolStatsRecord,
    keyTemplate: (index: number) => string
) => {
    let index = 1;
    let sum = 0;
    while (true) {
        const key = keyTemplate(index);
        if (key in stats) {
            sum += (stats[key as keyof PoolStatsRecord] as number) || 0;
            index++;
        } else {
            break;
        }
    }
    return sum;
};
type Props = { pool: IPool };
function PoolDetailPage({ pool }: Props) {
    const { data: stats } = useSWR<PoolStatsRecord>(
        pool.address
            ? `${ASHSWAP_CONFIG.ashApiBaseUrl}/pool/${pool.address}/statistic`
            : null,
        fetcher,
        { refreshInterval: 5 * 60 * 1000 }
    );
    const { data: txs } = useSWR<TxStatsRecord[]>(
        pool.address
            ? `${ASHSWAP_CONFIG.ashApiBaseUrl}/pool/${pool.address}/transaction?offset=0&limit=50`
            : null,
        fetcher,
        { refreshInterval: 5 * 60 * 1000 }
    );
    const network: AccountInfoSliceNetworkType =
        useRecoilValue(networkConfigState).network;
    const fees = useMemo(() => {
        return new BigNumber(stats?.tvl || 0)
            .multipliedBy(stats?.apr || 0)
            .div(365)
            .div(100);
    }, [stats]);
    return (
        <div className="text-white py-7 max-w-6xl mx-auto px-6 sm:px-0">
            <ul className="flex space-x-1 text-xs mb-6">
                <li>
                    <Link href="/info">
                        <span className="text-white">Dashboard</span>
                    </Link>
                </li>
                <li>
                    <ICArrowRight className="inline mr-1 text-ash-gray-500" />
                    <Link href="/info/pools">
                        <span className="text-white">Pools</span>
                    </Link>
                </li>
                <li>
                    <ICArrowRight className="inline mr-1 text-ash-gray-500" />
                    <span className="text-ash-gray-500">
                        {pool.tokens.map((t) => t.symbol).join(" & ")}
                    </span>
                </li>
            </ul>
            <div className="flex items-center mb-4 lg:mb-5">
                <div className="text-2xl lg:text-4xl font-bold mr-4 lg:mr-7">
                    {pool.tokens.map((t) => t.symbol).join(" & ")}
                </div>
                <div className="flex">
                    {pool.tokens.map((t) => (
                        <Avatar
                            key={t.identifier}
                            src={t.logoURI}
                            alt={t.symbol}
                            className="w-6 h-6 lg:w-8 lg:h-8 -ml-1.5 first:ml-0"
                        />
                    ))}
                </div>
            </div>
            <div className="flex flex-wrap mb-9 lg:mb-20">
                <div className="flex items-center bg-ash-dark-600 h-8 lg:h-10 px-2.5 lg:px-4 mr-2 mb-2">
                    <div className="text-xs lg:text-sm">Pair Add</div>
                    <div className="text-2xs lg:text-xs text-stake-gray-500 px-2.5 border-r border-r-stake-gray-500">
                        {pool.address.slice(0, 4)}...{pool.address.slice(-4)}
                    </div>
                    <div className="pl-2.5 flex lg:pl-5">
                        <CopyBtn text={pool.address}>
                            <ICCopy className="w-4 h-4 lg:w-5 lg:h-5" />
                        </CopyBtn>
                    </div>
                </div>
                {pool.tokens.map((t) => {
                    return (
                        <div
                            key={t.identifier}
                            className="flex items-center bg-ash-dark-600 h-8 lg:h-10 px-2.5 lg:px-4 mr-2 mb-2"
                        >
                            <div className="text-xs lg:text-sm">{t.symbol}</div>
                            <div className="text-2xs lg:text-xs text-stake-gray-500 px-2.5 border-r border-r-stake-gray-500">
                                {t.identifier}
                            </div>
                            <div className="pl-2.5 flex lg:pl-5">
                                <CopyBtn text={t.identifier}>
                                    <ICCopy className="w-4 h-4 lg:w-5 lg:h-5" />
                                </CopyBtn>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="flex space-x-2 text-xs md:text-sm mb-4 lg:mb-18">
                <Link href={`/swap`}>
                    <div className="flex items-center justify-center bg-pink-600 w-8 h-8 md:w-auto md:h-10 text-white md:px-4">
                        <ICSwap className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="hidden md:block ml-2">Swap</span>
                    </div>
                </Link>
                <Link href={`/pool`}>
                    <div className="flex items-center justify-center bg-pink-600/20 w-8 h-8 md:w-auto md:h-10 text-pink-600 md:px-4">
                        <ICPlus className="w-3 h-3" />
                        <span className="hidden md:block ml-2">Deposit</span>
                    </div>
                </Link>
                <a
                    href={`${network.explorerAddress}/accounts/${pool.address}`}
                    target="_blank"
                    rel="noreferrer"
                >
                    <div className="flex items-center justify-center bg-ash-gray-600/10 h-8 md:h-10 text-white px-2.5 md:px-4">
                        <ICNewTabRound className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="ml-2">
                            <span className="hidden sm:inline">View on </span>
                            MultiversX Explorer
                        </span>
                    </div>
                </a>
            </div>

            <div className="flex flex-wrap xl:flex-nowrap overflow-hidden mb-10 md:mb-18">
                <div className="w-full xl:w-[16.625rem] flex flex-col space-y-2 mb-6 xl:mb-0">
                    <div className="px-4 md:px-[1.625rem] py-4 md:pt-5 md:pb-8 bg-ash-dark-600 flex flex-col justify-between">
                        <div className="mb-5 sm:mb-8 text-2xs sm:text-xs">
                            Pooled Tokens
                        </div>
                        {pool.tokens.map((t, i) => {
                            const key = `token_${
                                i + 1
                            }_amount` as keyof PoolStatsRecord;
                            return (
                                <div
                                    key={t.identifier}
                                    className="flex items-center justify-between text-sm sm:text-lg mb-2.5 sm:mb-6 last:mb-0"
                                >
                                    <div>
                                        <span>
                                            {formatAmount(stats?.[key] || 0)}{" "}
                                        </span>
                                        <span className="text-stake-gray-500">
                                            {t.symbol}
                                        </span>
                                    </div>
                                    <Avatar
                                        src={t.logoURI}
                                        alt={t.symbol}
                                        className="w-4.5 h-4.5 sm:w-6 sm:h-6"
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <div className="px-4 md:px-[1.625rem] py-4 md:pt-5 md:pb-8 bg-ash-dark-600 flex flex-col justify-between">
                        <div className="mb-2 text-2xs sm:text-xs">
                            Total Liquidity
                        </div>
                        <div className="text-sm sm:text-lg">
                            <span className="text-stake-gray-500">$ </span>
                            <span>{formatAmount(stats?.tvl)}</span>
                        </div>
                    </div>
                    <div className="px-4 md:px-[1.625rem] py-4 md:pt-5 md:pb-8 bg-ash-dark-600 flex flex-col justify-between">
                        <div className="mb-2 text-2xs sm:text-xs">
                            Volume (24h)
                        </div>
                        <div className="text-sm sm:text-lg">
                            <span className="text-stake-gray-500">$ </span>
                            <span>{formatAmount(stats?.volume_usd)}</span>
                        </div>
                    </div>
                    <div className="px-4 md:px-[1.625rem] py-4 md:pt-5 md:pb-8 bg-ash-dark-600 flex flex-col justify-between">
                        <div className="mb-2 text-2xs sm:text-xs">
                            Fees (24H)
                        </div>
                        <div className="text-sm sm:text-lg">
                            <span className="text-stake-gray-500">$ </span>
                            <span>{stats ? formatAmount(fees) : "0.00"}</span>
                        </div>
                    </div>
                </div>
                <div className="grow xl:ml-4 overflow-hidden xl:h-[32.25rem] h-[20rem]">
                    <PoolChart pool={pool} />
                </div>
            </div>
            <div>
                <h2 className="text-white text-lg font-bold mb-5">
                    Transactions
                </h2>
                <TxsTable data={txs || []} />
            </div>
        </div>
    );
}

PoolDetailPage.getLayout = function getLayout(page: ReactElement) {
    return <InfoLayout>{page}</InfoLayout>;
};
export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: pools
            .filter((p) => !p.isMaiarPool)
            .map((p) => ({ params: { address: p.address } })),
        fallback: false,
    };
};
export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { address } = params || {};
    const pool = pools.find((t) => t.address === address);
    if (pool && !pool.isMaiarPool) {
        return {
            props: { pool },
        };
    }
    return { redirect: { permanent: true, destination: "/info/pools" } };
};
export default PoolDetailPage;
