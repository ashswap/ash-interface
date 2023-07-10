import { TokenTransfer } from "@multiversx/sdk-core/out";
import { accInfoState } from "atoms/dappState";
import BigNumber from "bignumber.js";
import { TOKENS_MAP } from "const/tokens";
import { WRAPPED_EGLD } from "const/wrappedEGLD";
import { toEGLDD, toWei } from "helper/balance";
import { ContractManager } from "helper/contracts/contractManager";
import PoolContract from "helper/contracts/pool";
import { Percent } from "helper/fraction/percent";
import { formatAmount } from "helper/number";
import { TokenAmount } from "helper/token/tokenAmount";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import IPool, { EPoolType } from "interface/pool";
import { useRecoilCallback } from "recoil";

const usePoolRemoveLP = (trackStatus = false) => {
    const { sendTransactions, trackingData, sessionId } =
        useSendTxsWithTrackStatus(trackStatus);
    const func = useRecoilCallback(
        ({ snapshot }) =>
            async (
                pool: IPool,
                liquidity: BigNumber,
                tokenAmountOut: TokenAmount[],
                slippage: Percent
            ) => {
                const estimatedWeiOut = tokenAmountOut.map((t) => t.raw);
                const egldOutIndex = tokenAmountOut.findIndex(
                    (t) => t.token.identifier === "EGLD"
                );

                const tokenPayment = TokenTransfer.fungibleFromBigInteger(
                    pool.lpToken.identifier,
                    liquidity,
                    pool.lpToken.decimals
                );

                const tokensAmtMin = estimatedWeiOut.map((v, i) =>
                    new BigNumber(v)
                        .multipliedBy(
                            Percent.fromBigNumber(1)
                                .subtract(slippage)
                                .toBigNumber()
                        )
                        .integerValue(BigNumber.ROUND_DOWN)
                );

                const poolContract =
                    pool.type === EPoolType.PoolV2
                        ? ContractManager.getPoolV2Contract(pool.address)
                        : ContractManager.getPoolContract(pool.address);

                const tx = await poolContract.removeLiquidity(
                    tokenPayment,
                    tokensAmtMin
                );

                const txs = [tx];
                if (egldOutIndex >= 0) {
                    const shard =
                        (await snapshot.getPromise(accInfoState)).shard || 0;
                    const unwrapTx =
                        await ContractManager.getWrappedEGLDContract(
                            WRAPPED_EGLD.wegldContracts[shard]
                        ).unwrapEgld(
                            TokenTransfer.fungibleFromBigInteger(
                                WRAPPED_EGLD.wegld,
                                tokensAmtMin[egldOutIndex],
                                TOKENS_MAP[WRAPPED_EGLD.wegld].decimals
                            )
                        );
                    txs.push(unwrapTx);
                }

                const receipt = pool.tokens
                    .map(
                        (t, i) =>
                            `${formatAmount(
                                toEGLDD(
                                    t.decimals,
                                    estimatedWeiOut[i]
                                ).toNumber(),
                                {
                                    notation: "standard",
                                }
                            )} ${t.symbol}`
                    )
                    .join(", ")
                    .replace(/\,$/, "");
                return await sendTransactions({
                    interactions: txs,
                    transactionsDisplayInfo: {
                        successMessage: `Remove Liquidity Success ${receipt}`,
                    },
                });
            },
        [sendTransactions]
    );

    return { removeLP: func, trackingData, sessionId };
};

export default usePoolRemoveLP;
