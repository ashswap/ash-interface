import { useState, useCallback, useEffect, useMemo } from "react";
import styles from "./Swap.module.css";
import Fire from "assets/images/fire.png";
import Image from "next/image";
import IconButton from "components/IconButton";
import SwapAmount from "components/SwapAmount";
import Button from "components/Button";
import Setting from "components/Setting";
import Panel, { PanelContent } from "components/Panel";
import Clock from "assets/svg/clock.svg";
import SettingIcon from "assets/svg/setting.svg";
import SettingActiveIcon from "assets/svg/setting-active.svg";
import IconDown from "assets/svg/down-green.svg";
import IconNewTab from "assets/svg/new-tab-green.svg";
import Revert from "assets/svg/revert.svg";
import IconWallet from "assets/svg/wallet.svg";
import IconRight from "assets/svg/right-white.svg";
import { useWallet } from "context/wallet";
import { gasLimit, network } from "const/network";
import {
    Address,
    ContractFunction,
    Query,
    TokenIdentifierValue,
    BigUIntValue,
    GasLimit,
    TypeExpressionParser,
    TypeMapper,
    ArgSerializer,
    EndpointParameterDefinition
} from "@elrondnetwork/erdjs";
import BigNumber from "bignumber.js";
import { notification } from "antd";
import { toEGLD, toWei } from "helper/balance";
import { useSwap } from "context/swap";
import HistoryModal from "components/HistoryModal";

