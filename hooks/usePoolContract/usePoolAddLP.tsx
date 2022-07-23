import {
    Address,
    AddressValue,
    BigUIntValue,
    ContractFunction,
    TokenIdentifierValue,
    TokenPayment,
} from "@elrondnetwork/erdjs/out";
import { accAddressState } from "atoms/dappState";
import BigNumber from "bignumber.js";
import { toEGLDD, toWei } from "helper/balance";
import PoolContract from "helper/contracts/pool";
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
                        gasLimit: 10_000_000,
                        args: [
                            new TokenIdentifierValue(pool.tokens[1].id),
                            new BigUIntValue(v1),
                            new TokenIdentifierValue("addLiquidity"),
                            new BigUIntValue(v0),
                            new BigUIntValue(v1),
                            new AddressValue(Address.Zero()),
                        ],
                    });
                    msg = `Add liquidity success ${formatAmount(
                        toEGLDD(pool.tokens[1].decimals, v1).toNumber(),
                        { notation: "standard" }
                    )} ${pool.tokens[1].symbol}`;
                } else if (v1.eq(0)) {
                    tx = await createTx(new Address(pool.address), {
                        func: new ContractFunction("ESDTTransfer"),
                        gasLimit: 10_000_000,
                        args: [
                            new TokenIdentifierValue(pool.tokens[0].id),
                            new BigUIntValue(v0),
                            new TokenIdentifierValue("addLiquidity"),
                            new BigUIntValue(v0),
                            new BigUIntValue(v1),
                            new AddressValue(Address.Zero()),
                        ],
                    });
                    msg = `Add liquidity success ${formatAmount(
                        toEGLDD(pool.tokens[0].decimals, v0).toNumber(),
                        { notation: "standard" }
                    )} ${pool.tokens[0].symbol}`;
                } else {
                    tx = await createTx(new Address(address), {
                        func: new ContractFunction("MultiESDTNFTTransfer"),
                        gasLimit: 10_000_000,
                        args: [
                            new AddressValue(new Address(pool.address)),
                            new BigUIntValue(new BigNumber(2)),

                            new TokenIdentifierValue(pool.tokens[0].id),
                            new BigUIntValue(new BigNumber(0)),
                            new BigUIntValue(v0),

                            new TokenIdentifierValue(pool.tokens[1].id),
                            new BigUIntValue(new BigNumber(0)),
                            new BigUIntValue(v1),

                            new TokenIdentifierValue("addLiquidity"),
                            new BigUIntValue(v0),
                            new BigUIntValue(v1),
                            new AddressValue(Address.Zero()),
                        ],
                    });
                    msg = `Add liquidity Success ${formatAmount(
                        toEGLDD(pool.tokens[0].decimals, v0).toNumber(),
                        { notation: "standard" }
                    )} ${pool.tokens[0].symbol} and ${formatAmount(
                        toEGLDD(pool.tokens[1].decimals, v1).toNumber(),
                        { notation: "standard" }
                    )} ${pool.tokens[1].symbol}`;
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

    const addLPV2 = useRecoilCallback(
        () => async (pool: IPool, tokensWei: BigNumber[]) => {
            const payments = pool.tokens
                .map((t, i) =>
                    TokenPayment.fungibleFromBigInteger(
                        t.id,
                        tokensWei[i],
                        t.decimals
                    )
                )
                .filter((p) => p.amountAsBigInteger.gt(0));
            const poolContract = new PoolContract(pool.address);
            const tx = await poolContract.addLiquidity(payments, tokensWei);
            return await sendTransactions({
                transactions: tx,
                transactionsDisplayInfo: {
                    successMessage: "transaction success from add LP V2",
                },
            });
        },
        []
    );

    return addLPV2;
};

export default usePoolAddLP;
