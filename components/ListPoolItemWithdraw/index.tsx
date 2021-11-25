import IPool from "interface/pool";
import styles from "./ListPoolItemWithdraw.module.css";
import { useState, useMemo, useEffect } from "react";
import IconDown from "assets/svg/down-white.svg";
import Button from "components/Button";
import AddLiquidityModal from "components/AddLiquidityModal";
import RemoveLiquidityModal from "components/RemoveLiquidityModal";
import { useWallet } from "context/wallet";
import BigNumber from "bignumber.js";
import { Address, ArgSerializer, BigUIntValue, ContractFunction, EndpointParameterDefinition, Query, TypeExpressionParser, TypeMapper } from "@elrondnetwork/erdjs/out";
import { toEGLD } from "helper/balance";

interface Props {
    pool: IPool;
    className?: string | undefined;
    dark?: boolean;
}

const ListPoolItemWithdraw = (props: Props) => {
    const [isExpand, setIsExpand] = useState<boolean>(false);
    const [openAddLiquidity, setOpenAddLiquidity] = useState<boolean>(false);
    const [openRemoveLiquidity, setOpenRemoveLiquidity] = useState<boolean>(
        false
    );
    const { balances, proxy, lpTokens } = useWallet();
    const [value0, setValue0] = useState<string>("");
    const [value1, setValue1] = useState<string>("");

    const ownLiquidity = useMemo(() => {
        return balances[props.pool.lpToken.id]
            ? balances[props.pool.lpToken.id].balance
            : new BigNumber(0);
    }, [balances, props.pool]);

    useEffect(() => {
        proxy
            .queryContract(
                new Query({
                    address: new Address(props.pool.address),
                    func: new ContractFunction("getRemoveLiquidityTokens"),
                    args: [
                        new BigUIntValue(ownLiquidity),
                        new BigUIntValue(new BigNumber(0)),
                        new BigUIntValue(new BigNumber(0))
                    ]
                })
            )
            .then(({ returnData }) => {
                let resultHex = Buffer.from(returnData[0], "base64").toString(
                    "hex"
                );
                let parser = new TypeExpressionParser();
                let mapper = new TypeMapper();
                let serializer = new ArgSerializer();

                let type = parser.parse("tuple2<BigUint,BigUint>");
                let mappedType = mapper.mapType(type);

                let endpointDefinitions = [
                    new EndpointParameterDefinition("foo", "bar", mappedType)
                ];
                let values = serializer.stringToValues(
                    resultHex,
                    endpointDefinitions
                );

                setValue0(
                    toEGLD(
                        props.pool.tokens[0],
                        values[0].valueOf().field0.toString()
                    ).toFixed(2)
                );
                setValue1(
                    toEGLD(
                        props.pool.tokens[1],
                        values[0].valueOf().field1.toString()
                    ).toFixed(2)
                );
            });
    }, [ownLiquidity, props.pool.address, props.pool.tokens, proxy]);

    const capacityPercent = useMemo(() => {
        return toEGLD(props.pool.lpToken, ownLiquidity.toString()).multipliedBy(100).div(lpTokens[props.pool.lpToken.id].totalSupply!).toFixed(2)
    }, [props.pool, ownLiquidity])

    return (
        <div
            className={`${props.className || ""} flex flex-col ${
                props.dark ? "bg-ash-dark-600" : "bg-black"
            } ${styles.container}`}
        >
            <div className="flex flex-row text-white w-full">
                <div className="w-3/12 flex flex-row items-center">
                    <div className="flex flex-row justify-between items-center">
                        <div
                            className={styles.tokenIcon}
                            style={{
                                backgroundColor: props.pool.tokens[0].icon
                            }}
                        ></div>
                        <div
                            className={styles.tokenIcon}
                            style={{
                                backgroundColor: props.pool.tokens[1].icon,
                                marginLeft: "-10px"
                            }}
                        ></div>
                    </div>
                    <div style={{ fontSize: 10 }} className="px-3 font-bold">
                        &
                    </div>
                    <div className="font-bold text-lg">
                        <div className="flex flex-row items-center">
                            <span className="w-16">
                                {props.pool.tokens[0].name}
                            </span>
                            <span className="text-earn text-xs">2.52</span>
                        </div>
                        <div className="flex flex-row items-center">
                            <span className="w-16">
                                {props.pool.tokens[1].name}
                            </span>
                            <span className="text-earn text-xs">2.52</span>
                        </div>
                    </div>
                </div>
                <div className="w-2/12 flex flex-row items-center font-bold text-sm">
                    0.0051%
                </div>
                <div className="w-2/12 flex flex-col justify-center">
                    <span
                        className="text-yellow-600 underline select-none font-bold text-xs cursor-pointer"
                        onClick={() => setOpenRemoveLiquidity(true)}
                    >
                        Withdraw
                    </span>
                </div>
                <div className="w-2/12 flex flex-col justify-center">
                    <span
                        className="text-pink-600 underline select-none font-bold text-xs cursor-pointer"
                        onClick={() => setOpenAddLiquidity(true)}
                    >
                        Deposit more
                    </span>
                </div>
            </div>
            <AddLiquidityModal
                open={openAddLiquidity}
                onClose={() => setOpenAddLiquidity(false)}
                pool={props.pool}
                tokenValue0={value0}
                tokenValue1={value1}
                capacityPercent={capacityPercent}
            />
            <RemoveLiquidityModal
                open={openRemoveLiquidity}
                onClose={() => setOpenRemoveLiquidity(false)}
                pool={props.pool}
                capacityPercent={capacityPercent}
            />
        </div>
    );
};

export default ListPoolItemWithdraw;
