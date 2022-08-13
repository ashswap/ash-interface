import { ashswapBaseState } from "atoms/ashswap";
import {
    govLockedAmtState,
    govTotalLockedAmtState,
    govTotalLockedPctState,
    govUnlockTSState,
    govVeASHAmtState,
} from "atoms/govState";
import BigNumber from "bignumber.js";
import { blockTimeMs } from "const/dappConfig";
import { ASH_TOKEN } from "const/tokens";
import { estimateVeASH } from "helper/voteEscrow";
import useInterval from "hooks/useInterval";
import moment from "moment";
import { useRecoilCallback } from "recoil";

const useVEState = () => {
    const getTotalLockedASHPct = useRecoilCallback(
        ({ snapshot, set }) =>
            async () => {
                const totalLockedAmt = await snapshot.getPromise(
                    govTotalLockedAmtState
                );
                const { ashSupply } = await snapshot.getPromise(
                    ashswapBaseState
                );
                const totalSupply = new BigNumber(ashSupply);
                if (totalSupply.eq(0)) set(govTotalLockedPctState, 0);
                return set(
                    govTotalLockedPctState,
                    totalLockedAmt
                        .multipliedBy(100)
                        .div(totalSupply)
                        .div(
                            new BigNumber(10).exponentiatedBy(
                                ASH_TOKEN.decimals
                            )
                        )
                        .toNumber()
                );
            },
        []
    );

    const getAccVe = useRecoilCallback(
        ({ snapshot, set }) =>
            async () => {
                const ashWei = await snapshot.getPromise(govLockedAmtState);
                const unlockTS = await snapshot.getPromise(govUnlockTSState);
                const lockSecs = unlockTS.minus(moment().unix()).toNumber();
                set(
                    govVeASHAmtState,
                    new BigNumber(
                        lockSecs > 0 ? estimateVeASH(ashWei, lockSecs) : 0
                    )
                );
            },
        []
    );

    useInterval(getTotalLockedASHPct, blockTimeMs);
    useInterval(getAccVe, blockTimeMs);
};

export default useVEState;
