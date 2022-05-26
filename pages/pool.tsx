import {
    poolDeboundKeywordState,
    poolKeywordState,
    poolRecordsState,
} from "atoms/poolsState";
import { walletBalanceState, walletLPMapState } from "atoms/walletState";
import BigNumber from "bignumber.js";
import BasicLayout from "components/Layout/Basic";
import ListPool from "components/ListPool";
import PoolBanner from "components/PoolBanner";
import PoolFilter, { ViewType } from "components/PoolFilter";
import PoolMenu from "components/PoolMenu";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { blockTimeMs } from "const/dappConfig";
import pools from "const/pool";
import { toEGLD } from "helper/balance";
import { fetcher } from "helper/common";
import { queryPoolContract } from "helper/contracts/pool";
import useLPValue from "hooks/usePoolContract/useLPValue";
import { useScreenSize } from "hooks/useScreenSize";
import IPool from "interface/pool";
import { PoolStatsRecord } from "interface/poolStats";
import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from "recoil";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

type PoolRecord = {
    pool: IPool;
    poolStats?: PoolStatsRecord;
    /** if LP balance > 0 -> staked pool*/
    liquidityData?: {
        /** number of own LP token*/
        ownLiquidity: BigNumber;
        /** number of token 0 in own LP*/
        value0: BigNumber;
        /** number of token 1 in own LP*/
        value1: BigNumber;
        /** own LP over total LP*/
        capacityPercent: BigNumber;
        /** total liquidity in USD value*/
        lpValueUsd: BigNumber;
    };
};
const PoolStateHook = () => {
    const keyword = useRecoilValue(poolKeywordState);
    // const balances = useRecoilValue(walletBalanceState);
    const lpTokens = useRecoilValue(walletLPMapState);
    // const setPoolRecords = useSetRecoilState(poolRecordsState);
    const setDeboundKeyword = useSetRecoilState(poolDeboundKeywordState);
    const getLPValue = useLPValue();
    const [deboundKeyword] = useDebounce(keyword, 500);

    useEffect(() => {
        setDeboundKeyword(deboundKeyword);
    }, [deboundKeyword, setDeboundKeyword]);

    // fetch pool stats
    const { data: poolStatsRecords } = useSWR<PoolStatsRecord[]>(
        `${ASHSWAP_CONFIG.ashApiBaseUrl}/pool`,
        fetcher
    );

    const getPortion = useRecoilCallback(
        ({ snapshot, set }) =>
            async (lpTokenId: string, ownLiquidity: BigNumber) => {
                const lpTokens = await snapshot.getPromise(walletLPMapState);
                const lpToken = lpTokens[lpTokenId];
                if (!lpToken) return new BigNumber(0);
                return toEGLD(lpToken, ownLiquidity.toString())
                    .multipliedBy(100)
                    .div(lpToken.totalSupply!);
            },
        []
    );

    const getPoolRecords = useRecoilCallback(
        ({ snapshot, set }) =>
            async () => {
                const balances = await snapshot.getPromise(walletBalanceState);

                const recordPromises: Promise<PoolRecord>[] = [];
                for (let i = 0; i < pools.length; i++) {
                    const p = pools[i];
                    if (p.isMaiarPool) continue;
                    const promiseFn = (async () => {
                        let record: PoolRecord = {
                            pool: p,
                            poolStats: poolStatsRecords?.find(
                                (stats) => stats.pool_address === p.address
                            ),
                        };
                        const ownLP =
                            balances[p.lpToken.id]?.balance || new BigNumber(0);
                        if (ownLP.gt(0)) {
                            const { amt0, amt1, lpValueUsd } = await getLPValue(
                                ownLP,
                                p
                            );
                            record.liquidityData = {
                                ownLiquidity: ownLP,
                                capacityPercent: await getPortion(
                                    p.lpToken.id,
                                    ownLP
                                ),
                                value0: amt0,
                                value1: amt1,
                                lpValueUsd,
                            };
                        }
                        return record;
                    })();
                    recordPromises.push(promiseFn);
                }
                const records = await Promise.all(recordPromises);
                set(poolRecordsState, records);
            },
        [getPortion, getLPValue, poolStatsRecords]
    );

    useEffect(() => {
        getPoolRecords();
        const interval = setInterval(getPoolRecords, blockTimeMs);
        return () => clearInterval(interval);
    }, [getPoolRecords]);
    return null;
};

const Pools: NextPage = () => {
    const [view, setView] = useState<ViewType>(ViewType.Card);
    const { isMobile } = useScreenSize();

    return (
        <>
            <BasicLayout>
                <div className="ash-container pb-40">
                    <div className="mb-12 w-full max-w-[55.375rem] mx-auto">
                        <PoolBanner />
                    </div>
                    <div>
                        <PoolMenu />
                        {/* disable change view type if the screen size is sm, and auto set view type to list on SM screen */}
                        <PoolFilter
                            view={view}
                            onChangeView={(view) => !isMobile && setView(view)}
                        />
                        <ListPool
                            items={pools}
                            view={view}
                            className="pt-2 md:pt-8"
                        />
                    </div>
                </div>
            </BasicLayout>
            <PoolStateHook />
        </>
    );
};

export default Pools;
