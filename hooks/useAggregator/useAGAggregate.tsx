import { Interaction, TokenTransfer } from "@multiversx/sdk-core/out";
import { accInfoState } from "atoms/dappState";
import BigNumber from "bignumber.js";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { TOKENS_MAP } from "const/tokens";
import { WRAPPED_EGLD } from "const/wrappedEGLD";
import { AggregatorStep } from "helper/contracts/aggregatorContract";
import { ContractManager } from "helper/contracts/contractManager";
import { Percent } from "helper/fraction/percent";
import { formatAmount } from "helper/number";
import { getTokenIdFromCoin } from "helper/token";
import { TokenAmount } from "helper/token/tokenAmount";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import { useRecoilCallback } from "recoil";
import { agSlippageAtom } from "views/swap/Aggregator/atoms/aggregator";
import { SorSwap } from "views/swap/Aggregator/interfaces/swapInfo";

const useAGAggregate = (trackStatus = false) => {
    const { sendTransactions, sessionId, trackingData } =
        useSendTxsWithTrackStatus(trackStatus);
    const aggregate = useRecoilCallback(
        ({ snapshot, set }) =>
            async (
                tokensAmount: TokenAmount[],
                swaps: SorSwap[],
                minTokensAmountOut: TokenAmount[],
                hopTokenIds: string[]
            ) => {
                const egldIn = tokensAmount.find(
                    (t) => t.token.identifier === "EGLD"
                );
                const egldOut = minTokensAmountOut.find(
                    (t) => t.token.identifier === "EGLD"
                );
                const shard = (await snapshot.getPromise(accInfoState)).shard;
                const wegld = TOKENS_MAP[WRAPPED_EGLD.wegld];
                const wegldContract = WRAPPED_EGLD.wegldContracts[shard || 0];
                const payments = tokensAmount.map((t) =>
                    TokenTransfer.fungibleFromBigInteger(
                        getTokenIdFromCoin(t.token.identifier)!,
                        t.raw,
                        t.token.decimals
                    )
                );
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
                const slippage = await snapshot.getPromise(agSlippageAtom);
                const pct = new Percent(100, 100).subtract(slippage);
                const normalizeTokenIds = minTokensAmountOut.map((t) =>
                    getTokenIdFromCoin(t.token.identifier)
                );
                const hopLimits = hopTokenIds
                    .filter((id) => !normalizeTokenIds.includes(id))
                    .map((id) => ({ token: id, amount: new BigNumber(0) }));
                const outputLimits = minTokensAmountOut.map((m) => ({
                    token: getTokenIdFromCoin(m.token.identifier)!,
                    amount: m.raw
                        .multipliedBy(pct.numerator)
                        .idiv(pct.denominator),
                }));
                const tx = await ContractManager.getAggregatorContract(
                    ASHSWAP_CONFIG.dappContract.aggregator
                ).aggregate(payments, steps, [...hopLimits, ...outputLimits]);
                const txs: Interaction[] = [tx];
                if (egldIn) {
                    const wrapTx = await ContractManager.getWrappedEGLDContract(
                        wegldContract
                    ).wrapEgld(egldIn.raw);
                    txs.unshift(wrapTx);
                }
                if (egldOut) {
                    const unwrapTx =
                        await ContractManager.getWrappedEGLDContract(
                            wegldContract
                        ).unwrapEgld(
                            TokenTransfer.fungibleFromBigInteger(
                                wegld.identifier,
                                egldOut.raw,
                                wegld.decimals
                            )
                        );
                    txs.push(unwrapTx);
                }
                await sendTransactions({
                    interactions: txs,
                    transactionsDisplayInfo: {
                        successMessage: `Swap ${tokensAmount
                            .map(
                                (t) =>
                                    `${formatAmount(t.egld)} ${t.token.symbol}`
                            )
                            .join(", ")} to minimum ${minTokensAmountOut
                            .map(
                                (t) =>
                                    `${formatAmount(t.egld)} ${t.token.symbol}`
                            )
                            .join(", ")}`,
                    },
                });
            },
        [sendTransactions]
    );

    return { aggregate, sessionId, trackingData };
};

export default useAGAggregate;
