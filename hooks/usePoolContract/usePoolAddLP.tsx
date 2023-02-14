import { TokenPayment } from "@elrondnetwork/erdjs/out";
import { accInfoState } from "atoms/dappState";
import BigNumber from "bignumber.js";
import { WRAPPED_EGLD } from "const/wrappedEGLD";
import { toEGLDD } from "helper/balance";
import { ContractManager } from "helper/contracts/contractManager";
import PoolContract from "helper/contracts/pool";
import { formatAmount } from "helper/number";
import { TokenAmount } from "helper/token/tokenAmount";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import IPool, { EPoolType } from "interface/pool";
import { useRecoilCallback } from "recoil";

const usePoolAddLP = (trackStatus = false) => {
    const { sendTransactions, trackingData, sessionId } =
        useSendTxsWithTrackStatus(trackStatus);
    const addLiquidity = useRecoilCallback(
        ({ snapshot }) =>
            async (
                pool: IPool,
                tokenAmounts: TokenAmount[],
                mintAmtMin: BigNumber
            ) => {
                const poolContract =
                    pool.type === EPoolType.PoolV2
                        ? ContractManager.getPoolV2Contract(pool.address)
                        : ContractManager.getPoolContract(pool.address);
                const tokensWei = tokenAmounts.map((t) => t.raw);
                const egldAmt = tokenAmounts.find(
                    (t) => t.token.identifier === "EGLD"
                );
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
                const txs = [tx];
                if (egldAmt) {
                    const shard =
                        (await snapshot.getPromise(accInfoState)).shard || 0;
                    const wrapTx = await ContractManager.getWrappedEGLDContract(
                        WRAPPED_EGLD.wegldContracts[shard]
                    ).wrapEgld(egldAmt.raw);

                    txs.unshift(wrapTx);
                }
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
                    transactions: txs,
                    transactionsDisplayInfo: {
                        successMessage: `Add liquidity Success ${receipt}`,
                    },
                });
            },
        [sendTransactions]
    );
    return { addLiquidity, trackingData, sessionId };
};

export default usePoolAddLP;