const Swap = () => {
    const {
        tokenFrom,
        tokenTo,
        valueFrom,
        valueTo,
        setValueTo,
        setTokenFrom,
        setTokenTo,
        pool,
        rates,
        setRates,
        isInsufficentFund,
        slippage
    } = useSwap();
    const [showSetting, setShowSetting] = useState<boolean>(false);
    const [isOpenHistoryModal, openHistoryModal] = useState<boolean>(false);
    const [fee, setFee] = useState<number>(0);

    const {
        provider,
        proxy,
        connectExtension,
        callContract,
        fetchBalances
    } = useWallet();

    const revertToken = () => {
        setTokenFrom(tokenTo);
        setTokenTo(tokenFrom);
    };

    useEffect(() => {
        fetchBalances();
    }, [fetchBalances, tokenFrom, tokenTo]);

    const rawValueFrom = useMemo(() => {
        if (!valueFrom || !tokenFrom) {
            return new BigNumber(0);
        }

        return toWei(tokenFrom, valueFrom);
    }, [valueFrom, tokenFrom]);

    const rawValueTo = useMemo(() => {
        if (!valueTo || !tokenTo) {
            return new BigNumber(0);
        }

        return toWei(tokenTo, valueTo);
    }, [valueTo, tokenTo]);

    // calculate amount out
    useEffect(() => {
        if (!pool || !tokenFrom || !tokenTo || !valueFrom) {
            return;
        }

        let amountIn = rawValueFrom;

        proxy
            .queryContract(
                new Query({
                    address: new Address(pool?.address),
                    func: new ContractFunction("getAmountOut"),
                    args: [
                        new TokenIdentifierValue(Buffer.from(tokenFrom.id)),
                        new TokenIdentifierValue(Buffer.from(tokenTo.id)),
                        new BigUIntValue(amountIn)
                    ]
                })
            )
            .then(({ returnData }) => {
                let resultHex = Buffer.from(
                    returnData[0],
                    "base64"
                ).toString("hex");
                let parser = new TypeExpressionParser();
                let mapper = new TypeMapper();
                let serializer = new ArgSerializer();

                let type = parser.parse("tuple3<BigUint, BigUint, bytes>");
                let mappedType = mapper.mapType(type);

                let endpointDefinitions = [
                    new EndpointParameterDefinition("foo", "bar", mappedType)
                ];
                let values = serializer.stringToValues(
                    resultHex,
                    endpointDefinitions
                );
                
                let amountOut = values[0].valueOf().field0.div(
                    new BigNumber(10).exponentiatedBy(tokenTo.decimals)
                );

                setValueTo(amountOut.toString(10));
            });
    }, [valueFrom, tokenFrom, tokenTo, pool, proxy, rawValueFrom, setValueTo]);

    // find pools + fetch reserves
    useEffect(() => {
        if (!pool) {
            return;
        }

        Promise.all([
            proxy.queryContract(
                new Query({
                    address: new Address(pool?.address),
                    func: new ContractFunction("getAmountOut"),
                    args: [
                        new TokenIdentifierValue(
                            Buffer.from(pool!.tokens[0].id)
                        ),
                        new TokenIdentifierValue(
                            Buffer.from(pool!.tokens[1].id)
                        ),
                        new BigUIntValue(
                            new BigNumber(10).exponentiatedBy(
                                pool!.tokens[0].decimals
                            )
                        )
                    ]
                })
            ),
            proxy.queryContract(
                new Query({
                    address: new Address(pool?.address),
                    func: new ContractFunction("getAmountOut"),
                    args: [
                        new TokenIdentifierValue(
                            Buffer.from(pool!.tokens[1].id)
                        ),
                        new TokenIdentifierValue(
                            Buffer.from(pool!.tokens[0].id)
                        ),
                        new BigUIntValue(
                            new BigNumber(10).exponentiatedBy(
                                pool!.tokens[1].decimals
                            )
                        )
                    ]
                })
            ),
            proxy.queryContract(
                new Query({
                    address: new Address(pool?.address),
                    func: new ContractFunction("getTotalFeePercent")
                })
            )
        ]).then(results => {
            let rates = results.slice(0, 2).map(result => {
                let resultHex = Buffer.from(
                    result.returnData[0],
                    "base64"
                ).toString("hex");
                let parser = new TypeExpressionParser();
                let mapper = new TypeMapper();
                let serializer = new ArgSerializer();

                let type = parser.parse("tuple3<BigUint, BigUint, bytes>");
                let mappedType = mapper.mapType(type);

                let endpointDefinitions = [
                    new EndpointParameterDefinition("foo", "bar", mappedType)
                ];
                let values = serializer.stringToValues(
                    resultHex,
                    endpointDefinitions
                );

                return values[0].valueOf().field0;
            });

            setRates(rates);

            const fee = new BigNumber(
                "0x" +
                    Buffer.from(results[2].returnData[0], "base64").toString(
                        "hex"
                    )
            );

            setFee(fee.isNaN() ? 0 : fee.toNumber());
        });
    }, [pool, proxy, setRates]);

    const swap = useCallback(async () => {
        if (!provider || !tokenFrom || !tokenTo) {
            return;
        }

        if (rawValueFrom.lte(0)) {
            return;
        }

        let tx = await callContract(new Address(pool?.address), {
            func: new ContractFunction("ESDTTransfer"),
            gasLimit: new GasLimit(gasLimit),
            args: [
                new TokenIdentifierValue(Buffer.from(tokenFrom.id)),
                new BigUIntValue(rawValueFrom),
                new TokenIdentifierValue(Buffer.from("exchange")),
                new TokenIdentifierValue(Buffer.from(tokenTo.id)),
                new BigUIntValue(new BigNumber(0))
            ]
        });

        fetchBalances();

        notification.open({
            message: `Swap succeed ${valueFrom} ${tokenFrom.name} to ${valueTo} ${tokenTo.name}`,
            duration: 12,
            icon: <IconNewTab />,
            onClick: () =>
                window.open(
                    network.explorerAddress +
                        "/transactions/" +
                        tx.getHash().toString(),
                    "_blank"
                )
        });
    }, [
        provider,
        pool,
        rawValueFrom,
        callContract,
        tokenFrom,
        tokenTo,
        fetchBalances,
        valueFrom,
        valueTo
    ]);

    const priceImpact = useMemo(() => {
        if (!pool || !rates || !tokenFrom || !rawValueFrom || !rawValueTo) {
            return "0%";
        }

        if (rawValueFrom.isZero()) {
            return "0%";
        }

        const rate =
            tokenFrom?.id === pool.tokens[0].id
                ? rates[0].toString()
                : rates[1].toString();

        const realOut = rawValueFrom
            .div(new BigNumber(10).exponentiatedBy(tokenFrom.decimals))
            .multipliedBy(rate);

        return (
            realOut
                .minus(rawValueTo)
                .abs()
                .multipliedBy(100)
                .div(realOut)
                .toFixed(3) + "%"
        );
    }, [pool, rates, tokenFrom, rawValueFrom, rawValueTo]);

    const minimumReceive = useMemo(() => {
        if (!tokenTo || !rawValueTo) {
            return;
        }

        return toEGLD(
            tokenTo,
            rawValueTo.multipliedBy(1 - slippage).toString()
        ).toFixed(3);
    }, [tokenTo, rawValueTo, slippage]);

    return (
        <div className="flex flex-col items-center pt-3.5 pb-12">
            <Panel>
                <PanelContent style={{ paddingRight: showSetting ? 48 : 30 }}>
                    <div className={styles.fire}>
                        <Image src={Fire} width={151} height={230} alt="Ash" />
                    </div>
                    <div className="flex flex-row justify-between pl-4">
                        <div className="font-bold text-2xl">Swap</div>
                        <div className="flex flex-row gap-2">
                            <IconButton
                                icon={<Clock />}
                                onClick={() =>
                                    provider &&
                                    openHistoryModal(!isOpenHistoryModal)
                                }
                            />
                            <IconButton
                                icon={<SettingIcon />}
                                activeIcon={<SettingActiveIcon />}
                                onClick={() => setShowSetting(!showSetting)}
                                active={showSetting}
                            />
                        </div>
                    </div>

                    <div className="relative pt-12">
                        <SwapAmount
                            topLeftCorner
                            showQuickSelect={!tokenFrom && !!tokenTo}
                            type="from"
                            resetPivotToken={() => setTokenTo(undefined)}
                        />
                        <div style={{ height: 4, position: "relative" }}>
                            <div
                                className={styles.revert}
                                onClick={revertToken}
                            >
                                <Revert />
                            </div>
                        </div>
                        <SwapAmount
                            bottomRightCorner
                            showQuickSelect={!!tokenFrom && !tokenTo}
                            type="to"
                            resetPivotToken={() => setTokenFrom(undefined)}
                            disableInput
                        />
                    </div>

                    {tokenFrom && tokenTo && (
                        <div
                            className="flex flex-row justify-between text-xs text-white my-5"
                            style={{ color: "#00FF75" }}
                        >
                            <div className="opacity-50 font-bold flex flex-row items-center gap-2 select-none cursor-pointer">
                                <div>Fair price</div>
                                <div>
                                    <IconDown />
                                </div>
                            </div>
                            <div>
                                1 {tokenFrom?.name} ={" "}
                                {pool &&
                                    rates &&
                                    (pool?.tokens[0].id === tokenFrom.id
                                        ? toEGLD(
                                              pool.tokens[1],
                                              rates[0].toString()
                                          ).toString()
                                        : toEGLD(
                                              pool.tokens[0],
                                              rates[1].toString()
                                          ).toString())}{" "}
                                {tokenTo?.name}
                            </div>
                        </div>
                    )}

                    {pool && rawValueFrom.gt(new BigNumber(0)) && (
                        <>
                            <div className="bg-black flex flex-row items-center justify-between h-10 pl-5 pr-6">
                                <div className={styles.swapResultLabel}>
                                    Price impact
                                </div>
                                <div
                                    className={styles.swapResultValue}
                                    style={{ color: "#00FF75" }}
                                >
                                    {priceImpact}
                                </div>
                            </div>
                            <div className="bg-black flex flex-row items-center justify-between h-10 pl-5 pr-6">
                                <div className={styles.swapResultLabel}>
                                    Minimum received
                                </div>
                                <div className={styles.swapResultValue}>
                                    {minimumReceive} {tokenTo?.name}
                                </div>
                            </div>
                            <div className="bg-black flex flex-row items-center justify-between h-10 pl-5 pr-6">
                                <div className={styles.swapResultLabel}>
                                    Slippage
                                </div>
                                <div className={styles.swapResultValue}>
                                    {slippage * 100}%
                                </div>
                            </div>
                            <div className="bg-black flex flex-row items-center justify-between h-10 pl-5 pr-6">
                                <div className={styles.swapResultLabel}>
                                    Swap fees
                                </div>
                                <div className={styles.swapResultValue}>
                                    {tokenTo && rawValueTo
                                        ? toEGLD(
                                              tokenTo,
                                              rawValueTo
                                                  .multipliedBy(fee)
                                                  .toString()
                                          ).toFixed(3)
                                        : "0"}{" "}
                                    {tokenTo?.name}
                                </div>
                            </div>
                        </>
                    )}

                    {isInsufficentFund ? (
                        <Button
                            leftIcon={!provider ? <IconWallet /> : <></>}
                            rightIcon={provider ? <IconRight /> : <></>}
                            topLeftCorner
                            style={{ height: 48 }}
                            className="mt-12"
                            disable
                            outline
                        >
                            <span className="text-text-input-3">
                                INSUFFICIENT{" "}
                                <span className="text-insufficent-fund">
                                    USDT
                                </span>{" "}
                                BALANCE
                            </span>
                        </Button>
                    ) : (
                        <Button
                            leftIcon={!provider ? <IconWallet /> : <></>}
                            rightIcon={provider ? <IconRight /> : <></>}
                            topLeftCorner
                            style={{ height: 48 }}
                            className="mt-12"
                            outline
                            onClick={provider ? swap : connectExtension}
                            glowOnHover
                        >
                            {provider ? "SWAP" : "CONNECT WALLET"}
                        </Button>
                    )}
                </PanelContent>
                {showSetting && (
                    <Setting onClose={() => setShowSetting(false)} />
                )}
            </Panel>
            <HistoryModal
                open={isOpenHistoryModal}
                onClose={() => openHistoryModal(false)}
            />
        </div>
    );
};

export default Swap;
