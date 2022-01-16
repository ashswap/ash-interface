import {
    Address,
    ArgSerializer,
    BigUIntValue,
    ContractFunction,
    EndpointParameterDefinition,
    GasLimit,
    Query,
    TokenIdentifierValue,
    TypeExpressionParser,
    TypeMapper
} from "@elrondnetwork/erdjs";
import { notification, Slider } from "antd";
import IconNewTab from "assets/svg/new-tab-green.svg";
import IconRight from "assets/svg/right-yellow.svg";
import BigNumber from "bignumber.js";
import Button from "components/Button";
import Input from "components/Input";
import { usePool } from "components/ListPoolItem";
import ReactModel from "components/ReactModal";
import Token from "components/Token";
import { TAILWIND_BREAKPOINT } from "const/mediaQueries";
import { gasLimit, network } from "const/network";
import { useSwap } from "context/swap";
import { useWallet } from "context/wallet";
import { toEGLD, toWei } from "helper/balance";
import useMediaQuery from "hooks/useMediaQuery";
import IPool from "interface/pool";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { theme } from "tailwind.config";
import { useDebounce } from "use-debounce";
import styles from "./RemoveLiquidityModal.module.css";
import ICArrowBottomRight from "assets/svg/arrow-bottom-right.svg";
import ICArrowTopRight from "assets/svg/arrow-top-right.svg";

interface Props {
    open?: boolean;
    onClose?: () => void;
    pool: IPool;
}

