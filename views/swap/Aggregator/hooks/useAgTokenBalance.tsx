import { accBalanceState } from "atoms/dappState";
import { TOKENS_MAP } from "const/tokens";
import { isEGLD } from "helper/token";
import { TokenAmount } from "helper/token/tokenAmount";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import useAgTokensBalance from "./useAgTokensBalance";

const useAgTokenBalance = (tokenId: string) => {
    const agBalances = useAgTokensBalance();
    const egldBalance = useRecoilValue(accBalanceState);
    const balance = useMemo(() => {
        if(isEGLD(tokenId)){
            return new TokenAmount(TOKENS_MAP.EGLD, egldBalance);
        }
        const balance = agBalances.find(amt => amt.token.identifier === tokenId);
        return balance;
    }, [agBalances, egldBalance, tokenId]);
    return balance;
}

export default useAgTokenBalance;