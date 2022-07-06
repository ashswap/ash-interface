import { getProxyProvider } from "@elrondnetwork/dapp-core";
import { Address, AddressValue, ContractFunction, ProxyProvider, Query } from "@elrondnetwork/erdjs/out";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { decodeNestedStringBase64 } from "helper/serializer";
import { VELockedStruct } from "interface/votingEscrow";
import { useRecoilCallback } from "recoil";

const useGovGetLocked = () => {
    const getLockedAmt = useRecoilCallback(() => async (address: string) => {
        const proxy: ProxyProvider = getProxyProvider();
        const {returnData} = await proxy
            .queryContract(
                new Query({
                    address: new Address(
                        ASHSWAP_CONFIG.dappContract.voteEscrowedContract
                    ),
                    func: new ContractFunction("getLocked"),
                    args: [new AddressValue(new Address(address))],
                })
            );
            return decodeNestedStringBase64(returnData[0], VELockedStruct);
    }, []);

    return getLockedAmt;
}

export default useGovGetLocked;