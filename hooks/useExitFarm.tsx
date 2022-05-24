import {
    Address,
    AddressValue,
    BigUIntValue,
    ContractFunction,
    GasLimit,
    TokenIdentifierValue,
    Transaction
} from "@elrondnetwork/erdjs/out";
import { accAddressState, accIsLoggedInState } from "atoms/dappState";
import { farmRecordsState, farmSessionIdMapState } from "atoms/farmsState";
import BigNumber from "bignumber.js";
import { FarmRecord } from "views/stake/farms/FarmsState";
import { toEGLDD } from "helper/balance";
import {
    sendTransactions,
    useCreateTransaction
} from "helper/transactionMethods";
import { DappSendTransactionsPropsType } from "interface/dappCore";
import { IFarm } from "interface/farm";
import { useRecoilCallback } from "recoil";
import useFarmReward from "./useFarmReward";
const calcUnstakeEntries = (
    weiAmt: BigNumber,
    farmTokens: Required<FarmRecord>["stakedData"]["farmTokens"]
) => {
    let sum = new BigNumber(0);
    return farmTokens
        .map((ft) => {
            if (sum.gte(weiAmt)) {
                return { unstakeAmt: new BigNumber(0), farmToken: ft };
            }
            const remain = weiAmt.minus(sum);
            const amt = ft.balance.lte(remain) ? ft.balance : remain;
            sum = sum.plus(amt);
            return { unstakeAmt: amt, farmToken: ft };
        })
        .filter(({ unstakeAmt }) => unstakeAmt.gt(0));
};
const useExitFarm = () => {
    const createTransaction = useCreateTransaction();
    const getReward = useFarmReward();
    
    const createExitFarmTx = useRecoilCallback(
        ({ snapshot, set }) =>
            async (
                lpAmt: BigNumber,
                collection: string,
                nonce: BigNumber,
                farm: IFarm
            ) => {
                const loggedIn = await snapshot.getPromise(accIsLoggedInState);
                const address = await snapshot.getPromise(accAddressState);

                if (!loggedIn) throw new Error("Connect wallet to exit farm");
                return await createTransaction(new Address(address), {
                    func: new ContractFunction("ESDTNFTTransfer"),
                    gasLimit: new GasLimit(8_000_000),
                    args: [
                        new TokenIdentifierValue(Buffer.from(collection)),
                        new BigUIntValue(nonce),
                        new BigUIntValue(lpAmt),
                        new AddressValue(new Address(farm.farm_address)),
                        new TokenIdentifierValue(Buffer.from("exitFarm")),
                    ],
                });
            },
        []
    );
    const exitFarm = useRecoilCallback(
        ({ snapshot, set }) =>
            async (lpAmt: BigNumber, farm: IFarm) => {
                const loggedIn = await snapshot.getPromise(accIsLoggedInState);
                const farmRecords = await snapshot.getPromise(farmRecordsState);

                if (!loggedIn) return { sessionId: "" };
                try {
                    const farmRecord = farmRecords.find(
                        (val) => val.farm.farm_address === farm.farm_address
                    );
                    if (!farmRecord || !farmRecord.stakedData)
                        return { sessionId: "" };
                    const { stakedData } = farmRecord;
                    const farmTokens = stakedData.farmTokens || [];
                    let txs: Transaction[] = [];
                    const entries = calcUnstakeEntries(lpAmt, farmTokens);
                    const exitFarmTxCreators = entries.map(
                        ({ farmToken: { collection, nonce }, unstakeAmt }) =>
                            createExitFarmTx(
                                unstakeAmt,
                                collection,
                                nonce,
                                farm
                            )
                    );
                    txs = await Promise.all(exitFarmTxCreators);
                    const payload: DappSendTransactionsPropsType = {
                        transactions: txs.filter((tx) => !!tx) as Transaction[],
                        transactionsDisplayInfo: {
                            successMessage: `Unstake succeed ${toEGLDD(
                                farm.farming_token_decimal,
                                lpAmt
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
                } catch (error) {
                    console.error(error);
                }
                return { sessionId: "" };
            },
        [createExitFarmTx]
    );


    const estimateRewardOnExit = useRecoilCallback(
        ({ snapshot, set }) =>
            async (lpAmt: BigNumber, farm: IFarm) => {
                const farmRecords = await snapshot.getPromise(farmRecordsState);
                const farmRecord = farmRecords.find(
                    (val) => val.farm.farm_address === farm.farm_address
                );
                if (!farmRecord?.stakedData?.farmTokens.length)
                    return new BigNumber(0);
                const entries = calcUnstakeEntries(
                    lpAmt,
                    farmRecord.stakedData.farmTokens
                );
                const rewards = entries.map(({ unstakeAmt, farmToken }) =>
                    getReward(farm, unstakeAmt, farmToken.tokenId)
                );
                const totalRewards = await Promise.all(rewards);
                return totalRewards.reduce(
                    (total, val) => total.plus(val),
                    new BigNumber(0)
                );
            },
        [getReward]
    );
    return {createExitFarmTx, exitFarm, estimateRewardOnExit};
};

export default useExitFarm;
