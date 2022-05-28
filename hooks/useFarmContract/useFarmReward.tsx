import { getProxyProvider } from "@elrondnetwork/dapp-core";
import {
    Address,
    BigUIntValue,
    BytesValue,
    ContractFunction,
    ProxyProvider,
    Query,
} from "@elrondnetwork/erdjs/out";
import { accIsLoggedInState } from "atoms/dappState";
import { walletBalanceState } from "atoms/walletState";
import BigNumber from "bignumber.js";
import { IFarm } from "interface/farm";
import { useRecoilCallback } from "recoil";

const useFarmReward = () => {
    const func = useRecoilCallback(
        ({ snapshot, set }) =>
            async (farm: IFarm, amt: BigNumber, sftId: string) => {
                const loggedIn = await snapshot.getPromise(accIsLoggedInState);
                const balances = await snapshot.getPromise(walletBalanceState);
                const proxy: ProxyProvider = getProxyProvider();
                if (!loggedIn) return new BigNumber(0);
                const attributes = balances[sftId]?.attributes;
                if (!attributes) return new BigNumber(0);
                const res = await proxy.queryContract(
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
