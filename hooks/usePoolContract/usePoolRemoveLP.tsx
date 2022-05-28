import {
    Address,
    BigUIntValue,
    ContractFunction,
    GasLimit,
    TokenIdentifierValue,
} from "@elrondnetwork/erdjs/out";
import BigNumber from "bignumber.js";
import { toEGLDD, toWei } from "helper/balance";
import { formatAmount } from "helper/number";
import {
    sendTransactions,
    useCreateTransaction,
} from "helper/transactionMethods";
import { DappSendTransactionsPropsType } from "interface/dappCore";
import IPool from "interface/pool";
import { useRecoilCallback } from "recoil";

const usePoolRemoveLP = () => {
    const createTx = useCreateTransaction();
    const removeLP = useRecoilCallback(
        ({ snapshot }) =>
            async (
                pool: IPool,
                liquidity: BigNumber,
                v0: BigNumber,
                v1: BigNumber,
                slippage: number
            ) => {
                let tx = await createTx(new Address(pool.address), {
                    func: new ContractFunction("ESDTTransfer"),
                    gasLimit: new GasLimit(9_000_000),
                    args: [
                        new TokenIdentifierValue(Buffer.from(pool.lpToken.id)),
                        new BigUIntValue(liquidity),
                        new TokenIdentifierValue(
                            Buffer.from("removeLiquidity")
                        ),
                        new BigUIntValue(
                            new BigNumber(
                                v0.multipliedBy(1 - slippage).toFixed(0)
                            )
                        ),
                        new BigUIntValue(
                            new BigNumber(
                                v1.multipliedBy(1 - slippage).toFixed(0)
                            )
                        ),
                    ],
                });
                const payload: DappSendTransactionsPropsType = {
                    transactions: tx,
                    transactionsDisplayInfo: {
                        successMessage: `Remove Liquidity Success ${formatAmount(
                            toEGLDD(pool.tokens[0].decimals, v0).toNumber(),
                            { notation: "standard" }
                        )} ${pool.tokens[0].name} and ${formatAmount(
                            toEGLDD(pool.tokens[1].decimals, v1).toNumber(),
                            { notation: "standard" }
                        )} ${pool.tokens[1].name}`,
                    },
                };
                return await sendTransactions(payload);
            },
        [createTx]
    );

    return removeLP;
};

export default usePoolRemoveLP;
