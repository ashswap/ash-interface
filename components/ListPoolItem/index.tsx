import IPool from "interface/pool";
import styles from "./ListPoolItem.module.css";
import { useState } from "react";

interface Props {
    pool: IPool;
    className?: string | undefined;
    dark?: boolean;
}

const ListPoolItem = (props: Props) => {
    const [isExpand, setIsExpand] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    return (
        <div
            className={`${props.className || ""} flex flex-row ${
                props.dark ? "bg-ash-dark-600" : "bg-black"
            } ${styles.container}`}
        >
            <div className="flex flex-row justify-between items-center text-white">
                <div className="flex flex-row justify-between items-center">
                    <div
                        className={styles.tokenIcon}
                        style={{ backgroundColor: props.pool.tokens[0].icon }}
                    ></div>
                    <div
                        className={styles.tokenIcon}
                        style={{
                            backgroundColor: props.pool.tokens[1].icon,
                            marginLeft: "-10px"
                        }}
                    ></div>
                </div>
                <div style={{ fontSize: 10 }} className="px-3 font-bold">
                    &
                </div>
                <div className="font-bold">
                    <div>{props.pool.tokens[0].name}</div>
                    <div>{props.pool.tokens[1].name}</div>
                </div>
            </div>
            <div className="flex flex-row items-center text-yellow-600">
                921%
            </div>
            <div className="flex flex-col justify-center">
                <div className="text-earn">
                    <span className="font-bold text-sm">0.52 </span>
                    <span className="font-normal" style={{ fontSize: 10 }}>
                        {props.pool.tokens[0].name}
                    </span>
                </div>
                <div className="text-white" style={{ fontSize: 10 }}>
                    per 1,000 {props.pool.tokens[1].name}
                </div>
            </div>
        </div>
    );
};

export default ListPoolItem;
