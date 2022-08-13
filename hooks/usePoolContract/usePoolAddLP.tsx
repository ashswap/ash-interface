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
                        t.identifier,
                        tokensWei[i],
                        t.decimals
                    )
                )
                .filter((p) => p.amountAsBigInteger.gt(0));
            const tx = await poolContract.addLiquidity(payments, tokensWei);
            const receipt = pool.tokens
                .map(
                    (t, i) =>
                        `${formatAmount(
                            toEGLDD(t.decimals, tokensWei[i]).toNumber(),
                            { notation: "standard" }
                        )} ${t.symbol}`
                )
                .join(", ")
                .replace(/\,$/, "");
            return await sendTransactions({
                transactions: tx,
                transactionsDisplayInfo: {
                    successMessage: `Add liquidity Success ${receipt}`,
                },
            });
        }
    );
    return func;
};

export default usePoolAddLP;
