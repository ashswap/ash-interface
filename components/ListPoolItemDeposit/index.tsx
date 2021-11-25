import IPool from "interface/pool";
import styles from "./ListPoolItemDeposit.module.css";
import { useState, useEffect, useMemo } from "react";
import IconDown from "assets/svg/down-white.svg";
import Button from "components/Button";
import AddLiquidityModal from "components/AddLiquidityModal";
import { Address, ArgSerializer, BigUIntValue, ContractFunction, EndpointParameterDefinition, Query, TypeExpressionParser, TypeMapper } from "@elrondnetwork/erdjs/out";
import { useWallet } from "context/wallet";
import BigNumber from "bignumber.js";
import { toEGLD } from "helper/balance";

interface Props {
    pool: IPool;
    className?: string | undefined;
    dark?: boolean;
}

const ListPoolItemDeposit = (props: Props) => {
    const [isExpand, setIsExpand] = useState<boolean>(false);
    const [openAddLiquidity, setOpenAddLiquidity] = useState<boolean>(false);
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
                <div className="w-2/12 flex flex-row items-center">
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
                        <div>{props.pool.tokens[0].name}</div>
                        <div>{props.pool.tokens[1].name}</div>
                    </div>
                </div>
                <div className="w-1/12 flex flex-row items-center text-yellow-600">
                    921%
                </div>
                <div className="w-2/12 flex flex-col justify-center">
                    <div className="text-earn">
                        <span className="font-bold text-sm">_ </span>
                        <span className="font-normal" style={{ fontSize: 10 }}>
                            {props.pool.tokens[0].name}
                        </span>
                    </div>
                    <div style={{ fontSize: 10 }}>
                        per 1,000 {props.pool.tokens[1].name}
                    </div>
                </div>
                <div className="w-2/12 flex flex-col justify-center">
                    <div className="flex flex-row items-center justify-end bg-bg w-36 h-12 text-xs text-right py-4 pr-3">
                        <span className="text-text-input-3">$</span>
                        <span>512,913,133</span>
                    </div>
                </div>
                <div className="w-2/12 flex flex-col justify-center">
                    <div className="flex flex-row items-center justify-end bg-bg w-36 h-12 text-xs text-right py-4 pr-3">
                        <span className="text-text-input-3">$</span>
                        <span>2,913,133</span>
                    </div>
                </div>
                <div className="w-2/12 flex flex-col justify-center">
                    <Button
                        bottomRightCorner
                        style={{ height: 48 }}
                        className="w-36 h-12"
                        onClick={() => setOpenAddLiquidity(true)}
                    >
                        DEPOSIT
                    </Button>
                </div>
                <div
                    className="w-1/12 flex flex-row items-center justify-center gap-2 select-none cursor-pointer"
                    onClick={() => setIsExpand(true)}
                >
                    {!isExpand && (
                        <>
                            <span>Detail</span>
                            <IconDown />
                        </>
                    )}
                </div>
            </div>

            {isExpand && (
                <div className="flex flex-row items-center text-text-input-3 w-full mt-9 gap-1">
                    <div className="w-2/12 text-earn underline">
                        View LP Distribution
                    </div>
                    <div className="w-3/12">
                        <div className="flex flex-row items-center justify-between bg-bg w-full h-12 text-xs text-right p-4">
                            <span>Trading APR</span>
                            <span>32%</span>
                        </div>
                    </div>
                    <div className="w-3/12">
                        <div className="flex flex-row items-center justify-between bg-bg w-full h-12 text-xs text-right p-4">
                            <span>Emissions APR</span>
                            <span>51%</span>
                        </div>
                    </div>
                    <div className="w-3/12">
                        <div className="flex flex-row items-center justify-between bg-bg w-full h-12 text-xs text-right p-4">
                            <span>Performance Fee</span>
                            <span>2%</span>
                        </div>
                    </div>
                    <div
                        className="w-1/12 flex flex-row items-center justify-center gap-2 select-none cursor-pointer"
                        onClick={() => setIsExpand(false)}
                    >
                        <span>Hide</span>
                        <IconDown
                            style={{
                                transform: `rotate(180deg)`
                            }}
                        />
                    </div>
                </div>
            )}

            <AddLiquidityModal
                open={openAddLiquidity}
                onClose={() => setOpenAddLiquidity(false)}
                pool={props.pool}
                tokenValue0={value0}
                tokenValue1={value1}
                capacityPercent={capacityPercent}
            />
        </div>
    );
};

export default ListPoolItemDeposit;
