import { ashBaseStateRefresherAtom } from "atoms/ashswap";
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
                const farmTokensRefresher = await snapshot.getPromise(
                    farmTokensRefresherAtom
                );
                const ashBaseStateRefresher = await snapshot.getPromise(
                    ashBaseStateRefresherAtom
                );
                setTimeout(() => {
                    Promise.all([
                        tokenRefresher?.(),
                        farmTokensRefresher?.(),
                        ashBaseStateRefresher?.(),
                    ]);
                }, 500);
            },
        []
    );
    return fetchBalances;
};
