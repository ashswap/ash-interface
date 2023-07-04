import { Address } from "@multiversx/sdk-core/out";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { FARMS } from "const/farms";
import { ContractManager } from "helper/contracts/contractManager";
import useFRGetAllFarms from "hooks/useFarmRouter/useFRGetAllFarms";
import { forwardRef, memo, useCallback, useImperativeHandle, useState } from "react";
import DAOFarmDropdown from "../../components/DAOFarmDropdown";
import { DAOFormRefMethods, WithDynamicRef } from "./type";

const DAOFRProduceRewardsFormRef = forwardRef<
    DAOFormRefMethods,
    { type: "start" | "stop" }
>(function DAOFRProduceRewardsForm({ type }, ref) {
    const [farmAddress, setFarmAddress] = useState(FARMS[0].farm_address);
    const { data: farmList } = useFRGetAllFarms();
    const onFarmAddressChange = useCallback(
        (val: number | string) => setFarmAddress(val as string),
        []
    );
    useImperativeHandle(
        ref,
        () => ({
            generateInteractions() {
                const address = new Address(farmAddress);
                if (!address.isContractAddress()) {
                    return [];
                }
                if (type === "stop") {
                    return [ContractManager.getFarmRouterContract(
                        ASHSWAP_CONFIG.dappContract.farmRouter
                    ).contract.methods.endProduceRewards([address])];
                }
                return [ContractManager.getFarmRouterContract(
                    ASHSWAP_CONFIG.dappContract.farmRouter
                ).contract.methods.startProduceRewards([address])];
            },
        }),
        [farmAddress, type]
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
});

const DAOFRProduceRewardsForm = ({
    dynamicRef,
    type,
}: WithDynamicRef<DAOFormRefMethods, { type: "start" | "stop" }>) => (
    <DAOFRProduceRewardsFormRef ref={dynamicRef} type={type} />
);
export default memo(DAOFRProduceRewardsForm);
