import styles from "./PoolMenu.module.css";
import { usePools } from "context/pools";

const PoolMenu = () => {
    const {stakedOnly, setStakedOnly} = usePools();

    return (
        <div className={`${styles.container} text-black dark:text-text-input-3`}>
            <div
                className={`${styles.btn} ${
                    !stakedOnly ? styles.active : ""
                }`}
                onClick={() => setStakedOnly(false)}
            >
                All Pools
            </div>
            <div
                className={`${styles.btn} ${
                    stakedOnly ? styles.active : ""
                }`}
                onClick={() => setStakedOnly(true)}
            >
                Your Pools
            </div>
        </div>
    );
};

export default PoolMenu;
