import { farmTokensRefresherAtom } from "atoms/farmsState";
import { tokensRefresherAtom } from "atoms/tokensState";
import { useRecoilCallback } from "recoil";

export const useFetchBalances = () => {
    const fetchBalances = useRecoilCallback(
        ({ snapshot, set }) =>
            async () => {
                const tokenRefresher = await snapshot.getPromise(
                    tokensRefresherAtom
                );
                const farmTokensRefresher = await snapshot.getPromise(farmTokensRefresherAtom);
                Promise.all([tokenRefresher?.(), farmTokensRefresher?.()]);
            },
        []
    );
    return fetchBalances;
};
