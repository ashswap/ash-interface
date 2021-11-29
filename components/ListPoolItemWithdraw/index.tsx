import Image from "next/image";
import IPool from "interface/pool";
import styles from "./ListPoolItemWithdraw.module.css";
import { useState } from "react";
import AddLiquidityModal from "components/AddLiquidityModal";
import RemoveLiquidityModal from "components/RemoveLiquidityModal";
import { toEGLD } from "helper/balance";
import { usePool } from "components/ListPoolItem";

interface Props {
    pool: IPool;
    className?: string | undefined;
    dark?: boolean;
}

const ListPoolItemWithdraw = (props: Props) => {
    const [openAddLiquidity, setOpenAddLiquidity] = useState<boolean>(false);
    const [openRemoveLiquidity, setOpenRemoveLiquidity] = useState<boolean>(
        false
    );
    const { value0, value1, capacityPercent } = usePool();

    return (
        <div
            className={`${props.className || ""} flex flex-col ${
                props.dark ? "bg-ash-dark-600" : "bg-black"
            } ${styles.container}`}
        >
            <div className="flex flex-row text-white w-full">
                <div className="w-3/12 flex flex-row items-center">
                    <div className="flex flex-row justify-between items-center">
                        <div className={styles.tokenIcon}>
                            <Image src={props.pool.tokens[0].icon} alt="token icon" />
                        </div>
                        <div
                            className={styles.tokenIcon}
                            style={{
                                marginLeft: "-10px"
                            }}
                        >
                            <Image src={props.pool.tokens[1].icon} alt="token icon" />
                        </div>
                    </div>
                    <div style={{ fontSize: 10 }} className="px-3 font-bold">
                        &
                    </div>
                    <div className="font-bold text-lg">
                        <div className="flex flex-row items-center">
                            <span className="w-24">
                                {props.pool.tokens[0].name}
                            </span>
                            <span className="text-earn text-xs">
                                {toEGLD(
                                    props.pool.tokens[0],
                                    value0.toString()
                                ).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex flex-row items-center">
                            <span className="w-24">
                                {props.pool.tokens[1].name}
                            </span>
                            <span className="text-earn text-xs">
                                {toEGLD(
                                    props.pool.tokens[1],
                                    value1.toString()
                                ).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-2/12 flex flex-row items-center font-bold text-sm">
                    {capacityPercent.toFixed(3)}%
                </div>
                <div className="w-2/12 flex flex-col justify-center">
                    <span
                        className="text-yellow-600 underline select-none font-bold text-xs cursor-pointer"
                        onClick={() => setOpenRemoveLiquidity(true)}
                    >
                        Withdraw
                    </span>
                </div>
                <div className="w-2/12 flex flex-col justify-center">
                    <span
                        className="text-pink-600 underline select-none font-bold text-xs cursor-pointer"
                        onClick={() => setOpenAddLiquidity(true)}
                    >
                        Deposit more
                    </span>
                </div>
            </div>
            <AddLiquidityModal
                open={openAddLiquidity}
                onClose={() => setOpenAddLiquidity(false)}
                pool={props.pool}
            />
            <RemoveLiquidityModal
                open={openRemoveLiquidity}
                onClose={() => setOpenRemoveLiquidity(false)}
                pool={props.pool}
            />
        </div>
    );
};

export default ListPoolItemWithdraw;
