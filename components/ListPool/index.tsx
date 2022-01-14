import ListPoolItem from "components/ListPoolItem";
import { ViewType } from "components/PoolFilter";
import { useWallet } from "context/wallet";
import IPool from "interface/pool";
import { useRouter } from "next/router";
import { useMemo } from "react";
import styles from "./ListPool.module.css";

interface Props {
    items: IPool[];
    className?: string | undefined;
    view?: ViewType;
    search?: string;
}

const ListPool = (props: Props) => {
    const { balances } = useWallet();
    const router = useRouter();
    const poolType = router.query["type"];

    const pools = useMemo(() => {
        let pools = [];
        if (poolType !== "my-pool") {
            pools = props.items;
        } else {
            pools = props.items.filter(p =>
                Object.prototype.hasOwnProperty.call(balances, p.lpToken.id)
            );
        }

        if (!!props.search) {
            pools = pools.filter(
                p =>
                    p.tokens.findIndex(t =>
                        t.name
                            .toLowerCase()
                            .includes(props.search!.toLowerCase())
                    ) !== -1
            );
        }

        return pools;
    }, [props.items, props.search, balances, poolType]);

    return (
        <div
            className={`${props.className || ""} ${
                props.view == ViewType.Card
                    ? styles.containerCard
                    : styles.containerList
            }`}
        >
            {props.view == ViewType.List ? (
                poolType === "my-pool" ? (
                    <div
                        className={`flex items-center bg-ash-dark-600 text-text-input-3 h-12 text-2xs sm:text-xs border-b border-ash-dark-400`}
                    >
                        <div className="w-8/12 px-4 sm:px-11 flex items-center">
                            <div className="flex-grow flex space-x-4">
                                <div className="w-7/12 sm:w-1/2">#Pool</div>
                                <div className="w-5/12 sm:w-1/4 text-right sm:text-left">
                                    Your Liquidity
                                </div>
                                <div className="hidden sm:block w-1/4">
                                    Your capacity
                                </div>
                            </div>
                            <div className="hidden sm:block w-[7.25rem]"></div>
                        </div>
                        <div className="hidden sm:block w-4/12 pl-11 pr-1 border-l border-l-ash-gray-500">
                            Total Farming
                        </div>
                        <div className="block sm:hidden w-4/12 text-right pr-4">
                            Farming
                        </div>
                    </div>
                ) : (
                    <div className="bg-ash-dark-600 px-4 lg:pl-11 lg:pr-3 text-2xs sm:text-xs border-b border-ash-dark-400">
                        <div
                            className={`flex text-text-input-3 h-12 items-center w-full sm:w-[80%] space-x-1`}
                        >
                            <div className="hidden sm:block w-3/12">
                                Deposite
                            </div>
                            <div className="sm:hidden w-[45%]">#Pool</div>
                            <div className="w-[18%] sm:w-2/12 text-white">
                                APR Earn
                            </div>
                            <div className="hidden sm:block w-3/12">
                                Farming per day
                            </div>
                            <div className="hidden sm:block w-2/12 text-right sm:mr-1">
                                Total Liquidity
                            </div>
                            <div className="w-[37%] sm:w-2/12 text-right sm:mr-4">
                                24H Volume
                            </div>
                        </div>
                    </div>
                )
            ) : null}
            {pools.map((pool, i) => {
                return (
                    <ListPoolItem
                        key={pool.address}
                        dark={i % 2 === 0}
                        pool={pool}
                        view={props.view}
                    />
                );
            })}
        </div>
    );
};

export default ListPool;
