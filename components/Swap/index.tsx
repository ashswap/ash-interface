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
import Revert from "assets/svg/revert.svg";
import IconWallet from "assets/svg/wallet.svg";
import IconRight from "assets/svg/right-white.svg";
import { IToken } from "interface/token";
import { useWallet } from "context/wallet";
import pools from "const/pool";
import { gasLimit, network } from "const/network";
import IPool from "interface/pool";
import {
    Address,
    ContractFunction,
    Query,
    TokenIdentifierValue,
    BigUIntValue,
    GasLimit,
    AddressValue
} from "@elrondnetwork/erdjs";
import BigNumber from "bignumber.js";
import { notification } from "antd";
import { toWei } from "helper/balance";

const Swap = () => {
    const [showSetting, setShowSetting] = useState<boolean>(false);

    const [tokenFrom, setTokenFrom] = useState<IToken | undefined>(undefined);
    const [valueFrom, setValueFrom] = useState<string>("");

    const [tokenTo, setTokenTo] = useState<IToken | undefined>(undefined);
    const [valueTo, setValueTo] = useState<string>("");

    const [pool, setPool] = useState<IPool | undefined>(undefined);
    const {
        provider,
        proxy,
        connectExtension,
        slippage,
        callContract,
        fetchBalances
    } = useWallet();

    const revertToken = () => {
        setTokenFrom(tokenTo);
        setTokenTo(tokenFrom);
    };

    const rawValueFrom = useMemo(() => {
        if (!valueFrom || !tokenFrom) {
            return new BigNumber(0);
        }

        return toWei(tokenFrom, valueFrom)
    }, [valueFrom, tokenFrom]);

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
                let amountOut = new BigNumber(
                    "0x" + Buffer.from(returnData[0], "base64").toString("hex")
                );
                amountOut = amountOut.div(
                    new BigNumber(10).exponentiatedBy(tokenTo.decimals)
                );

                setValueTo(amountOut.toString(10));
            });
    }, [valueFrom, tokenFrom, tokenTo, provider, pool, proxy, rawValueFrom]);

    useEffect(() => {
        if (!tokenFrom || !tokenTo) {
            return;
        }

        const pool = pools.find(p => {
            return (
                p.tokens.findIndex(t => t.id === tokenFrom?.id) !== -1 &&
                p.tokens.findIndex(t => t.id === tokenTo?.id) !== -1
            );
        });
        setPool(pool);
    }, [tokenFrom, tokenTo]);

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

        notification.success({
            message: `Successfully swap ${valueFrom} ${tokenFrom.name} to ${valueTo} ${tokenTo.name}`,
            onClick: () =>
                window.open(
                    network.explorerAddress +
                        "/transactions/" +
                        tx.getHash().toString(),
                    "_blank"
                )
        });
    }, [provider, pool, rawValueFrom, callContract, tokenFrom, tokenTo, fetchBalances, valueFrom, valueTo]);

    return (
        <div className="flex flex-col items-center pt-3.5">
            <Panel>
                <PanelContent>
                    <div className={styles.fire}>
                        <Image src={Fire} width={151} height={230} alt="Ash" />
                    </div>
                    <div className="flex flex-row justify-between px-4">
                        <div className="font-bold text-2xl">Swap</div>
                        <div className="flex flex-row gap-2">
                            <IconButton icon={<Clock />} />
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
                            token={tokenFrom}
                            onChangeToken={setTokenFrom}
                            poolWithToken={tokenTo}
                            showQuickSelect={!tokenFrom && !!tokenTo}
                            type="from"
                            value={valueFrom}
                            onChangeValue={setValueFrom}
                            resetPivotToken={() => setTokenTo(undefined)}
                        >
                            <div
                                className={styles.revert}
                                onClick={revertToken}
                            >
                                <Revert />
                            </div>
                        </SwapAmount>
                        <SwapAmount
                            bottomRightCorner
                            token={tokenTo}
                            onChangeToken={setTokenTo}
                            poolWithToken={tokenFrom}
                            showQuickSelect={!!tokenFrom && !tokenTo}
                            type="to"
                            value={valueTo}
                            onChangeValue={setValueTo}
                            resetPivotToken={() => setTokenFrom(undefined)}
                            disableInput
                        />
                    </div>

                    {tokenFrom && tokenTo && (
                        <div className="flex flex-row justify-between text-xs text-white my-5">
                            <div className="opacity-50">Rate</div>
                            <div>
                                1 {tokenFrom?.name} = 0.9999 {tokenTo?.name}
                            </div>
                        </div>
                    )}

                    <Button
                        leftIcon={!provider ? <IconWallet /> : <></>}
                        rightIcon={provider ? <IconRight /> : <></>}
                        topLeftCorner
                        style={{ height: 48 }}
                        className="mt-12"
                        outline
                        onClick={provider ? swap : connectExtension}
                    >
                        {provider ? "SWAP" : "CONNECT WALLET"}
                    </Button>
                </PanelContent>
                {showSetting && (
                    <Setting onClose={() => setShowSetting(false)} />
                )}
            </Panel>
        </div>
    );
};

export default Swap;
