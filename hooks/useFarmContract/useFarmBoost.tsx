import { accAddressState } from "atoms/dappState";
import { farmRecordsState, FarmToken } from "atoms/farmsState";
import { sendTransactions } from "helper/transactionMethods";
import { IFarm } from "interface/farm";
import { useRecoilCallback } from "recoil";
import useFarmClaimReward from "./useFarmClaimReward";

const useFarmBoost = () => {
    const {createClaimRewardTxMulti} = useFarmClaimReward();
    const func = useRecoilCallback(() => async (farm: IFarm, tokens: FarmToken[], selfBoost: boolean = false) => {
        return sendTransactions({
            transactions: await createClaimRewardTxMulti(tokens, farm, selfBoost),
            transactionsDisplayInfo: {
                successMessage: "Success to boost",
            }
        });
    }, [createClaimRewardTxMulti]);

    return func;
}

export default useFarmBoost;