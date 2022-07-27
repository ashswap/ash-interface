import { TokenPayment } from "@elrondnetwork/erdjs/out";
import { FarmToken } from "atoms/farmsState";
import { ContractManager } from "helper/contracts/contractManager";
import { sendTransactions } from "helper/transactionMethods";
import { IFarm } from "interface/farm";
import { useRecoilCallback } from "recoil";

const useFarmBoost = () => {
    const func = useRecoilCallback(() => async (farm: IFarm, tokens: FarmToken[], selfBoost: boolean = false) => {
        const tokenPayments = tokens.map(t => TokenPayment.metaEsdtFromBigInteger(t.collection, t.nonce.toNumber(), t.balance));
        return sendTransactions({
            transactions: await ContractManager.getFarmContract(farm.farm_address).claimRewards(tokenPayments, selfBoost),
            transactionsDisplayInfo: {
                successMessage: "Success to boost",
            }
        });
    }, []);

    return func;
}

export default useFarmBoost;