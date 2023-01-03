import { ashswapBaseState } from "atoms/ashswap";
import {
    ashRawPoolMapByIdSelector,
    LPBreakDownQuery,
    poolDeboundKeywordState,
    poolKeywordState,
    PoolRecord,
    poolRecordsState,
    poolStatsRefresherAtom,
} from "atoms/poolsState";
import { lpTokenMapState } from "atoms/tokensState";
import BigNumber from "bignumber.js";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import pools from "const/pool";
import { fetcher } from "helper/common";
import IPool from "interface/pool";
import { PoolStatsRecord } from "interface/poolStats";
import { useCallback, useEffect } from "react";
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from "recoil";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

const usePoolsState = () => {
    const keyword = useRecoilValue(poolKeywordState);
    const ashBase = useRecoilValue(ashswapBaseState);
    const poolMapById = useRecoilValue(ashRawPoolMapByIdSelector);
    const lpTokenMap = useRecoilValue(lpTokenMapState);
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

    const getPortion = useCallback(
        async (lpTokenId: string, ownLiquidity: BigNumber) => {
            const totalSupply = poolMapById[lpTokenId]?.totalSupply || "0";
            if (totalSupply === "0") return new BigNumber(0);
            return ownLiquidity.multipliedBy(100).div(totalSupply);
        },
        [poolMapById]
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
            const rawPool = ashBase.pools.find(
                (_p) => _p.address === p.address
            );
            let record: PoolRecord = {
                pool: p,
                poolStats: poolStatsRecords?.find(
                    (stats) => stats.address === p.address
                ),
                totalSupply: new BigNumber(rawPool?.totalSupply || 0),
            };
            const ownLP = new BigNumber(
                lpTokenMap[p.lpToken.identifier]?.balance || 0
            );
            if (ownLP.gt(0)) {
                const { lpReserves, valueUsd: lpValueUsd } = await lpBreak(
                    p.address,
                    ownLP.toString()
                );
                record.liquidityData = {
                    ownLiquidity: ownLP,
                    capacityPercent: await getPortion(
                        p.lpToken.identifier,
                        ownLP
                    ),
                    lpReserves,
                    lpValueUsd,
                };
            }
            return record;
        },
        [getPortion, poolStatsRecords, ashBase, lpBreak, lpTokenMap]
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
