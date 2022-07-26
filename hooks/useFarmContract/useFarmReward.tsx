
import {
    Address,
    BigUIntValue,
    BytesValue,
    ContractFunction,
    Query
} from "@elrondnetwork/erdjs/out";
import { accAddressState, accIsLoggedInState } from "atoms/dappState";
import BigNumber from "bignumber.js";
import { getApiNetworkProvider } from "helper/proxy/util";
import { IFarm } from "interface/farm";
import { useRecoilCallback } from "recoil";

const useFarmReward = () => {
    const func = useRecoilCallback(
        ({ snapshot, set }) =>
            async (farm: IFarm, amt: BigNumber, sftId: string) => {
                const loggedIn = await snapshot.getPromise(accIsLoggedInState);
                const address = await snapshot.getPromise(accAddressState);
                const apiProvider = getApiNetworkProvider();
                if (!loggedIn) return new BigNumber(0);
                
                const token = await apiProvider.getNonFungibleTokenOfAccount(new Address(address), farm.farm_token_id, parseInt(sftId.replace(farm.farm_token_id + "-", ""), 16));
                const attributes = token.attributes;
                if (!attributes) return new BigNumber(0);
                const res = await apiProvider.queryContract(
                    new Query({
                        address: new Address(farm.farm_address),
                        func: new ContractFunction(
                            "calculateRewardsForGivenPosition"
                        ),
                        args: [
                            new BigUIntValue(amt),
                            new BytesValue(attributes),
                        ],
                    })
                );
                return new BigNumber(
                    res.returnData[0]
                        ? Buffer.from(res.returnData[0], "base64").toString(
                              "hex"
                          )
                        : 0,
                    16
                );
            },
        []
    );
    return func;
};

export default useFarmReward;
