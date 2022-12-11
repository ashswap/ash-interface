import { ashswapBaseState } from "atoms/ashswap";
import {
    govLockedAmtState,
    govTotalLockedAmtState,
    govTotalLockedPctState,
    govUnlockTSState,
    govVeASHAmtState
} from "atoms/govState";
import BigNumber from "bignumber.js";
import { ASH_TOKEN } from "const/tokens";
import { estimateVeASH } from "helper/voteEscrow";
import moment from "moment";
import { useEffect } from "react";
import { useRecoilCallback, useRecoilValue } from "recoil";

const useVEState = () => {
    const ashBase = useRecoilValue(ashswapBaseState);
    const totalLockedAmt = useRecoilValue(govTotalLockedAmtState);
    const accLockedAmt = useRecoilValue(govLockedAmtState);
    const accUnlockTS = useRecoilValue(govUnlockTSState);
    const getTotalLockedASHPct = useRecoilCallback(
        ({ set }) =>
            async () => {
                const { ashSupply } = ashBase;
                const totalSupply = new BigNumber(ashSupply);
                if (totalSupply.eq(0)) set(govTotalLockedPctState, 0);
                return set(
                    govTotalLockedPctState,
                    totalLockedAmt
                        .multipliedBy(100)
                        .div(totalSupply)
                        .toNumber()
                );
            },
        [ashBase, totalLockedAmt]
    );

    const getAccVe = useRecoilCallback(
        ({ set }) =>
            async () => {
                const lockSecs = accUnlockTS.minus(moment().unix()).toNumber();
                set(
                    govVeASHAmtState,
                    new BigNumber(
                        lockSecs > 0 ? estimateVeASH(accLockedAmt, lockSecs) : 0
                    )
                );
            },
        [accLockedAmt, accUnlockTS]
    );

    useEffect(() => {getTotalLockedASHPct()}, [getTotalLockedASHPct]);
    useEffect(() => {getAccVe()}, [getAccVe]);
};

export default useVEState;
