import { TokenPayment } from "@elrondnetwork/erdjs/out";
import BigNumber from "bignumber.js";
import { toEGLDD } from "helper/balance";
import PoolContract from "helper/contracts/pool";
import { formatAmount } from "helper/number";
import { sendTransactions } from "helper/transactionMethods";
import IPool from "interface/pool";
import { useRecoilCallback } from "recoil";

const usePoolAddLP = () => {
    const func = useRecoilCallback(
        () => async (pool: IPool, tokensWei: BigNumber[]) => {
            const poolContract = new PoolContract(pool.address);
            const payments = pool.tokens
                .map((t, i) =>
                    TokenPayment.fungibleFromBigInteger(
                        t.id,
                        tokensWei[i],
                        t.decimals
                    )
                )
                .filter((p) => p.amountAsBigInteger.gt(0));
            const tx = await poolContract.addLiquidity(payments, tokensWei);
            return await sendTransactions({
                transactions: tx,
                transactionsDisplayInfo: {
                    successMessage: `Add liquidity Success ${formatAmount(
                        toEGLDD(
                            pool.tokens[0].decimals,
                            tokensWei[0]
                        ).toNumber(),
                        { notation: "standard" }
                    )} ${pool.tokens[0].symbol} and ${formatAmount(
                        toEGLDD(
                            pool.tokens[1].decimals,
                            tokensWei[1]
                        ).toNumber(),
                        { notation: "standard" }
                    )} ${pool.tokens[1].symbol}`,
                },
            });
        }
    );
    return func;
};

export default usePoolAddLP;
