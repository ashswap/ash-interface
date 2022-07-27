import {
    Address,
    BigUIntValue,
    ContractFunction,
    TokenIdentifierValue,
    TokenPayment,
    Transaction
} from "@elrondnetwork/erdjs/out";
import BigNumber from "bignumber.js";
import { toEGLDD } from "helper/balance";
import { ContractManager } from "helper/contracts/contractManager";
import { formatAmount } from "helper/number";
import { useCreateTransaction } from "helper/transactionMethods";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import IPool from "interface/pool";
import { IToken } from "interface/token";
import { useRecoilCallback } from "recoil";

const usePoolSwap = (trackStatus = false) => {
    const { sendTransactions, trackingData, sessionId } =
        useSendTxsWithTrackStatus(trackStatus);
    const createTx = useCreateTransaction();
    const swap = useRecoilCallback(
        () =>
            async (
                pool: IPool,
                tokenIn: IToken,
                tokenOut: IToken,
                weiIn: BigNumber,
                minWeiOut: BigNumber
            ) => {
                let tx: Transaction;
                if (pool.isMaiarPool) {
                    tx = await createTx(new Address(pool.address), {
                        func: new ContractFunction("ESDTTransfer"),
                        gasLimit: 8_000_000,
                        args: [
                            new TokenIdentifierValue(tokenIn.id),
                            new BigUIntValue(weiIn),
                            new TokenIdentifierValue("swapTokensFixedInput"),
                            new TokenIdentifierValue(tokenOut.id),
                            new BigUIntValue(minWeiOut),
                        ],
                    });
                } else {
                    const poolContract = ContractManager.getPoolContract(
                        pool.address
                    );
                    const tokenPayment = TokenPayment.fungibleFromBigInteger(
                        tokenIn.id,
                        weiIn,
                        tokenIn.decimals
                    );
                    tx = await poolContract.exchange(
                        tokenPayment,
                        tokenOut.id,
                        minWeiOut
                    );
                }

                return await sendTransactions({
                    transactions: tx,
                    transactionsDisplayInfo: {
                        successMessage: `Swap succeed ${formatAmount(
                            toEGLDD(tokenIn.decimals, weiIn).toNumber(),
                            { notation: "standard" }
                        )} ${tokenIn.symbol} to ${formatAmount(
                            toEGLDD(tokenOut.decimals, minWeiOut).toNumber(),
                            { notation: "standard" }
                        )} ${tokenOut.symbol}`,
                    },
                });
            },
        [createTx, sendTransactions]
    );

    return { swap, trackingData, sessionId };
};

export default usePoolSwap;
