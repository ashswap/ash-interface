import {
    ashRawPoolByAddressQuery,
    ashRawPoolMapByIdSelector,
    LPBreakDownQuery,
    poolDeboundKeywordState,
    poolKeywordState,
    PoolRecord,
    poolRecordsState,
} from "atoms/poolsState";
import { lpTokenMapState } from "atoms/tokensState";
import BigNumber from "bignumber.js";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { blockTimeMs } from "const/dappConfig";
import pools from "const/pool";
import { fetcher } from "helper/common";
import useInterval from "hooks/useInterval";
import IPool from "interface/pool";
import { PoolStatsRecord } from "interface/poolStats";
import { useEffect } from "react";
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from "recoil";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

const usePoolsState = () => {
    const keyword = useRecoilValue(poolKeywordState);
    // const setPoolRecords = useSetRecoilState(poolRecordsState);
    const setDeboundKeyword = useSetRecoilState(poolDeboundKeywordState);
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
                const poolMapById = await snapshot.getPromise(
                    ashRawPoolMapByIdSelector
                );
                const totalSupply = poolMapById[lpTokenId]?.totalSupply || "0";
                if (totalSupply === "0") return new BigNumber(0);
                return ownLiquidity.multipliedBy(100).div(totalSupply);
            },
        []
    );

    const getPoolRecord = useRecoilCallback(
        ({ snapshot, set }) =>
            async (p: IPool) => {
                const lpTokenMap = await snapshot.getPromise(lpTokenMapState);
                const rawPool = await snapshot.getPromise(
                    ashRawPoolByAddressQuery(p.address)
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
                    const { lpReserves, valueUsd: lpValueUsd } =
                        await snapshot.getPromise(
                            LPBreakDownQuery({
                                poolAddress: p.address,
                                wei: ownLP.toString(),
                            })
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
        [getPortion, poolStatsRecords]
    );

    const getPoolRecords = useRecoilCallback(
        ({ snapshot, set }) =>
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
    useInterval(getPoolRecords, blockTimeMs);
};

export default usePoolsState;
