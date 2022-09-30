import { lastCompletedTxHashAtom } from "atoms/transactions";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useDebounce } from "use-debounce";
import { useFetchBalances } from "./useFetchBalances";

export const useRefreshAfterTxCompleted = () => {
    const fetchBalances = useFetchBalances();
    const lastCompletedTxHash = useRecoilValue(lastCompletedTxHashAtom);
    const [deboundLastTxHash] = useDebounce(lastCompletedTxHash, 500);

    useEffect(() => {
        if (deboundLastTxHash) {
            fetchBalances()
        }
    }, [deboundLastTxHash, fetchBalances]);
};