const RemoveLiquidityModal = ({ open, onClose, pool }: Props) => {
    const [liquidity, setLiquidity] = useState<BigNumber>(new BigNumber(0));
    const [totalUsd, setTotalUsd] = useState<string>("");
    const [liquidityPercent, setLiquidityPercent] = useState<number>(0);
    const [value0, setValue0] = useState<string>("");
    const [value1, setValue1] = useState<string>("");
    const [liquidityDebounce] = useDebounce(liquidity, 500);
    const isSMScreen = useMediaQuery(`(max-width: ${TAILWIND_BREAKPOINT.SM}px)`);
    const {
        callContract,
        fetchBalances,
        balances,
        proxy,
        lpTokens
    } = useWallet();
    const { slippage } = useSwap();
    const { capacityPercent, valueUsd, ownLiquidity } = usePool();

    const pricePerLP = useMemo(() => {
        if (!valueUsd || !lpTokens[pool.lpToken.id].totalSupply) {
            return new BigNumber(0);
        }

        return valueUsd.div(lpTokens[pool.lpToken.id].totalSupply!.toString());
    }, [valueUsd, lpTokens, pool]);

    // input $ => calculate how many LP tokens
    useEffect(() => {
        if (totalUsd === "") {
            return;
        }

        let lp = new BigNumber(totalUsd).div(pricePerLP);
        lp = toWei(pool.lpToken, lp.toString());

        setLiquidity(lp);
    }, [totalUsd, pool, pricePerLP]);

    // update slider when input change
    useEffect(() => {
        setLiquidityPercent(
            liquidity
                .multipliedBy(100)
                .div(ownLiquidity)
                .toNumber()
        );
    }, [ownLiquidity, liquidity]);

    const onChangeLiquidityPercent = useCallback(
        (percent: number) => {
            let liquidity = new BigNumber(
                ownLiquidity
                    .multipliedBy(percent)
                    .div(100)
                    .toFixed(0)
            );

            let shortLiquidity = toEGLD(pool.lpToken, liquidity.toString(10));

            let totalUsd = shortLiquidity.multipliedBy(pricePerLP);

            setTotalUsd(totalUsd.toFixed(5));
            setLiquidity(liquidity);
            setLiquidityPercent(percent);
        },
        [pricePerLP, ownLiquidity, pool.lpToken]
    );

    useEffect(() => {
        if (liquidityDebounce.eq(new BigNumber(0))) {
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
        try {
            let tx = await callContract(new Address(pool.address), {
                func: new ContractFunction("ESDTTransfer"),
                gasLimit: new GasLimit(gasLimit),
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
                    )
                ]
            });

            fetchBalances();

            let key = `open${Date.now()}`;
            notification.open({
                key,
                message: `Remove Liquidity Success ${value0} ${pool.tokens[0].name} and ${value1} ${pool.tokens[1].name}`,
                icon: <IconNewTab />,
                onClick: () =>
                    window.open(
                        network.explorerAddress +
                            "/transactions/" +
                            tx.getHash().toString(),
                        "_blank"
                    )
            });
            setTimeout(() => {
                notification.close(key);
            }, 10000);
        } catch (error) {
            // TODO: extension close without response
        }

        if (onClose) {
            onClose();
        }
    }, [
        value0,
        value1,
        slippage,
        pool,
        onClose,
        callContract,
        fetchBalances,
        liquidity
    ]);

    return (
        <ReactModel
            isOpen={!!open}
            onRequestClose={onClose}
            useClipCorner={true}
            className={`sm:mt-28 sm:ash-container max-w-[51.75rem] mx-auto
            fixed bottom-0 left-0 right-0 sm:relative
            `}
        >
            <div className="clip-corner-4 clip-corner-tl bg-ash-dark-600 text-white px-12 pt-10 pb-20 sm:pb-11">
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
                                marginLeft: "-3px"
                            }}
                        >
                            <Image src={pool.tokens[1].icon} alt="token icon" />
                        </div>
                    </div>
                </div>
                <div className="flex items-baseline text-2xl font-bold text-yellow-700">
                    Withdraw Liquidity
                </div>
                <div className="sm:flex mt-8 mb-12 sm:my-10 gap-4 md:gap-8">
                    <div className="relative sm:w-1/2 md:w-2/3 overflow-hidden mb-11 sm:mb-0">
                        <div>
                            <div className="flex items-center space-x-1 bg-ash-dark-700 sm:bg-transparent pl-4 sm:pl-0">
                                <div className="flex items-center font-bold w-24 flex-shrink-0 border-r border-r-ash-gray-500 sm:border-r-0">
                                    <IconRight className="mr-4" />
                                    <span>TOTAL</span>
                                </div>
                                <Input
                                    className="flex-1 overflow-hidden"
                                    backgroundClassName="bg-ash-dark-700"
                                    textColorClassName="text-input-3"
                                    placeholder="0"
                                    type="number"
                                    textAlign="right"
                                    textClassName="text-lg"
                                    value={totalUsd}
                                    onChange={e => setTotalUsd(e.target.value)}
                                    style={{ height: 72 }}
                                />
                            </div>
                            <div className="flex flex-row items-center">
                                <div className="sm:w-24"></div>
                                <div className="flex flex-row items-center flex-1 gap-4">
                                    <div>0%</div>
                                    <Slider
                                        className="ash-slider pt-4 w-full"
                                        step={5}
                                        marks={{
                                            0: "",
                                            25: "",
                                            50: "",
                                            75: "",
                                            100: ""
                                        }}
                                        handleStyle={{
                                            backgroundColor: "#191629",
                                            borderRadius: 0,
                                            border:
                                                "2px solid " +
                                                theme.extend.colors.slider
                                                    .track,
                                            width: 7,
                                            height: 7
                                        }}
                                        min={0}
                                        max={100}
                                        value={liquidityPercent}
                                        onChange={e =>
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
                                    <Input
                                        className="flex-1 overflow-hidden"
                                        backgroundClassName="bg-ash-dark-700"
                                        textColorClassName="text-input-3"
                                        placeholder="0"
                                        type="number"
                                        textAlign="right"
                                        textClassName="text-lg"
                                        value={value0}
                                        disabled
                                    />
                                </div>
                                <div className="py-2 text-2xs sm:text-sm text-text-input-3 text-right">
                                    <span>Available: </span>
                                    <span className="text-earn">
                                        {balances[pool.tokens[0].id]
                                            ? balances[
                                                  pool.tokens[0].id
                                              ].balance
                                                  .div(
                                                      new BigNumber(
                                                          10
                                                      ).exponentiatedBy(
                                                          pool.tokens[0]
                                                              .decimals
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
                                    <Input
                                        className="flex-1 overflow-hidden"
                                        backgroundClassName="bg-ash-dark-700"
                                        textColorClassName="text-input-3"
                                        placeholder="0"
                                        type="number"
                                        textAlign="right"
                                        textClassName="text-lg"
                                        value={value1}
                                        disabled
                                    />
                                </div>
                                <div className="py-2 text-2xs sm:text-sm text-text-input-3 text-right">
                                    <span>Available: </span>
                                    <span className="text-earn">
                                        {balances[pool.tokens[1].id]
                                            ? balances[
                                                  pool.tokens[1].id
                                              ].balance
                                                  .div(
                                                      new BigNumber(
                                                          10
                                                      ).exponentiatedBy(
                                                          pool.tokens[1]
                                                              .decimals
                                                      )
                                                  )
                                                  .toFixed(3)
                                                  .toString()
                                            : "0"}{" "}
                                        {pool.tokens[1].name}
                                    </span>
                                </div>
                            </div>

                            <div
                                className="absolute left-4 sm:left-0 text-sm top-14 sm:top-[4rem]"
                    
                            >
                                &
                            </div>
                        </div>
                    </div>
                    <div className="sm:w-1/2 md:w-1/3 bg-ash-dark-500 p-9 sm:p-8">
                        <div className="text-lg font-bold text-yellow-700">
                            Your profit will go down
                        </div>
                        <div className="flex flex-wrap my-8 gap-y-9">
                            <div className="w-1/2">
                                <div className="mb-4 text-xs">Your liquidity</div>
                                <div className="text-lg font-bold">{capacityPercent.toFixed(2)}%</div>
                                <div className="text-ash-purple-500 text-2xs mt-2">
                                    <ICArrowBottomRight className="inline mr-1"/>
                                    <span>-26%</span>
                                </div>
                            </div>
                            <div className="w-1/2">
                                <div className="mb-4 text-xs">Farm per day</div>
                                <div className="text-lg font-bold">-15.211 <span className="text-xs font-normal">ELGD</span></div>
                                <div className="text-ash-purple-500 text-2xs mt-2">
                                    <ICArrowBottomRight className="inline mr-1"/>
                                    <span>-26%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sm:flex items-center gap-4 md:gap-8">
                    <div className="sm:w-1/2 md:w-2/3 text-center sm:text-right mb-8 sm:mb-0 font-bold text-sm">
                        <div className="text-white">You also receive</div>
                        <div className="text-earn">0.005 ELGD by farming</div>
                    </div>
                    <div className="sm:w-1/2 md:w-1/3">
                        <Button
                            topLeftCorner
                            style={{ height: 48 }}
                            className="mt-1.5"
                            outline
                            onClick={removeLP}
                            primaryColor="yellow-700"
                        >
                            WITHDRAW
                        </Button>
                    </div>
                </div>
            </div>
        </ReactModel>
    );
};

export default RemoveLiquidityModal;
