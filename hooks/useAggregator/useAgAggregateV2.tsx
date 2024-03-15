import { TokenTransfer } from "@multiversx/sdk-core/out";
import BigNumber from "bignumber.js";
import { WRAPPED_EGLD } from "const/wrappedEGLD";
import { AggregatorStep } from "helper/contracts/aggregatorContract";
import { ContractManager } from "helper/contracts/contractManager";
import { formatAmount } from "helper/number";
import { getTokenIdFromCoin } from "helper/token";
import { TokenAmount } from "helper/token/tokenAmount";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import { useRecoilCallback } from "recoil";
import { agSlippageAtom } from "views/swap/Aggregator/atoms/aggregator";
import { SorSwapResponse } from "views/swap/Aggregator/interfaces/swapInfo";

const useAGV2Aggregate = (trackStatus = false) => {
    const { sendTransactions, sessionId, trackingData } =
        useSendTxsWithTrackStatus(trackStatus);

    const aggregate = useRecoilCallback(
        ({ snapshot }) =>
            async (
                sorResponse: SorSwapResponse,
                tokenAmountIn: TokenAmount,
                tokenAmountOut: TokenAmount,
                _protocol: string = ""
            ) => {
                const swaps = sorResponse.swaps;

                const slippage = await snapshot.getPromise(agSlippageAtom);
                const from = tokenAmountIn.token.identifier;
                const to = tokenAmountOut.token.identifier;
                const protocol =
                    getTokenIdFromCoin(from) === getTokenIdFromCoin(to) &&
                    getTokenIdFromCoin(from) === WRAPPED_EGLD.wegld
                        ? ""
                        : _protocol;

                const steps: AggregatorStep[] = swaps.map((s) => {
                    const step: AggregatorStep = {
                        token_in: s.assetIn,
                        token_out: s.assetOut,
                        amount_in: new BigNumber(s.amount),
                        pool_address: s.poolId,
                        function_name: s.functionName,
                        arguments: s.arguments.map((arg) =>
                            Buffer.from(arg, "base64")
                        ),
                    };
                    return step;
                });

                const contract = ContractManager.getAggregatorV2Contract();
                const minOut = new BigNumber(tokenAmountOut.raw)
                    .multipliedBy(
                        slippage.subtract(1).multiply(-1).toBigNumber()
                    )
                    .idiv(1);
                const payment =
                    tokenAmountIn.token.identifier === "EGLD"
                        ? TokenTransfer.egldFromBigInteger(tokenAmountIn.raw)
                        : TokenTransfer.fungibleFromBigInteger(
                              tokenAmountIn.token.identifier,
                              tokenAmountIn.raw
                          );
                const interaction = await contract.aggregate(
                    payment,
                    tokenAmountOut.token.identifier,
                    minOut,
                    steps,
                    protocol
                );

                await sendTransactions({
                    interactions: [interaction],
                    transactionsDisplayInfo: {
                        successMessage: `Swap ${formatAmount(
                            tokenAmountIn.egld
                        )} ${
                            tokenAmountIn.token.symbol
                        } to minimum ${formatAmount(
                            tokenAmountOut.egld.multipliedBy(
                                1 - slippage.toBigNumber().toNumber()
                            )
                        )} ${tokenAmountOut.token.symbol}`,
                    },
                });
            }
    );

    return { aggregate, sessionId, trackingData };
};

export default useAGV2Aggregate;
