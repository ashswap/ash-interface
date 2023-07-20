import { Address } from "@multiversx/sdk-core/out";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { FARMS } from "const/farms";
import { GraphOptions } from "graphql/type";
import useGraphQLQueryOptions from "graphql/useQueries/useGraphQLQueryOptions";
import { ContractManager } from "helper/contracts/contractManager";
import useFRGetAllFarms from "hooks/useFarmRouter/useFRGetAllFarms";
import {
    forwardRef,
    memo,
    useCallback,
    useImperativeHandle,
    useState,
} from "react";
import DAOFarmDropdown from "../../components/DAOFarmDropdown";
import { DAOFormRefMethods, WithDynamicRef } from "./type";
const queryOptions: GraphOptions = { withFC: true };
const DAOFCAddFarmFormForwardRef = forwardRef<DAOFormRefMethods>(
    function DAOFCAddFarmForm(props, ref) {
        useGraphQLQueryOptions(queryOptions);
        const [farmAddress, setFarmAddress] = useState(FARMS[0].farm_address);
        const [isClickSubmit, setIsClickSubmit] = useState(false);
        const { data: farmList } = useFRGetAllFarms();
        const onFarmAddressChange = useCallback(
            (val: number | string) => setFarmAddress(val as string),
            []
        );

        useImperativeHandle(
            ref,
            () => ({
                generateInteractions() {
                    setIsClickSubmit(true);
                    const address = new Address(farmAddress);
                    const farmType = 1;// default type = cryptoswap
                    return [
                        ContractManager.getFarmControllerContract(
                            ASHSWAP_CONFIG.dappContract.farmController
                        ).contract.methods.addFarm([address, farmType]),
                        ContractManager.getFarmRouterContract(
                            ASHSWAP_CONFIG.dappContract.farmRouter
                        ).contract.methods.startProduceRewards([address]),
                    ];
                },
            }),
            [farmAddress]
        );
        return (
            <div className="flex flex-col gap-6">
                <div>
                    <label
                        htmlFor="dao-fc-add-farm_address"
                        className="inline-block mb-2 font-bold text-sm text-stake-gray-500"
                    >
                        Farm Address
                    </label>
                    <DAOFarmDropdown
                        options={farmList || []}
                        value={farmAddress}
                        onSelect={onFarmAddressChange}
                    />
                </div>
            </div>
        );
    }
);
const DAOFCAddFarmForm = ({
    dynamicRef,
}: WithDynamicRef<DAOFormRefMethods>) => (
    <DAOFCAddFarmFormForwardRef ref={dynamicRef} />
);

export default memo(DAOFCAddFarmForm);
