import { TokenPayment } from "@elrondnetwork/erdjs/out";
import BigNumber from "bignumber.js";
import { toEGLDD } from "helper/balance";
import { ContractManager } from "helper/contracts/contractManager";
import PoolContract from "helper/contracts/pool";
import { formatAmount } from "helper/number";
import { sendTransactions } from "helper/transactionMethods";
import IPool, { EPoolType } from "interface/pool";
import { useRecoilCallback } from "recoil";

const usePoolAddLP = () => {
    const func = useRecoilCallback(
        () =>
            async (
                pool: IPool,
                tokensWei: BigNumber[],
                mintAmtMin: BigNumber
            ) => {
                const poolContract = pool.type === EPoolType.PoolV2 ? ContractManager.getPoolV2Contract(pool.address) : ContractManager.getPoolContract(pool.address);
                const payments = pool.tokens
                    .map((t, i) =>
                        TokenPayment.fungibleFromBigInteger(
                            t.identifier,
                            tokensWei[i],
                            t.decimals
                        )
                    )
                    .filter((p) => p.amountAsBigInteger.gt(0));

                const tx = await poolContract.addLiquidity(
                    payments,
                    mintAmtMin
                );
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
