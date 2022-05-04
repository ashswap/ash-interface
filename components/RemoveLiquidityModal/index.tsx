import { getProxyProvider, sendTransactions } from "@elrondnetwork/dapp-core";
import {
    Address,
    ArgSerializer,
    BigUIntValue,
    ContractFunction,
    EndpointParameterDefinition,
    GasLimit,
    ProxyProvider,
    Query,
    TokenIdentifierValue,
    TypeExpressionParser,
    TypeMapper
} from "@elrondnetwork/erdjs";
import { Slider } from "antd";
import IconRight from "assets/svg/right-yellow.svg";
import BigNumber from "bignumber.js";
import BaseModal from "components/BaseModal";
import Button from "components/Button";
import InputCurrency from "components/InputCurrency";
import Token from "components/Token";
import { PoolsState } from "context/pools";
import { useSwap } from "context/swap";
import { useWallet } from "context/wallet";
import { toEGLD, toEGLDD, toWei } from "helper/balance";
import { useCreateTransaction } from "helper/transactionMethods";
import { useScreenSize } from "hooks/useScreenSize";
import { DappSendTransactionsPropsType } from "interface/dappCore";
import { Unarray } from "interface/utilities";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { theme } from "tailwind.config";
import { useDebounce } from "use-debounce";
import styles from "./RemoveLiquidityModal.module.css";

