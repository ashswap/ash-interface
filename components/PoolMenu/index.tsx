import { useCallback } from "react";
import { useRouter } from "next/router";
import styles from "./PoolMenu.module.css";

const PoolMenu = () => {
    const router = useRouter();

    const isActive = useCallback((t: string) => router.query["type"] === t, [
        router
    ]);

    return (
        <div className={styles.container}>
            <div
                className={`${styles.btn} ${
                    !isActive("my-pool") ? styles.active : ""
                }`}
                onClick={() =>
                    router.push("/pool", undefined, { shallow: true })
                }
            >
                All Pools
            </div>
            <div
                className={`${styles.btn} ${
                    isActive("my-pool") ? styles.active : ""
                }`}
                onClick={() =>
                    router.push("/pool?type=my-pool", undefined, {
                        shallow: true
                    })
                }
            >
                Your Pools
            </div>
        </div>
    );
};

export default PoolMenu;
