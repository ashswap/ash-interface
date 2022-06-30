import {
    Address,
    AddressValue,
    BigUIntValue,
    ContractFunction,
    GasLimit,
    TokenIdentifierValue,
    Transaction,
} from "@elrondnetwork/erdjs/out";
import { accAddressState, accIsLoggedInState } from "atoms/dappState";
import { farmRecordsState, farmSessionIdMapState } from "atoms/farmsState";
import BigNumber from "bignumber.js";
import { ASH_TOKEN } from "const/tokens";
import { FarmRecord } from "views/stake/farms/FarmsState";
import { toEGLDD } from "helper/balance";
import {
    sendTransactions,
    useCreateTransaction,
} from "helper/transactionMethods";
import { DappSendTransactionsPropsType } from "interface/dappCore";
import { IFarm } from "interface/farm";
import { useRecoilCallback } from "recoil";

const useFarmClaimReward = () => {
    const createTransaction = useCreateTransaction();

    const createClaimRewardTx = useRecoilCallback(
        ({ snapshot, set }) =>
            async (
                lpAmt: BigNumber,
                collection: string,
                nonce: BigNumber,
                farm: IFarm
            ) => {
                const loggedIn = await snapshot.getPromise(accIsLoggedInState);
                const address = await snapshot.getPromise(accAddressState);

                if (!loggedIn)
                    throw new Error("Connect wallet to claim reward");
                return await createTransaction(new Address(address), {
                    func: new ContractFunction("ESDTNFTTransfer"),
                    gasLimit: new GasLimit(9_000_000),
                    args: [
                        new TokenIdentifierValue(Buffer.from(collection)),
                        new BigUIntValue(nonce),
                        new BigUIntValue(lpAmt),
                        new AddressValue(new Address(farm.farm_address)),
                        new TokenIdentifierValue(Buffer.from("claimRewards")),
                    ],
                });
            },
        [createTransaction]
    );

    const createClaimRewardTxs = useRecoilCallback(
        () => async (farmRecord: FarmRecord) => {
            const { stakedData } = farmRecord;
            const farmTokens = stakedData?.farmTokens || [];
            const txs: Transaction[] = [];
            for (let i = 0; i < farmTokens.length; i++) {
                const t = farmTokens[i];
                const tx = await createClaimRewardTx(
                    t.balance,
                    t.collection,
                    t.nonce,
                    farmRecord.farm
                );
                txs.push(tx);
            }
            return txs;
        },
        [createClaimRewardTx]
    );

    const claimReward = useRecoilCallback(
        ({ snapshot, set }) =>
            async (farm: IFarm) => {
                const farmRecords = await snapshot.getPromise(farmRecordsState);

                const farmRecord = farmRecords.find(
                    (val) => val.farm.farm_address === farm.farm_address
                );
                if (!farmRecord || !farmRecord.stakedData)
                    throw new Error("unable to claim reward");

                try {
                    const { stakedData } = farmRecord;
                    const txs = await createClaimRewardTxs(farmRecord);
                    const payload: DappSendTransactionsPropsType = {
                        transactions: txs,
                        transactionsDisplayInfo: {
                            successMessage: `Claim succeed ${toEGLDD(
                                ASH_TOKEN.decimals,
                                stakedData.totalRewardAmt
                            )} ${ASH_TOKEN.symbol}`,
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
                } catch (error) {
                    console.error(error);
                }
            },
        [createClaimRewardTxs]
    );

    const claimAllFarmsReward = useRecoilCallback(
        ({ snapshot, set }) =>
            async () => {
                const farmRecords = await snapshot.getPromise(farmRecordsState);

                let txs: Transaction[] = [];
                let totalASH = new BigNumber(0);
                const farmsAddress: string[] = [];
                for (let i = 0; i < farmRecords.length; i++) {
                    const val = farmRecords[i];
                    if (val?.stakedData?.totalRewardAmt.gt(0)) {
                        const temp = await createClaimRewardTxs(val);
                        txs = [...txs, ...temp];
                        totalASH = totalASH.plus(val.stakedData.totalRewardAmt);
                        farmsAddress.push(val.farm.farm_address);
                    }
                }
                const payload: DappSendTransactionsPropsType = {
                    transactions: txs,
                    transactionsDisplayInfo: {
                        successMessage: `Claim succeed ${toEGLDD(
                            ASH_TOKEN.decimals,
                            totalASH
                        )} ${ASH_TOKEN.symbol}`,
                    },
                };
                const result = await sendTransactions(payload);
                if (result.sessionId)
                    set(farmSessionIdMapState, (val) => ({
                        ...val,
                        ...Object.fromEntries(
                            farmsAddress.map((farm_address) => [
                                farm_address,
                                [
                                    ...(val[farm_address] || []),
                                    result.sessionId!,
                                ],
                            ])
                        ),
                    }));
            }
    );

    return {
        claimReward,
        createClaimRewardTx,
        createClaimRewardTxs,
        claimAllFarmsReward,
    };
};

export default useFarmClaimReward;
