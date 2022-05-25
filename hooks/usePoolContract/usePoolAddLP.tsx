import {
    Address,
    AddressValue,
    BigUIntValue,
    ContractFunction,
    GasLimit,
    TokenIdentifierValue,
} from "@elrondnetwork/erdjs/out";
import { accAddressState } from "atoms/dappState";
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

const usePoolAddLP = () => {
    const createTx = useCreateTransaction();
    const addLP = useRecoilCallback(
        ({ snapshot, set }) =>
            async (pool: IPool, v0: BigNumber, v1: BigNumber) => {
                const address = await snapshot.getPromise(accAddressState);
                let tx;
                let msg = "";
                if (v0.eq(0)) {
                    tx = await createTx(new Address(pool.address), {
                        func: new ContractFunction("ESDTTransfer"),
                        gasLimit: new GasLimit(10_000_000),
                        args: [
                            new TokenIdentifierValue(
                                Buffer.from(pool.tokens[1].id)
                            ),
                            new BigUIntValue(v1),
                            new TokenIdentifierValue(
                                Buffer.from("addLiquidity")
                            ),
                            new BigUIntValue(v0),
                            new BigUIntValue(v1),
                            new AddressValue(Address.Zero()),
                        ],
                    });
                    msg = `Add liquidity success ${formatAmount(
                        toEGLDD(pool.tokens[1].decimals, v1).toNumber(),
                        { notation: "standard" }
                    )} ${pool.tokens[1].name}`;
                } else if (v1.eq(0)) {
                    tx = await createTx(new Address(pool.address), {
                        func: new ContractFunction("ESDTTransfer"),
                        gasLimit: new GasLimit(10_000_000),
                        args: [
                            new TokenIdentifierValue(
                                Buffer.from(pool.tokens[0].id)
                            ),
                            new BigUIntValue(v0),
                            new TokenIdentifierValue(
                                Buffer.from("addLiquidity")
                            ),
                            new BigUIntValue(v0),
                            new BigUIntValue(v1),
                            new AddressValue(Address.Zero()),
                        ],
                    });
                    msg = `Add liquidity success ${formatAmount(
                        toEGLDD(pool.tokens[0].decimals, v0).toNumber(),
                        { notation: "standard" }
                    )} ${pool.tokens[0].name}`;
                } else {
                    tx = await createTx(new Address(address), {
                        func: new ContractFunction("MultiESDTNFTTransfer"),
                        gasLimit: new GasLimit(10_000_000),
                        args: [
                            new AddressValue(new Address(pool.address)),
                            new BigUIntValue(new BigNumber(2)),

                            new TokenIdentifierValue(
                                Buffer.from(pool.tokens[0].id)
                            ),
                            new BigUIntValue(new BigNumber(0)),
                            new BigUIntValue(v0),

                            new TokenIdentifierValue(
                                Buffer.from(pool.tokens[1].id)
                            ),
                            new BigUIntValue(new BigNumber(0)),
                            new BigUIntValue(v1),

                            new TokenIdentifierValue(
                                Buffer.from("addLiquidity")
                            ),
                            new BigUIntValue(v0),
                            new BigUIntValue(v1),
                            new AddressValue(Address.Zero()),
                        ],
                    });
                    msg = `Add liquidity Success ${formatAmount(
                        toEGLDD(pool.tokens[0].decimals, v0).toNumber(),
                        { notation: "standard" }
                    )} ${pool.tokens[0].name} and ${formatAmount(
                        toEGLDD(pool.tokens[1].decimals, v1).toNumber(),
                        { notation: "standard" }
                    )} ${pool.tokens[1].name}`;
                }

                const payload: DappSendTransactionsPropsType = {
                    transactions: tx,
                    transactionsDisplayInfo: {
                        successMessage: msg,
                    },
                };
                return await sendTransactions(payload);
            },
        [createTx]
    );

    return addLP;
};

export default usePoolAddLP;
