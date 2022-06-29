import { poolStakedOnlyState } from "atoms/poolsState";
import { useRecoilState } from "recoil";

const PoolMenu = () => {
    const [stakedOnly, setStakedOnly] = useRecoilState(poolStakedOnlyState);

    return (
        <div
            className={`flex flex-row gap-6 justify-start select-none text-lg font-bold text-black dark:text-text-input-3`}
        >
            <button
                className={`${!stakedOnly ? "text-pink-650" : ""}`}
                onClick={() => setStakedOnly(false)}
            >
                All Pools
            </button>
            <button
                className={`${stakedOnly ? "text-pink-650" : ""}`}
                onClick={() => setStakedOnly(true)}
            >
                Your Pools
            </button>
        </div>
    );
};

export default PoolMenu;
