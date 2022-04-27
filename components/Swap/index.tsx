import {
    getProxyProvider,
    sendTransactions,
    useGetAccountInfo,
    useGetLoginInfo,
} from "@elrondnetwork/dapp-core";
import {
    Address,
    ArgSerializer,
    BigUIntValue,
    ContractFunction,
    EndpointParameterDefinition,
    GasLimit,
    ProxyProvider,
    Query,
    QueryResponse,
    TokenIdentifierValue,
    Transaction,
    TypeExpressionParser,
    TypeMapper,
} from "@elrondnetwork/erdjs";
import Fire from "assets/images/fire.png";
import ICChevronDown from "assets/svg/chevron-down.svg";
import ICChevronUp from "assets/svg/chevron-up.svg";
import Clock from "assets/svg/clock.svg";
import IconClose from "assets/svg/close.svg";
import Revert from "assets/svg/revert.svg";
import IconRight from "assets/svg/right-white.svg";
import SettingActiveIcon from "assets/svg/setting-active.svg";
import SettingIcon from "assets/svg/setting.svg";
import IconWallet from "assets/svg/wallet.svg";
import BigNumber from "bignumber.js";
import BaseModal from "components/BaseModal";
import Button from "components/Button";
import HistoryModal from "components/HistoryModal";
import IconButton from "components/IconButton";
import Setting from "components/Setting";
import SwapAmount from "components/SwapAmount";
import { gasLimit } from "const/dappConfig";
import { useSwap } from "context/swap";
import { useWallet } from "context/wallet";
import { toEGLD, toEGLDD, toWei } from "helper/balance";
import { formatAmount } from "helper/number";
import { queryContractParser } from "helper/serializer";
import { useCreateTransaction } from "helper/transactionMethods";
import useMounted from "hooks/useMounted";
import { useScreenSize } from "hooks/useScreenSize";
import { DappSendTransactionsPropsType } from "interface/dappCore";
import IPool from "interface/pool";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./Swap.module.css";

