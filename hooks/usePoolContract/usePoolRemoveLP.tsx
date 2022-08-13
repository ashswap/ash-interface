import { TokenPayment } from "@elrondnetwork/erdjs/out";
import BigNumber from "bignumber.js";
import { toEGLDD, toWei } from "helper/balance";
import PoolContract from "helper/contracts/pool";
import { Percent } from "helper/fraction/percent";
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
                slippage: Percent
            ) => {
                const tokenPayment = TokenPayment.fungibleFromBigInteger(
                    pool.lpToken.identifier,
                    liquidity,
                    pool.lpToken.decimals
                );
                const tokensAmtMin = estimatedAmtOut.map((v, i) =>
                    toWei(pool.tokens[i], v.toString())
                        .multipliedBy(
                            Percent.fromBigNumber(1)
                                .subtract(slippage)
                                .toBigNumber()
                        )
                        .integerValue(BigNumber.ROUND_DOWN)
                );

                const tx = await new PoolContract(pool.address).removeLiquidity(
                    tokenPayment,
                    tokensAmtMin
                );
                const receipt = pool.tokens
                    .map(
                        (t, i) =>
                            `${formatAmount(
                                toEGLDD(
                                    t.decimals,
                                    estimatedAmtOut[i]
                                ).toNumber(),
                                {
                                    notation: "standard",
                                }
                            )} ${t.symbol}`
                    )
                    .join(", ")
                    .replace(/\,$/, "");
                return await sendTransactions({
                    transactions: tx,
                    transactionsDisplayInfo: {
                        successMessage: `Remove Liquidity Success ${receipt}`,
                    },
                });
            },
        [sendTransactions]
    );

    return { removeLP: func, trackingData, sessionId };
};

export default usePoolRemoveLP;
