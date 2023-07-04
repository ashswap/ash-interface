import BigNumber from "bignumber.js";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { TOKENS_MAP } from "const/tokens";
import { GraphOptions } from "graphql/type";
import { ContractManager } from "helper/contracts/contractManager";
import {
    ChangeEventHandler,
    forwardRef,
    memo,
    useCallback,
    useImperativeHandle,
    useState
} from "react";
import {
    DAOFormRefMethods,
    FarmParams,
    WithDynamicRef
} from "./type";
const queryOptions: GraphOptions = { withFC: true };

const paramsTemplate: FarmParams = {
    token_name: "",
    token_ticker: "",
    farming_token_id: "",
    division_safety_constant: "1e12", 
};

const paramsTemplateStr = JSON.stringify(paramsTemplate, null, 4);

const DAORouterCreatePoolFormForwardRef = forwardRef<DAOFormRefMethods>(
    function DAORouterCreatePoolForm(props, ref) {
        const [paramsStr, setParamsStr] = useState(paramsTemplateStr);
        const [invalidParams, setInvalidParams] = useState("");

        const [isClickSubmit, setIsClickSubmit] = useState(false);

        const onParamsChange: ChangeEventHandler<HTMLTextAreaElement> =
            useCallback((e) => {
                setParamsStr(e.target.value);
            }, []);

        useImperativeHandle(
            ref,
            () => ({
                generateInteractions() {
                    setIsClickSubmit(true);
                    try {
                        const contract = ContractManager.getFarmRouterContract(ASHSWAP_CONFIG.dappContract.farmRouter).contract;
                        const params = JSON.parse(paramsStr) as FarmParams;
                        const createFarm = contract.methods.createFarm([
                            params.token_name,
                            params.token_ticker,
                            TOKENS_MAP.ASH.identifier,
                            params.farming_token_id,
                            new BigNumber(params.division_safety_constant),
                        ]);
                        const setLocalRoles = contract.methods.setLocalRoles([
                            params.farming_token_id
                        ]);
                        return [createFarm, setLocalRoles];
                        
                    } catch (error) {
                        return [];
                    }

                },
            }),
            [paramsStr]
        );
        return (
            <div className="flex flex-col gap-6">
                <div>
                    <label>
                        <div className="inline-block mb-2 font-bold text-sm text-stake-gray-500">
                            Params
                        </div>
                        <textarea
                            value={paramsStr}
                            className="w-full px-6 py-4 flex items-center justify-between text-xs font-bold text-stake-gray-500 leading-normal bg-ash-dark-400 border border-transparent outline-none resize-none"
                            onChange={onParamsChange}
                            rows={20}
                        />
                    </label>
                </div>
            </div>
        );
    }
);
const DAOFCAddFarmForm = ({
    dynamicRef,
}: WithDynamicRef<DAOFormRefMethods>) => (
    <DAORouterCreatePoolFormForwardRef ref={dynamicRef} />
);

export default memo(DAOFCAddFarmForm);
