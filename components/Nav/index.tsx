import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";
import styles from "./Nav.module.css";
import SocialMenu from "./SocialMenu";
import ICPool from "../../assets/svg/pool.svg";
import ICSwap from "../../assets/svg/swap.svg";

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
                <ICSwap className="inline-block w-4 h-4 sm:mr-2 transition-none"/>
                <span className="inline-block">Swap</span>
            </div>
        </Link>
        <Link href="/pool" passHref>
            <div
                className={`${styles.btn} ${
                    isActive("/pool") ? styles.active : ""
                }`}
            >
                <ICPool className="inline-block w-4 h-4 sm:mr-2 transition-none"/>
                <span className="inline-block">Pool</span>
            </div>
        </Link>
        <SocialMenu />
    </div>
    );
};

export default Nav;
