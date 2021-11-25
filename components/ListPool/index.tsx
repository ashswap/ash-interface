import { useMemo } from "react";
import ListPoolItemDeposit from "components/ListPoolItemDeposit";
import PoolCard from "components/PoolCard";
import { ViewType } from "components/PoolFilter";
import { useWallet } from "context/wallet";
import { useRouter } from "next/router";
import IPool from "interface/pool";
import styles from "./ListPool.module.css";
import ListPoolItemWithdraw from "components/ListPoolItemWithdraw";
import ListPoolItem from "components/ListPoolItem";

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
                        className={`flex flex-row bg-ash-dark-600 text-text-input-3 ${styles.listHeader}`}
                    >
                        <div className="w-3/12">Your Liquidity</div>
                        <div className="w-2/12">Your capacity</div>
                    </div>
                ) : (
                    <div
                        className={`flex flex-row bg-ash-dark-600 text-text-input-3 ${styles.listHeader}`}
                    >
                        <div className="w-2/12">Deposite</div>
                        <div className="w-1/12">APR Earn</div>
                        <div className="w-2/12">Farming per day</div>
                        <div className="w-2/12">Total Liquidity</div>
                        <div className="w-2/12">24H Volume</div>
                    </div>
                )
            ) : null}
            {pools.map((pool, i) => {
                return <ListPoolItem key={pool.address} dark={i % 2 === 0} pool={pool} view={props.view} />;
            })}
        </div>
    );
};

export default ListPool;