const Swap = () => {
    const screenSize = useScreenSize();
    const mounted = useMounted();
    const {
        tokenFrom,
        tokenTo,
        valueFrom,
        valueTo,
        setValueFrom,
        setValueTo,
        setTokenFrom,
        setTokenTo,
        pool,
        rates,
        setRates,
        isInsufficentFund,
        slippage,
    } = useSwap();
    const [showSetting, setShowSetting] = useState<boolean>(false);
    const [isOpenHistoryModal, openHistoryModal] = useState<boolean>(false);
    const [fee, setFee] = useState<number>(0);
    const [isOpenFairPrice, setIsOpenFairPrice] = useState(false);
    const [swapping, setSwapping] = useState(false);

    const { connectWallet } = useWallet();
    const { isLoggedIn: loggedIn } = useGetLoginInfo();
    const { account } = useGetAccountInfo();
    const proxy: ProxyProvider = getProxyProvider();
    const createTx = useCreateTransaction();
    useEffect(() => {
        setShowSetting(false);
        openHistoryModal(false);
    }, [screenSize.isMobile]);
    const revertToken = () => {
        setTokenFrom(tokenTo);
        setTokenTo(tokenFrom);
    };

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

    const getAmountOut = useCallback(
        async (
            poolAddress: string,
            tokenFromId: string,
            tokenToId: string,
            amountIn: BigNumber
        ) => {
            try {
                const { returnData } = await proxy.queryContract(
                    new Query({
                        address: new Address(poolAddress),
                        func: new ContractFunction("getAmountOut"),
                        args: [
                            new TokenIdentifierValue(Buffer.from(tokenFromId)),
                            new TokenIdentifierValue(Buffer.from(tokenToId)),
                            new BigUIntValue(amountIn),
                        ],
                    })
                );
                const values = queryContractParser(
                    returnData[0],
                    "tuple3<BigUint, BigUint, bytes>"
                );

                return values[0].valueOf().field0 as BigNumber;
            } catch (error) {
                return new BigNumber(0);
            }
        },
        [proxy]
    );

    const getAmountOutMaiarPool = useCallback(
        async (
            poolAddress: string,
            tokenFromId: string,
            amountIn: BigNumber
        ) => {
            try {
                const { returnData } = await proxy.queryContract(
                    new Query({
                        address: new Address(poolAddress),
                        func: new ContractFunction("getAmountOut"),
                        args: [
                            new TokenIdentifierValue(Buffer.from(tokenFromId)),
                            new BigUIntValue(amountIn),
                        ],
                    })
                );
                return (
                    queryContractParser(
                        returnData[0],
                        "BigUint"
                    )?.[0]?.valueOf() || new BigNumber(0)
                );
            } catch (error) {}
            return new BigNumber(0);
        },
        [proxy]
    );

    const calculateAmountOut = useCallback(
        async (
            pool: IPool,
            tokenFromId: string,
            tokenToId: string,
            amountIn: BigNumber
        ) => {
            if (pool.isMaiarPool) {
                return await getAmountOutMaiarPool(
                    pool.address,
                    tokenFromId,
                    amountIn
                );
            }
            return await getAmountOut(
                pool.address,
                tokenFromId,
                tokenToId,
                amountIn
            );
        },
        [getAmountOutMaiarPool, getAmountOut]
    );

    const getFeePct = useCallback(
        async (pool: IPool) => {
            try {
                let feeRes: QueryResponse;
                if (pool.isMaiarPool) {
                    feeRes = await proxy.queryContract(
                        new Query({
                            address: new Address(pool.address),
                            func: new ContractFunction("getTotalFeePercent"),
                        })
                    );
                } else {
                    feeRes = await proxy.queryContract(
                        new Query({
                            address: new Address(pool.address),
                            func: new ContractFunction("getSwapFeePercent"),
                        })
                    );
                }
                let fee = new BigNumber(
                    "0x" +
                        Buffer.from(feeRes.returnData[0], "base64").toString(
                            "hex"
                        )
                );

                fee = fee.div(new BigNumber(100000));
                return fee;
            } catch (error) {
                console.error(error);
            }
            return new BigNumber(0);
        },
        [proxy]
    );

    const getReserveMaiarPool = useCallback(
        async (pool: IPool) => {
            const res = await proxy.queryContract(
                new Query({
                    address: new Address(pool.address),
                    func: new ContractFunction("getReservesAndTotalSupply"),
                })
            );
            const [token1, token2, supply] = res.returnData.map(
                (data) =>
                    queryContractParser(
                        data,
                        "BigUint"
                    )[0].valueOf() as BigNumber
            );
            return {
                token1,
                token2,
                supply,
            };
        },
        [proxy]
    );

    // calculate amount out
    useEffect(() => {
        if (!pool || !tokenFrom || !tokenTo || !valueFrom) {
            return;
        }

        let amountIn = rawValueFrom;
        calculateAmountOut(pool, tokenFrom.id, tokenTo.id, amountIn).then(
            (amtOut) => {
                setValueTo(
                    amtOut
                        .div(
                            new BigNumber(10).exponentiatedBy(tokenTo.decimals)
                        )
                        .toString(10)
                );
            }
        );
    }, [
        valueFrom,
        tokenFrom,
        tokenTo,
        pool,
        rawValueFrom,
        setValueTo,
        calculateAmountOut,
    ]);

    // find pools + fetch reserves
    useEffect(() => {
        if (!pool) {
            return;
        }
        const [token1, token2] = pool.tokens;
        if (pool.isMaiarPool) {
            Promise.all([getReserveMaiarPool(pool), getFeePct(pool)]).then(
                ([reserves, fee]) => {
                    const rate1 = toEGLDD(token2.decimals, reserves.token2).div(
                        toEGLDD(token1.decimals, reserves.token1)
                    );
                    const rate2 = new BigNumber(1).div(rate1);
                    setRates([
                        toWei(token2, rate1.toString()),
                        toWei(token1, rate2.toString()),
                    ]);
                    setFee(fee.isNaN() ? 0 : fee.toNumber());
                }
            );
            return;
        }

        Promise.all([
            getAmountOut(
                pool.address,
                token1.id,
                token2.id,
                new BigNumber(10).exponentiatedBy(token1.decimals)
            ),
            getAmountOut(
                pool.address,
                token2.id,
                token1.id,
                new BigNumber(10).exponentiatedBy(token2.decimals)
            ),
            getFeePct(pool),
        ]).then(([rate1, rate2, fee]) => {
            setRates([rate1, rate2]);
            setFee(fee.isNaN() ? 0 : fee.toNumber());
        });
    }, [
        pool,
        setRates,
        getAmountOut,
        getAmountOutMaiarPool,
        getFeePct,
        getReserveMaiarPool,
    ]);

    const swap = useCallback(async () => {
        if (!loggedIn || !tokenFrom || !tokenTo || swapping || !pool) {
            return;
        }

        if (rawValueFrom.lte(0)) {
            return;
        }
        setSwapping(true);
        try {
            let tx: Transaction;
            if (pool.isMaiarPool) {
                tx = await createTx(new Address(pool.address), {
                    func: new ContractFunction("ESDTTransfer"),
                    gasLimit: new GasLimit(gasLimit),
                    args: [
                        new TokenIdentifierValue(Buffer.from(tokenFrom.id)),
                        new BigUIntValue(rawValueFrom),
                        new TokenIdentifierValue(
                            Buffer.from("swapTokensFixedInput")
                        ),
                        new TokenIdentifierValue(Buffer.from(tokenTo.id)),
                        new BigUIntValue(
                            new BigNumber(
                                Math.floor(
                                    rawValueTo
                                        .multipliedBy(1 - slippage)
                                        .toNumber()
                                )
                            )
                        ),
                    ],
                });
            } else {
                tx = await createTx(new Address(pool?.address), {
                    func: new ContractFunction("ESDTTransfer"),
                    gasLimit: new GasLimit(gasLimit),
                    args: [
                        new TokenIdentifierValue(Buffer.from(tokenFrom.id)),
                        new BigUIntValue(rawValueFrom),
                        new TokenIdentifierValue(Buffer.from("exchange")),
                        new TokenIdentifierValue(Buffer.from(tokenTo.id)),
                        new BigUIntValue(new BigNumber(0)),
                    ],
                });
            }

            const payload: DappSendTransactionsPropsType = {
                transactions: tx,
                transactionsDisplayInfo: {
                    successMessage: `Swap succeed ${valueFrom} ${tokenFrom.name} to ${valueTo} ${tokenTo.name}`,
                },
            };
            const { error } = await sendTransactions(payload);
        } catch (error) {
            console.log(error);
            // TODO: extension close without response
            // notification.warn({
            //     message: error as string,
            //     duration: 10
            // });
        }
        setValueTo("");
        setValueFrom("");
        setSwapping(false);
    }, [
        loggedIn,
        pool,
        rawValueFrom,
        tokenFrom,
        tokenTo,
        swapping,
        createTx,
        valueFrom,
        valueTo,
        setValueTo,
        setValueFrom,
        slippage,
        rawValueTo,
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

        return formatAmount(
            toEGLD(
                tokenTo,
                rawValueTo.multipliedBy(1 - slippage).toString()
            ).toNumber(),
            {notation: "standard"}
        );
    }, [tokenTo, rawValueTo, slippage]);

    return (
        <div className="flex flex-col items-center pt-3.5 pb-12 px-6">
            <div className="flex max-w-full">
                <div
                    className={`w-full max-w-[28.75rem] transition-none relative ${
                        showSetting && !screenSize.isMobile && "sm:w-7/12"
                    }`}
                >
                    <div className="clip-corner-4 clip-corner-tl bg-ash-dark-600 absolute top-0 left-0 right-0 bottom-0 z-[-1]"></div>
                    <div className="text-base">
                        <div className="px-6 py-8 sm:px-12 text-white">
                            <div className={styles.fire}>
                                <Image
                                    src={Fire}
                                    width={151}
                                    height={230}
                                    alt="Ash"
                                />
                            </div>
                            <div className="flex flex-row justify-between pl-4">
                                <div className="font-bold text-2xl">Swap</div>
                                <div className="flex flex-row gap-2">
                                    <IconButton
                                        icon={<Clock />}
                                        onClick={() =>
                                            loggedIn &&
                                            openHistoryModal((state) => !state)
                                        }
                                    />
                                    <IconButton
                                        icon={<SettingIcon />}
                                        activeIcon={<SettingActiveIcon />}
                                        onClick={() =>
                                            setShowSetting((state) => !state)
                                        }
                                        active={showSetting}
                                    />
                                </div>
                            </div>

                            <div className="relative pt-12">
                                <SwapAmount
                                    topLeftCorner
                                    showQuickSelect={!tokenFrom && !!tokenTo}
                                    type="from"
                                    resetPivotToken={() =>
                                        setTokenTo(undefined)
                                    }
                                />
                                <div
                                    style={{ height: 4, position: "relative" }}
                                >
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
                                    resetPivotToken={() =>
                                        setTokenFrom(undefined)
                                    }
                                    disableInput
                                />
                            </div>

                            {tokenFrom && tokenTo && (
                                <div
                                    className="flex flex-row justify-between text-xs text-white my-5"
                                    style={{ color: "#00FF75" }}
                                >
                                    <div
                                        className="opacity-50 font-bold flex flex-row items-center gap-2 select-none cursor-pointer"
                                        onClick={() =>
                                            setIsOpenFairPrice(
                                                (state) => !state
                                            )
                                        }
                                    >
                                        <div>Fair price</div>
                                        <div>
                                            {isOpenFairPrice ? (
                                                <ICChevronUp />
                                            ) : (
                                                <ICChevronDown />
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        1 {tokenFrom?.name} ={" "}
                                        {pool &&
                                            rates &&
                                            formatAmount(
                                                pool?.tokens[0].id ===
                                                    tokenFrom.id
                                                    ? toEGLD(
                                                          pool.tokens[1],
                                                          rates[0].toString()
                                                      ).toNumber()
                                                    : toEGLD(
                                                          pool.tokens[0],
                                                          rates[1].toString()
                                                      ).toNumber(),
                                                { notation: "standard" }
                                            )}{" "}
                                        {tokenTo?.name}
                                    </div>
                                </div>
                            )}

                            {isOpenFairPrice &&
                                pool &&
                                rawValueFrom.gt(new BigNumber(0)) && (
                                    <>
                                        <div className="bg-black flex flex-row items-center justify-between h-10 pl-5 pr-6">
                                            <div
                                                className={
                                                    styles.swapResultLabel
                                                }
                                            >
                                                Price impact
                                            </div>
                                            <div
                                                className={
                                                    styles.swapResultValue
                                                }
                                                style={{ color: "#00FF75" }}
                                            >
                                                {priceImpact}
                                            </div>
                                        </div>
                                        <div className="bg-black flex flex-row items-center justify-between h-10 pl-5 pr-6">
                                            <div
                                                className={
                                                    styles.swapResultLabel
                                                }
                                            >
                                                Minimum received
                                            </div>
                                            <div
                                                className={
                                                    styles.swapResultValue
                                                }
                                            >
                                                {minimumReceive} {tokenTo?.name}
                                            </div>
                                        </div>
                                        <div className="bg-black flex flex-row items-center justify-between h-10 pl-5 pr-6">
                                            <div
                                                className={
                                                    styles.swapResultLabel
                                                }
                                            >
                                                Slippage
                                            </div>
                                            <div
                                                className={
                                                    styles.swapResultValue
                                                }
                                            >
                                                {slippage * 100}%
                                            </div>
                                        </div>
                                        <div className="bg-black flex flex-row items-center justify-between h-10 pl-5 pr-6">
                                            <div
                                                className={
                                                    styles.swapResultLabel
                                                }
                                            >
                                                Swap fees
                                            </div>
                                            {pool.isMaiarPool ? (
                                                <div
                                                    className={
                                                        styles.swapResultValue
                                                    }
                                                >
                                                    {tokenFrom && rawValueFrom
                                                        ? formatAmount(
                                                              toEGLD(
                                                                  tokenFrom,
                                                                  rawValueFrom
                                                                      .multipliedBy(
                                                                          fee
                                                                      )
                                                                      .toString()
                                                              ).toNumber()
                                                          )
                                                        : "0"}{" "}
                                                    {tokenFrom?.name}
                                                </div>
                                            ) : (
                                                <div
                                                    className={
                                                        styles.swapResultValue
                                                    }
                                                >
                                                    {tokenTo && rawValueTo
                                                        ? formatAmount(
                                                              toEGLD(
                                                                  tokenTo,
                                                                  rawValueTo
                                                                      .multipliedBy(
                                                                          fee
                                                                      )
                                                                      .toString()
                                                              ).toNumber()
                                                          )
                                                        : "0"}{" "}
                                                    {tokenTo?.name}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                            {mounted &&
                                (isInsufficentFund ||
                                account.balance === "0" ? (
                                    <Button
                                        leftIcon={
                                            !loggedIn ? <IconWallet /> : <></>
                                        }
                                        rightIcon={
                                            loggedIn ? <IconRight /> : <></>
                                        }
                                        topLeftCorner
                                        style={{ height: 48 }}
                                        className="mt-12"
                                        disable
                                        outline
                                    >
                                        <span className="text-text-input-3">
                                            INSUFFICIENT{" "}
                                            <span className="text-insufficent-fund">
                                                {account.balance === "0"
                                                    ? "EGLD"
                                                    : tokenFrom?.name}
                                            </span>{" "}
                                            BALANCE
                                        </span>
                                    </Button>
                                ) : (
                                    <Button
                                        leftIcon={
                                            !loggedIn ? <IconWallet /> : <></>
                                        }
                                        rightIcon={
                                            loggedIn ? <IconRight /> : <></>
                                        }
                                        topLeftCorner
                                        style={{ height: 48 }}
                                        className="mt-12 text-xs sm:text-sm"
                                        outline
                                        disable={swapping}
                                        onClick={
                                            loggedIn
                                                ? swap
                                                : () => connectWallet()
                                        }
                                        glowOnHover
                                    >
                                        {loggedIn ? "SWAP" : "CONNECT WALLET"}
                                    </Button>
                                ))}

                            <div
                                className="text-xs font-bold text-center"
                                style={{ marginTop: 34 }}
                            >
                                <span className="text-text-input-3">
                                    DON&apos;T KNOW HOW TO USE IT?{" "}
                                </span>
                                <a
                                    href="https://docs.ashswap.io/guides/swap-trade"
                                    target={"_blank"}
                                    rel="noreferrer"
                                    style={{ color: "#14E499" }}
                                >
                                    VISIT HERE!
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                {showSetting && !screenSize.isMobile && (
                    <div className="relative px-12 py-14 bg-ash-dark-600 sm:w-5/12 max-w-[23rem] text-white border-l border-l-[#757391]">
                        <div className="absolute top-4 right-4">
                            <IconButton
                                icon={<IconClose className="text-white" />}
                                iconSize="small"
                                onClick={() => setShowSetting(false)}
                            />
                        </div>
                        <Setting />
                    </div>
                )}
            </div>
            <HistoryModal
                open={isOpenHistoryModal}
                onClose={() => openHistoryModal(false)}
            />
            {screenSize.isMobile && (
                <BaseModal
                    isOpen={showSetting}
                    onRequestClose={() => setShowSetting(false)}
                    type="drawer_btt"
                    className="clip-corner-4 clip-corner-tl bg-ash-dark-600 p-4 text-white flex flex-col max-h-full"
                >
                    <div className="flex justify-end">
                        <BaseModal.CloseBtn />
                    </div>
                    <Setting />
                    <Button
                        className="uppercase text-xs mt-10"
                        textClassName="h-10"
                        onClick={() => setShowSetting(false)}
                    >
                        Confirm
                    </Button>
                </BaseModal>
            )}
        </div>
    );
};

export default Swap;
