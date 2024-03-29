import {
    Address,
    BigUIntValue,
    ContractFunction,
    Interaction,
    TokenIdentifierValue,
    TokenTransfer,
    Transaction,
} from "@multiversx/sdk-core/out";
import { accAddressState, accInfoState } from "atoms/dappState";
import BigNumber from "bignumber.js";
import { TOKENS_MAP } from "const/tokens";
import { WRAPPED_EGLD } from "const/wrappedEGLD";
import { toEGLDD } from "helper/balance";
import { ContractManager } from "helper/contracts/contractManager";
import { formatAmount } from "helper/number";
import { getTokenIdFromCoin } from "helper/token";
import { IESDTInfo } from "helper/token/token";
import { useCreateTransaction } from "helper/transactionMethods";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import IPool, { EPoolType } from "interface/pool";
import { useRecoilCallback } from "recoil";

const usePoolSwap = (trackStatus = false) => {
    const { sendTransactions, trackingData, sessionId } =
        useSendTxsWithTrackStatus(trackStatus);
    const createTx = useCreateTransaction();
    const swap = useRecoilCallback(
        ({ snapshot }) =>
            async (
                pool: IPool,
                tokenIn: IESDTInfo,
                tokenOut: IESDTInfo,
                weiIn: BigNumber,
                minWeiOut: BigNumber
            ) => {
                const useEgldIn = tokenIn.identifier === "EGLD";
                const useEgldOut = tokenOut.identifier === "EGLD";
                const shard = (await snapshot.getPromise(accInfoState)).shard;
                const wegld = TOKENS_MAP[WRAPPED_EGLD.wegld];
                const wegldContract = WRAPPED_EGLD.wegldContracts[shard || 0];
                let tx: Interaction;
                if (pool.type === EPoolType.PoolV2) {
                    const poolContract = ContractManager.getPoolV2Contract(
                        pool.address
                    );
                    const tokenPayment = TokenTransfer.fungibleFromBigInteger(
                        getTokenIdFromCoin(tokenIn.identifier)!,
                        weiIn,
                        tokenIn.decimals
                    );
                    tx = await poolContract.exchange(tokenPayment, minWeiOut);
                } else {
                    const poolContract = ContractManager.getPoolContract(
                        pool.address
                    );
                    const tokenPayment = TokenTransfer.fungibleFromBigInteger(
                        getTokenIdFromCoin(tokenIn.identifier)!,
                        weiIn,
                        tokenIn.decimals
                    );
                    tx = await poolContract.exchange(
                        tokenPayment,
                        getTokenIdFromCoin(tokenOut.identifier)!,
                        minWeiOut
                    );
                }

                const txs = [tx];
                if (useEgldIn) {
                    const wrapTx = await ContractManager.getWrappedEGLDContract(
                        wegldContract
                    ).wrapEgld(weiIn);
                    txs.unshift(wrapTx);
                }
                if (useEgldOut) {
                    const unwrapTx =
                        await ContractManager.getWrappedEGLDContract(
                            wegldContract
                        ).unwrapEgld(
                            TokenTransfer.fungibleFromBigInteger(
                                wegld.identifier,
                                minWeiOut,
                                wegld.decimals
                            )
                        );
                    txs.push(unwrapTx);
                }

                return await sendTransactions({
                    interactions: txs,
                    transactionsDisplayInfo: {
                        successMessage: `Swap succeed ${formatAmount(
                            toEGLDD(tokenIn.decimals, weiIn).toNumber(),
                            { notation: "standard" }
                        )} ${tokenIn.symbol} to at least ${formatAmount(
                            toEGLDD(tokenOut.decimals, minWeiOut).toNumber(),
                            { notation: "standard" }
                        )} ${tokenOut.symbol}`,
                    },
                });
            },
        [sendTransactions]
    );

    return { swap, trackingData, sessionId };
};

export default usePoolSwap;
