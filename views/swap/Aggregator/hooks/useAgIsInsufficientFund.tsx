import BigNumber from "bignumber.js";
import useAgTokensBalance from "./useAgTokensBalance";
import { useRecoilValue } from "recoil";
import { accBalanceState } from "atoms/dappState";
import { useMemo } from "react";
import { isEGLD } from "helper/token";

const useAgIsInsufficientFund = (tokenId: string, amount: BigNumber.Value) => {
    const agBalances = useAgTokensBalance();
    const egldBalance = useRecoilValue(accBalanceState);
    const isInsufficientFund = useMemo(() => {
        if(isEGLD(tokenId)){
            return new BigNumber(amount).gt(egldBalance);
        }
        const balance = agBalances.find(amt => amt.token.identifier === tokenId)?.raw || 0;
        return new BigNumber(amount).gt(balance);
    }, [agBalances, amount, egldBalance, tokenId]);
    return isInsufficientFund;
}

export default useAgIsInsufficientFund;