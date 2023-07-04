import { Address } from "@multiversx/sdk-core/out";
import { fcTypesSelector } from "atoms/farmControllerState";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { FARMS } from "const/farms";
import { GraphOptions } from "graphql/type";
import useGraphQLQueryOptions from "graphql/useQueries/useGraphQLQueryOptions";
import { ContractManager } from "helper/contracts/contractManager";
import {
    forwardRef,
    memo,
    useCallback,
    useImperativeHandle,
    useMemo,
    useState,
} from "react";
import { useRecoilValue } from "recoil";
import DAODropdown from "../../components/DAODropdown";
import DAOFarmDropdown from "../../components/DAOFarmDropdown";
import { DAOFormRefMethods, WithDynamicRef } from "./type";
import useSWR from "swr";
const queryOptions: GraphOptions = { withFC: true };
const emptyArray: any = [];
const DAOFCAddFarmFormForwardRef = forwardRef<DAOFormRefMethods>(
    function DAOFCAddFarmForm(props, ref) {
        useGraphQLQueryOptions(queryOptions);
        const [farmAddress, setFarmAddress] = useState(FARMS[0].farm_address);
        const [farmType, setFarmType] = useState<number>();
        const [isClickSubmit, setIsClickSubmit] = useState(false);
        const fcTypes = useRecoilValue(fcTypesSelector);
        const { data: farmList } = useSWR<string[]>(
            ASHSWAP_CONFIG.dappContract.farmRouter,
            async (farmRouter) => {
                const addresses = await ContractManager.getFarmRouterContract(
                    farmRouter
                )
                    .getAllFarmAddresses()
                    .then((addresses) => addresses.map((addr) => addr.bech32()))
                    .catch(() => []);
                return addresses;
            },
            {
                fallbackData: emptyArray,
            }
        );
        const farmTypeOptions = useMemo(() => {
            return fcTypes.map((t) => ({ label: t.name, value: t.farmType }));
        }, [fcTypes]);

        const onFarmTypeChange = useCallback(
            (val: number | string) => setFarmType(val as number),
            []
        );
        const onFarmAddressChange = useCallback(
            (val: number | string) => setFarmAddress(val as string),
            []
        );

        useImperativeHandle(
            ref,
            () => ({
                generateInteractions() {
                    setIsClickSubmit(true);
                    if (typeof farmType !== "number") return [];
                    const address = new Address(farmAddress);
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
            [farmAddress, farmType]
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
                <div>
                    <label
                        htmlFor="dao-fc-add-farm_address"
                        className="inline-block mb-2 font-bold text-sm text-stake-gray-500"
                    >
                        Type Weight
                    </label>
                    <DAODropdown
                        options={farmTypeOptions}
                        value={farmType}
                        onSelect={onFarmTypeChange}
                        invalid={isClickSubmit && typeof farmType !== "number"}
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
