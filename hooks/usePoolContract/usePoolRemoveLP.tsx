import { TokenPayment } from "@elrondnetwork/erdjs/out";
import BigNumber from "bignumber.js";
import { toWei } from "helper/balance";
import PoolContract from "helper/contracts/pool";
import { formatAmount } from "helper/number";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import IPool from "interface/pool";
import { useRecoilCallback } from "recoil";

const usePoolRemoveLP = (trackStatus = false) => {
    const { sendTransactions, trackingData, sessionId } =
        useSendTxsWithTrackStatus(trackStatus);
    const func = useRecoilCallback(
        () =>
            async (
                pool: IPool,
                liquidity: BigNumber,
                estimatedAmtOut: BigNumber.Value[],
                slippage: number
            ) => {
                const tokenPayment = TokenPayment.fungibleFromBigInteger(
                    pool.lpToken.id,
                    liquidity,
                    pool.lpToken.decimals
                );
                const tokensAmtMin = estimatedAmtOut.map((v, i) =>
                    toWei(pool.tokens[i], v.toString())
                        .multipliedBy(1 - slippage)
                        .integerValue(BigNumber.ROUND_DOWN)
                );

                const tx = await new PoolContract(pool.address).removeLiquidity(
                    tokenPayment,
                    tokensAmtMin
                );
                return await sendTransactions({
                    transactions: tx,
                    transactionsDisplayInfo: {
                        successMessage: `Remove Liquidity Success ${formatAmount(
                            +estimatedAmtOut[0].toString(),
                            { notation: "standard" }
                        )} ${pool.tokens[0].symbol} and ${formatAmount(
                            +estimatedAmtOut[1].toString(),
                            {
                                notation: "standard",
                            }
                        )} ${pool.tokens[1].symbol}`,
                    },
                });
            },
        [sendTransactions]
    );

    return { removeLP: func, trackingData, sessionId };
};

export default usePoolRemoveLP;
