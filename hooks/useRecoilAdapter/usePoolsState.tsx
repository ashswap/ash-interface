import { ashswapBaseState } from "atoms/ashswap";
import {
    LPBreakDownQuery,
    poolDeboundKeywordState,
    poolKeywordState,
    PoolRecord,
    poolRecordsState,
    poolStatsRefresherAtom
} from "atoms/poolsState";
import { tokenMapState } from "atoms/tokensState";
import BigNumber from "bignumber.js";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import pools from "const/pool";
import { fetcher } from "helper/common";
import IPool, { EPoolType } from "interface/pool";
import { PoolStatsRecord } from "interface/poolStats";
import { useCallback, useEffect } from "react";
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from "recoil";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

const usePoolsState = () => {
    const keyword = useRecoilValue(poolKeywordState);
    const ashBase = useRecoilValue(ashswapBaseState);
    const tokenMap = useRecoilValue(tokenMapState);
    // const setPoolRecords = useSetRecoilState(poolRecordsState);
    const setPoolRecordsRefresher = useSetRecoilState(poolStatsRefresherAtom);
    const setDeboundKeyword = useSetRecoilState(poolDeboundKeywordState);
    const [deboundKeyword] = useDebounce(keyword, 500);

    useEffect(() => {
        setDeboundKeyword(deboundKeyword);
    }, [deboundKeyword, setDeboundKeyword]);

    // fetch pool stats
    const { data: poolStatsRecords, mutate: poolStatsRefresher } = useSWR<PoolStatsRecord[]>(
        `${ASHSWAP_CONFIG.ashApiBaseUrl}/pool`,
        fetcher
    );

    const lpBreak = useRecoilCallback(
        ({ snapshot }) =>
            async (poolAddress: string, wei: string) => {
                return await snapshot.getPromise(
                    LPBreakDownQuery({ poolAddress, wei })
                );
            },
        []
    );

    const getPoolRecord = useCallback(
        async (p: IPool) => {
            const rawPool = p.type === EPoolType.PoolV2 ? ashBase.poolsV2.find(_p => _p.address === p.address) : ashBase.pools.find(
                (_p) => _p.address === p.address
            );
            const totalSupply = new BigNumber(rawPool?.totalSupply || 0);
            let record: PoolRecord = {
                pool: p,
                poolStats: poolStatsRecords?.find(
                    (stats) => stats.address === p.address
                ),
                totalSupply,
                state: !!rawPool?.state,
            };
            const ownLP = new BigNumber(
                tokenMap[p.lpToken.identifier]?.balance || 0
            );

            if (ownLP.gt(0)) {
                const { lpReserves, valueUsd: lpValueUsd } = await lpBreak(
                    p.address,
                    ownLP.toString()
                );

                record.liquidityData = {
                    ownLiquidity: ownLP,
                    capacityPercent: BigNumber.min(totalSupply.eq(0) ? new BigNumber(0) : ownLP.multipliedBy(100).div(totalSupply), 100),
                    lpReserves,
                    lpValueUsd,
                };
            }
            return record;
        },
        [poolStatsRecords, ashBase, lpBreak, tokenMap]
    );

    const getPoolRecords = useRecoilCallback(
        ({ set }) =>
            async () => {
                const recordPromises: Promise<PoolRecord>[] = [];
                for (let i = 0; i < pools.length; i++) {
                    const p = pools[i];
                    if (p.isMaiarPool) continue;
                    recordPromises.push(getPoolRecord(p));
                }
                const records = await Promise.all(recordPromises);
                set(poolRecordsState, records);
            },
        [getPoolRecord]
    );

    const [deboundGetPoolRecords] = useDebounce(getPoolRecords, 500);
    useEffect(() => {
        deboundGetPoolRecords();
    }, [deboundGetPoolRecords]);

    useEffect(() => {
        setPoolRecordsRefresher(() => poolStatsRefresher);
    }, [setPoolRecordsRefresher, poolStatsRefresher])
};

export default usePoolsState;
