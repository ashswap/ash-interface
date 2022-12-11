import { TokenPayment } from "@elrondnetwork/erdjs/out";
import { accAddressState, accIsLoggedInState } from "atoms/dappState";
import { farmQuery, farmSessionIdMapState } from "atoms/farmsState";
import BigNumber from "bignumber.js";
import { toEGLDD } from "helper/balance";
import { ContractManager } from "helper/contracts/contractManager";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import { DappSendTransactionsPropsType } from "interface/dappCore";
import { IFarm } from "interface/farm";
import { useRecoilCallback } from "recoil";

const useEnterFarm = (trackStatus = false) => {
    const { sendTransactions, trackingData, sessionId } =
        useSendTxsWithTrackStatus(trackStatus);

    const func = useRecoilCallback(
        ({ snapshot, set }) =>
            async (
                amtWei: BigNumber,
                farm: IFarm,
                selfBoost: boolean = false
            ) => {
                const loggedIn = await snapshot.getPromise(accIsLoggedInState);
                const address = await snapshot.getPromise(accAddressState);
                const farmData = await snapshot.getPromise(
                    farmQuery(farm.farm_address)
                );

                if (!amtWei || amtWei.eq(0) || !loggedIn || !address)
                    return { sessionId: "" };
                const farmContract = ContractManager.getFarmContract(
                    farm.farm_address
                );

                const farmTokenInWallet =
                    farmData.stakedData?.farmTokens.filter(
                        (f) => f.attributes.booster === address
                    ) || [];

                const tokenPayments = farmTokenInWallet.map((t) =>
                    TokenPayment.metaEsdtFromBigInteger(
                        t.collection,
                        t.nonce.toNumber(),
                        t.balance,
                        farm.farm_token_decimal
                    )
                );
                tokenPayments.unshift(
                    TokenPayment.fungibleFromBigInteger(
                        farm.farming_token_id,
                        amtWei,
                        farm.farming_token_decimal
                    )
                );
                const tx = await farmContract.enterFarm(
                    tokenPayments,
                    selfBoost
                );
                const payload: DappSendTransactionsPropsType = {
                    transactions: tx,
                    transactionsDisplayInfo: {
                        successMessage: `Stake succeed ${toEGLDD(
                            farm.farming_token_decimal,
                            amtWei
                        )} ${farm.farming_token_id}`,
                    },
                };

                const result = await sendTransactions(payload);
                if (result.sessionId)
                    set(farmSessionIdMapState, (val) => ({
                        ...val,
                        [farm.farm_address]: [
                            ...(val[farm.farm_address] || []),
                            result.sessionId!,
                        ],
                    }));

                return result;
            },
        [sendTransactions]
    );
    return { enterFarm: func, trackingData, sessionId };
};

export default useEnterFarm;
