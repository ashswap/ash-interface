import { useMemo, useEffect } from "react";
import ListPoolItem from "components/ListPoolItem";
import PoolCard from "components/PoolCard";
import { ViewType } from "components/PoolFilter";
import { useWallet } from "context/wallet";
import { useRouter } from "next/router";
import IPool from "interface/pool";
import styles from "./ListPool.module.css";

interface Props {
    items: IPool[];
    className?: string | undefined;
    view?: ViewType;
    search?: string;
}

const ListPool = (props: Props) => {
    const { provider, balances } = useWallet();
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
            pools = pools.filter(p => p.tokens.findIndex(t => t.name.toLowerCase().includes(props.search!.toLowerCase())) !== -1)
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
            {pools.map((pool, i) => {
                if (props.view == ViewType.Card) {
                    return (
                        <PoolCard
                            key={pool.address}
                            pool={pool}
                            type={
                                poolType === "my-pool" ? "withdraw" : "deposit"
                            }
                        />
                    );
                } else {
                    return (
                        <ListPoolItem
                            key={pool.address}
                            pool={pool}
                            dark={i % 2 === 0}
                        />
                    );
                }
            })}
        </div>
    );
};

export default ListPool;