interface Props {
    open?: boolean;
    onClose?: () => void;
    poolData: Unarray<PoolsState["poolToDisplay"]>;
}
const RemoveLPContent = ({ open, onClose, poolData }: Props) => {
    const { pool, poolStats, liquidityData } = poolData;
    const { capacityPercent, ownLiquidity } = liquidityData!;
    const { total_value_locked } = poolStats || {};
    const [liquidity, setLiquidity] = useState<BigNumber>(new BigNumber(0));
    const [totalUsd, setTotalUsd] = useState<BigNumber>(new BigNumber(0));
    const [liquidityPercent, setLiquidityPercent] = useState<number>(0);
    const [value0, setValue0] = useState<string>("");
    const [value1, setValue1] = useState<string>("");
    const [liquidityDebounce] = useDebounce(liquidity, 500);
    const screenSize = useScreenSize();
    const { fetchBalances, balances, lpTokens, insufficientEGLD } = useWallet();
    const createTx = useCreateTransaction();
    const { slippage } = useSwap();
    const [displayInputLiquidity, setDisplayInputLiquidity] =
        useState<string>("");
    const [removing, setRemoving] = useState(false);
    const proxy: ProxyProvider = getProxyProvider();

    const pricePerLP = useMemo(() => {
        // warning: mocking - change to 0 after pool analytic API success
        if (!total_value_locked) return new BigNumber(0);
        const lpToken = lpTokens[pool.lpToken.id];
        if (!total_value_locked || !lpToken?.totalSupply) {
            return new BigNumber(0);
        }
        return new BigNumber(total_value_locked).div(
            toEGLDD(
                pool.lpToken.decimals,
                lpTokens[pool.lpToken.id].totalSupply!
            )
        );
    }, [total_value_locked, lpTokens, pool]);

    // real LP
    const shortOwnLP = useMemo(() => {
        return toEGLD(pool.lpToken, ownLiquidity.toString());
    }, [pool.lpToken, ownLiquidity]);

    // verify input $ and set the new valid $ value
    const computeValidTotalUsd = useCallback(
        (val: BigNumber) => {
            if (val.div(pricePerLP).div(shortOwnLP).gte(0.998)) {
                const validVal = shortOwnLP.multipliedBy(pricePerLP);
                setDisplayInputLiquidity(validVal.toString(10));
                return validVal;
            }
            return val;
        },
        [pricePerLP, shortOwnLP]
    );

    // re-validate totalUSD on pricePerLP, ownLp changes
    useEffect(() => {
        setTotalUsd((val) => computeValidTotalUsd(val));
    }, [computeValidTotalUsd]);

    // calculate % LP tokens - source of truth: totalUsd
    useEffect(() => {
        const pct = totalUsd
            .div(pricePerLP)
            .div(shortOwnLP)
            .multipliedBy(100)
            .toNumber();
        setLiquidityPercent(pct);
    }, [pricePerLP, totalUsd, shortOwnLP]);

    // only set liquidty base on liquidity percent - source of truth: liquidityPercent
    useEffect(() => {
        setLiquidity(
            new BigNumber(
                ownLiquidity.multipliedBy(liquidityPercent).div(100).toFixed(0)
            )
        );
    }, [ownLiquidity, liquidityPercent]);

    // set liquidityPercent indirectly through totalUsd
    const onChangeLiquidityPercent = useCallback(
        (percent: number) => {
            const valid = computeValidTotalUsd(
                shortOwnLP
                    .multipliedBy(percent)
                    .div(100)
                    .multipliedBy(pricePerLP)
            );
            setDisplayInputLiquidity(valid.toString(10));
            setTotalUsd(valid);
        },
        [pricePerLP, shortOwnLP, computeValidTotalUsd]
    );

    useEffect(() => {
        if (!proxy || liquidityDebounce.eq(new BigNumber(0))) {
            return;
        }

        proxy
            .queryContract(
                new Query({
                    address: new Address(pool.address),
                    func: new ContractFunction("getRemoveLiquidityTokens"),
                    args: [
                        new BigUIntValue(
                            new BigNumber(liquidityDebounce.toString())
                        ),
                        new BigUIntValue(new BigNumber(0)),
                        new BigUIntValue(new BigNumber(0)),
                    ],
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
                    new EndpointParameterDefinition("foo", "bar", mappedType),
                ];
                let values = serializer.stringToValues(
                    resultHex,
                    endpointDefinitions
                );

                setValue0(
                    toEGLD(
                        pool.tokens[0],
                        values[0].valueOf().field0.toString()
                    ).toString()
                );
                setValue1(
                    toEGLD(
                        pool.tokens[1],
                        values[0].valueOf().field1.toString()
                    ).toString()
                );
            });
    }, [liquidityDebounce, pool, proxy]);

    const removeLP = useCallback(async () => {
        if (removing || liquidity.eq(0)) return;
        setRemoving(true);
        let sessionId = "";
        try {
            let tx = await createTx(new Address(pool.address), {
                func: new ContractFunction("ESDTTransfer"),
                gasLimit: new GasLimit(9_000_000),
                args: [
                    new TokenIdentifierValue(Buffer.from(pool.lpToken.id)),
                    new BigUIntValue(liquidity),
                    new TokenIdentifierValue(Buffer.from("removeLiquidity")),
                    new BigUIntValue(
                        new BigNumber(
                            toWei(pool.tokens[0], value0)
                                .multipliedBy(1 - slippage)
                                .toFixed(0)
                        )
                    ),
                    new BigUIntValue(
                        new BigNumber(
                            toWei(pool.tokens[1], value1)
                                .multipliedBy(1 - slippage)
                                .toFixed(0)
                        )
                    ),
                ],
            });
            const payload: DappSendTransactionsPropsType = {
                transactions: tx,
                transactionsDisplayInfo: {
                    successMessage: `Remove Liquidity Success ${value0} ${pool.tokens[0].name} and ${value1} ${pool.tokens[1].name}`,
                },
            };
            sessionId = (await sendTransactions(payload)).sessionId || "";
            fetchBalances();
        } catch (error) {
            // TODO: extension close without response
        }
        setRemoving(false);
        if (sessionId) onClose?.();
    }, [
        value0,
        value1,
        slippage,
        pool,
        onClose,
        createTx,
        fetchBalances,
        liquidity,
        removing,
    ]);

    return (
        <div className="px-8 pt-6 pb-16 sm:pb-7">
            <div className="flex flex-row items-center mb-3">
                <div className="mr-3">
                    <div className="text-text-input-3 text-xs">
                        {pool.tokens[0].name} & {pool.tokens[1].name}
                    </div>
                </div>
                <div className="flex flex-row justify-between items-center">
                    <div className={styles.tokenIcon}>
                        <Image src={pool.tokens[0].icon} alt="token icon" />
                    </div>
                    <div
                        className={styles.tokenIcon}
                        style={{
                            marginLeft: "-3px",
                        }}
                    >
                        <Image src={pool.tokens[1].icon} alt="token icon" />
                    </div>
                </div>
            </div>
            <div className="flex items-baseline text-2xl font-bold text-yellow-700">
                Withdraw Liquidity
            </div>
            <div className="mt-8 mb-12 sm:my-10">
                <div className="relative mb-11 sm:mb-0">
                    <div>
                        <div className="flex items-center space-x-1 bg-ash-dark-700 sm:bg-transparent pl-4 sm:pl-0">
                            <div className="flex items-center font-bold w-24 flex-shrink-0 border-r border-r-ash-gray-500 sm:border-r-0">
                                <IconRight className="mr-4" />
                                <span>TOTAL</span>
                            </div>
                            <div className="flex-1 flex items-center overflow-hidden bg-ash-dark-700 text-right text-lg h-[4.5rem] px-5 ">
                                <InputCurrency
                                    className="bg-transparent text-right flex-grow outline-none"
                                    placeholder="0"
                                    value={displayInputLiquidity}
                                    onChange={(e) => {
                                        const value = e.target.value || "";
                                        setDisplayInputLiquidity(value);
                                        setTotalUsd(
                                            computeValidTotalUsd(
                                                new BigNumber(
                                                    value.startsWith(".")
                                                        ? "0" + value
                                                        : value || "0"
                                                )
                                            )
                                        );
                                    }}
                                />
                                <div className="text-ash-gray-500 ml-2">$</div>
                            </div>
                        </div>
                        <div className="flex flex-row items-center">
                            <div className="sm:w-24"></div>
                            <div className="flex flex-row items-center flex-1 gap-4">
                                <div>0%</div>
                                <Slider
                                    className="ash-slider pt-4 w-full"
                                    step={1}
                                    marks={{
                                        0: "",
                                        25: "",
                                        50: "",
                                        75: "",
                                        100: "",
                                    }}
                                    handleStyle={{
                                        backgroundColor: "#191629",
                                        borderRadius: 0,
                                        border:
                                            "2px solid " +
                                            theme.extend.colors.slider.track,
                                        width: 7,
                                        height: 7,
                                    }}
                                    min={0}
                                    max={100}
                                    value={liquidityPercent}
                                    onChange={(e) =>
                                        onChangeLiquidityPercent(e)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="my-1.5">
                            <div className="flex items-center flex-row space-x-1 bg-ash-dark-700 sm:bg-transparent pl-4 sm:pl-0">
                                <Token
                                    token={pool.tokens[0]}
                                    className="w-24 border-r border-r-ash-gray-500 sm:border-r-0"
                                />
                                <InputCurrency
                                    className="flex-1 overflow-hidden bg-ash-dark-700 text-right text-lg h-12 px-5 outline-none"
                                    placeholder="0"
                                    value={value0}
                                    disabled
                                />
                            </div>
                            <div className="py-2 text-2xs sm:text-sm text-text-input-3 text-right">
                                <span>Available: </span>
                                <span className="text-earn">
                                    {balances[pool.tokens[0].id]
                                        ? balances[pool.tokens[0].id].balance
                                              .div(
                                                  new BigNumber(
                                                      10
                                                  ).exponentiatedBy(
                                                      pool.tokens[0].decimals
                                                  )
                                              )
                                              .toFixed(3)
                                              .toString()
                                        : "0"}{" "}
                                    {pool.tokens[0].name}
                                </span>
                            </div>
                        </div>

                        <div className="my-1.5">
                            <div className="flex items-center flex-row space-x-1 bg-ash-dark-700 sm:bg-transparent pl-4 sm:pl-0">
                                <Token
                                    token={pool.tokens[1]}
                                    className="w-24 border-r border-r-ash-gray-500 sm:border-r-0"
                                />
                                <InputCurrency
                                    className="flex-1 overflow-hidden bg-ash-dark-700 text-right text-lg h-12 px-5 outline-none"
                                    placeholder="0"
                                    value={value1}
                                    disabled
                                />
                            </div>
                            <div className="py-2 text-2xs sm:text-sm text-text-input-3 text-right">
                                <span>Available: </span>
                                <span className="text-earn">
                                    {balances[pool.tokens[1].id]
                                        ? balances[pool.tokens[1].id].balance
                                              .div(
                                                  new BigNumber(
                                                      10
                                                  ).exponentiatedBy(
                                                      pool.tokens[1].decimals
                                                  )
                                              )
                                              .toFixed(3)
                                              .toString()
                                        : "0"}{" "}
                                    {pool.tokens[1].name}
                                </span>
                            </div>
                        </div>

                        <div className="absolute left-4 sm:left-0 text-sm top-14 sm:top-[4rem]">
                            &
                        </div>
                    </div>
                </div>
            </div>

            <div className="sm:flex justify-end md:gap-8">
                <div className="sm:w-1/2 md:w-1/3">
                    <Button
                        topLeftCorner
                        style={{ height: 48 }}
                        className="mt-1.5"
                        outline
                        onClick={removeLP}
                        disable={removing || liquidity.eq(0)}
                        primaryColor="yellow-700"
                    >
                        {insufficientEGLD
                            ? "INSUFFICIENT EGLD BALANCE"
                            : "WITHDRAW"}
                    </Button>
                </div>
            </div>
        </div>
    );
};
const RemoveLiquidityModal = ({ open, onClose, poolData }: Props) => {
    const screenSize = useScreenSize();
    return (
        <BaseModal
            isOpen={!!open}
            onRequestClose={() => onClose && onClose()}
            type={screenSize.msm ? "drawer_btt" : "modal"}
            className="clip-corner-4 clip-corner-tl bg-ash-dark-600 p-4
                    sm:mt-28 max-w-4xl mx-auto
                    fixed sm:relative inset-x-0 bottom-0 max-h-screen overflow-auto text-white flex flex-col"
        >
            <div className="flex justify-end">
                <BaseModal.CloseBtn />
            </div>
            <div className="flex-grow overflow-auto">
                <RemoveLPContent
                    open={open}
                    onClose={onClose}
                    poolData={poolData}
                />
            </div>
        </BaseModal>
    );
};

export default RemoveLiquidityModal;
