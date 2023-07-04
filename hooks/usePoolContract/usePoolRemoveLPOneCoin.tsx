import { TokenTransfer } from "@multiversx/sdk-core/out";
import { accInfoState } from "atoms/dappState";
import BigNumber from "bignumber.js";
import { TOKENS_MAP } from "const/tokens";
import { WRAPPED_EGLD } from "const/wrappedEGLD";
import { ContractManager } from "helper/contracts/contractManager";
import { Percent } from "helper/fraction/percent";
import { formatAmount } from "helper/number";
import { TokenAmount } from "helper/token/tokenAmount";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import IPool, { EPoolType } from "interface/pool";
import { useRecoilCallback } from "recoil";

const usePoolRemoveLPOneCoin = (trackStatus = false) => {
    const { sendTransactions, trackingData, sessionId } =
        useSendTxsWithTrackStatus(trackStatus);
    const func = useRecoilCallback(
        ({ snapshot }) =>
            async (
                pool: IPool,
                liquidity: BigNumber,
                tokenAmountOut: TokenAmount,
                slippage: Percent,
                tokenIndex: number
            ) => {
                const tokenPayment = TokenTransfer.fungibleFromBigInteger(
                    pool.lpToken.identifier,
                    liquidity,
                    pool.lpToken.decimals
                );

                const tokenAmtMin = tokenAmountOut.raw
                    .multipliedBy(
                        Percent.fromBigNumber(1)
                            .subtract(slippage)
                            .toBigNumber()
                    )
                    .integerValue(BigNumber.ROUND_DOWN);

                const tx =
                    pool.type === EPoolType.PoolV2
                        ? await ContractManager.getPoolV2Contract(
                              pool.address
                          ).removeLiquidityOneCoin(
                              tokenPayment,
                              tokenIndex,
                              tokenAmtMin
                          )
                        : await ContractManager.getPoolContract(
                              pool.address
                          ).removeLiquidityOneCoin(
                              tokenPayment,
                              pool.tokens[tokenIndex].identifier,
                              tokenAmtMin
                          );

                const txs = [tx];
                if (pool.tokens[tokenIndex].identifier === "EGLD") {
                    const shard =
                        (await snapshot.getPromise(accInfoState)).shard || 0;
                    const unwrapTx =
                        await ContractManager.getWrappedEGLDContract(
                            WRAPPED_EGLD.wegldContracts[shard]
                        ).unwrapEgld(
                            TokenTransfer.fungibleFromBigInteger(
                                WRAPPED_EGLD.wegld,
                                tokenAmtMin,
                                TOKENS_MAP[WRAPPED_EGLD.wegld].decimals
                            )
                        );
                    txs.push(unwrapTx);
                }

                const receipt = `${formatAmount(tokenAmountOut.egld, {
                    notation: "standard",
                })} ${tokenAmountOut.token.symbol}`;
                return await sendTransactions({
                    transactions: txs,
                    transactionsDisplayInfo: {
                        successMessage: `Remove Liquidity Success ${receipt}`,
                    },
                });
            },
        [sendTransactions]
    );

    return { removeLPOneCoin: func, trackingData, sessionId };
};

export default usePoolRemoveLPOneCoin;
