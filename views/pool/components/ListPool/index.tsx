import ImgAshSleep from "assets/images/ash-sleep.png";
import { poolStakedOnlyState, poolToDisplayState } from "atoms/poolsState";
import IPool from "interface/pool";
import Image from "components/Image";
import Link from "next/link";
import { useMemo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import PoolCardItem from "views/pool/components/PoolCardItem";
import StakedPoolCardItem from "views/pool/components/StakedPoolCardItem";

interface Props {
    items: IPool[];
    className?: string | undefined;
}

const ListPool = (props: Props) => {
    const poolToDisplay = useRecoilValue(poolToDisplayState);
    const [stakedOnly, setStakedOnly] = useRecoilState(poolStakedOnlyState);

    const stakedPools = useMemo(() => {
        return poolToDisplay.filter((p) => !!p.liquidityData);
    }, [poolToDisplay]);

    const firstUnstakePoolIndex = useMemo(() => {
        return poolToDisplay.findIndex((p) => !p.liquidityData);
    }, [poolToDisplay]);

    return (
        <div className={props.className}>
            <div
                className={`grid gap-4 lg:gap-[1.875rem] grid-cols-[repeat(auto-fill,minmax(320px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(350px,1fr))]`}
            >
                {!stakedOnly &&
                    poolToDisplay.map((p, i) => {
                        return (
                            <div key={p.pool.address}>
                                {!!p.liquidityData ? (
                                    <StakedPoolCardItem poolData={p} />
                                ) : (
                                    <PoolCardItem
                                        poolData={p}
                                        withTooltip={
                                            firstUnstakePoolIndex === i
                                        }
                                    />
                                )}
                            </div>
                        );
                    })}
                {stakedOnly &&
                    stakedPools.map((p) => (
                        <StakedPoolCardItem key={p.pool.address} poolData={p} />
                    ))}
            </div>
            {stakedOnly && stakedPools.length === 0 && (
                <div>
                    <div className="p-4 sm:px-6 sm:py-3.5 bg-stake-dark-400 text-yellow-500 text-xs sm:text-sm font-bold sm:text-center mb-14 sm:mb-18">
                        <span>
                            If you staked your LP tokens in a LP-Stake Farm,{" "}
                        </span>
                        <Link href="/stake/farms">
                            <a>
                                <span className="underline text-yellow-500">
                                    unstake
                                </span>
                            </a>
                        </Link>
                        <span> them to see them here.</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="text-lg sm:text-[2rem] font-bold text-ash-gray-600">
                            Your phoenix is still sleeping
                        </div>
                        <div className="w-36 sm:w-48 mb-3 sm:mb-4">
                            <Image
                                src={ImgAshSleep}
                                alt="ash sleep"
                                layout="responsive"
                                className="mix-blend-luminosity"
                            />
                        </div>
                        <button
                            className="clip-corner-1 clip-corner-br bg-pink-600 w-44 sm:w-56 h-12 sm:h-14 flex items-center justify-center text-center text-xs sm:text-sm font-bold"
                            onClick={() => setStakedOnly(false)}
                        >
                            Add liquidity
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListPool;
