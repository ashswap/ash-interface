import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";
import styles from "./Nav.module.css";

const Nav = () => {
    const router = useRouter();

    const isActive = useCallback((path: string) => router.route === path, [
        router
    ]);

    return (
        <div className={`${styles.container} text-black dark:text-white space-x-[0.375rem]`}>
        <Link href="/swap" passHref>
            <div
                className={`${styles.btn} ${
                    isActive("/swap") ? styles.active : ""
                }`}
            >
                Swap
            </div>
        </Link>
        <Link href="/pool" passHref>
            <div
                className={`${styles.btn} ${
                    isActive("/pool") ? styles.active : ""
                }`}
            >
                Pool
            </div>
        </Link>
    </div>
    );
};

export default Nav;
