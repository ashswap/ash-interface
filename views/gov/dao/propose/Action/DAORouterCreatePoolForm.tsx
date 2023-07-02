import { Address } from "@multiversx/sdk-core/out";
import BigNumber from "bignumber.js";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { GraphOptions } from "graphql/type";
import { ContractManager } from "helper/contracts/contractManager";
import {
    ChangeEventHandler,
    forwardRef,
    memo,
    useCallback,
    useEffect,
    useImperativeHandle,
    useState
} from "react";
import DAODropdown from "../../components/DAODropdown";
import {
    DAOFormRefMethods,
    PoolV1Params,
    PoolV2Params,
    WithDynamicRef,
} from "./type";
const queryOptions: GraphOptions = { withFC: true };
enum PoolType {
    PlainPool = 0,
    LendingPool = 1,
    MetaPool = 2,
    PoolV2 = 3,
}
const poolTypeOptions = [
    {
        label: "Stable pool",
        value: PoolType.PlainPool,
    },
    {
        label: "Lending pool",
        value: PoolType.LendingPool,
    },
    {
        label: "Crypto pool",
        value: PoolType.PoolV2,
    },
];
const paramsV1Template: PoolV1Params = {
    lp_token_name: "",
    lp_token_ticker: "",
    initial_amp_factor: 0,
    swap_fee_percent: 300,
    admin_fee_percent: 50000,
    tokens: [
        { token: "USDT-abcdef", rate: "1e30" },
        { token: "USDC-abcdef", rate: "1e30" },
    ],
};
const paramsLendingTemplate: PoolV1Params = {
    ...paramsV1Template,
    protocols: [
        {
            token: "sEGLD-abcdef",
            underlying: "wEGLD-abcdef",
            address: "lending contract address",
            function: "endpoint to get rate of wrapped token vs its underlying",
            arguments: ["base64 argument 1", "base64 argument 2..."],
        },
    ],
};
const paramsV2Template: PoolV2Params = {
    lp_token_name: "",
    lp_token_ticker: "",
    a: "0",
    gamma: "1000",
    mid_fee: "1000000",
    out_fee: "1000000",
    allowed_extra_profit: "1000000",
    fee_gamma: "1000000",
    adjustment_step: "1000000",
    admin_fee: "1000000",
    ma_half_time: 100,
    initial_price: "1000000",
    tokens: [
        { token: "USDT-abcdef", rate: "1e30" },
        { token: "ASH-abcdef", rate: "1e30" },
    ],
};
const paramsV1Str = JSON.stringify(paramsV1Template, null, 4);
const paramsLendingStr = JSON.stringify(paramsLendingTemplate, null, 4);
const paramsV2Str = JSON.stringify(paramsV2Template, null, 4);

const DAORouterCreatePoolFormForwardRef = forwardRef<DAOFormRefMethods>(
    function DAORouterCreatePoolForm(props, ref) {
        const [poolType, setPoolType] = useState(PoolType.PlainPool);
        const [paramsStr, setParamsStr] = useState(paramsV1Str);
        const [invalidParams, setInvalidParams] = useState("");

        const [isClickSubmit, setIsClickSubmit] = useState(false);

        const onPoolTypeChange = useCallback(
            (val: number | string) => setPoolType(val as number),
            []
        );
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
                        switch(poolType) {
                            case PoolType.PlainPool:
                            case PoolType.LendingPool:
                                const params = JSON.parse(paramsStr) as PoolV1Params;
                                const createPoolV1 = ContractManager.getRouterContract(ASHSWAP_CONFIG.dappContract.router).contract.methods.createPool([
                                    params.lp_token_name,
                                    params.lp_token_ticker,
                                    poolType === PoolType.PlainPool ? [] : params.protocols?.map(p => {
                                        return {
                                            token: p.token,
                                            underlying: p.underlying,
                                            address: new Address(p.address),
                                            function: p.function,
                                            arguments: p.arguments.map(arg => Buffer.from(arg, "base64")),
                                        }
                                    }),
                                    poolType,
                                    params.initial_amp_factor,
                                    params.swap_fee_percent,
                                    params.admin_fee_percent,
                                    ...params.tokens.map(t => ({token: t.token, rate: new BigNumber(t.rate)}))
                                ]);
                                const setLocalRoles = ContractManager.getRouterContract(ASHSWAP_CONFIG.dappContract.router).contract.methods.setLocalRoles([
                                    ...params.tokens.map(t => t.token)
                                ]);
                                return [createPoolV1, setLocalRoles];
                            case PoolType.PoolV2:
                                const paramsV2 = JSON.parse(paramsStr) as PoolV2Params;
                                const createPoolV2 = ContractManager.getRouterContract(ASHSWAP_CONFIG.dappContract.router).contract.methods.createPoolV2([
                                    paramsV2.lp_token_name,
                                    paramsV2.lp_token_ticker,
                                    PoolType.PoolV2,
                                    new BigNumber(paramsV2.a),
                                    new BigNumber(paramsV2.gamma),
                                    new BigNumber(paramsV2.mid_fee),
                                    new BigNumber(paramsV2.out_fee),
                                    new BigNumber(paramsV2.allowed_extra_profit),
                                    new BigNumber(paramsV2.fee_gamma),
                                    new BigNumber(paramsV2.adjustment_step),
                                    new BigNumber(paramsV2.admin_fee),
                                    paramsV2.ma_half_time,
                                    new BigNumber(paramsV2.initial_price),
                                    ...paramsV2.tokens.map(t => ({token: t.token, rate: new BigNumber(t.rate)}))
                                ]);
                                const setLocalRolesV2 = ContractManager.getRouterContract(ASHSWAP_CONFIG.dappContract.router).contract.methods.setLocalRoles([
                                    ...paramsV2.tokens.map(t => t.token)
                                ]);
                                return [createPoolV2, setLocalRolesV2];
                            default: return [];
                        }
                    } catch (error) {
                        return [];
                    }

                },
            }),
            [paramsStr, poolType]
        );

        useEffect(() => {
            setParamsStr(
                poolType === PoolType.PlainPool
                    ? paramsV1Str
                    : poolType === PoolType.LendingPool
                    ? paramsLendingStr
                    : paramsV2Str
            );
        }, [poolType]);
        return (
            <div className="flex flex-col gap-6">
                <div>
                    <label
                        htmlFor="dao-fc-add-farm_address"
                        className="inline-block mb-2 font-bold text-sm text-stake-gray-500"
                    >
                        Pool type
                    </label>
                    <DAODropdown
                        options={poolTypeOptions}
                        value={poolType}
                        onSelect={onPoolTypeChange}
                        invalid={isClickSubmit && typeof poolType !== "number"}
                    />
                </div>
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
