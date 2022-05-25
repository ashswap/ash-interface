import { poolStakedOnlyState } from "atoms/poolsState";
import { useRecoilState } from "recoil";
import styles from "./PoolMenu.module.css";

const PoolMenu = () => {
    const [stakedOnly, setStakedOnly] = useRecoilState(poolStakedOnlyState);

    return (
        <div
            className={`${styles.container} text-black dark:text-text-input-3`}
        >
            <div
                className={`${styles.btn} ${!stakedOnly ? styles.active : ""}`}
                onClick={() => setStakedOnly(false)}
            >
                All Pools
            </div>
            <div
                className={`${styles.btn} ${stakedOnly ? styles.active : ""}`}
                onClick={() => setStakedOnly(true)}
            >
                Your Pools
            </div>
        </div>
    );
};

export default PoolMenu;
