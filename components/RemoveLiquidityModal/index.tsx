import { useState, useCallback, useMemo, useEffect } from "react";
import {
    Address,
    ContractFunction,
    GasLimit,
    TokenIdentifierValue,
    BigUIntValue,
    Query,
    TupleType,
    TypeExpressionParser,
    TypeMapper,
    ArgSerializer,
    EndpointParameterDefinition
} from "@elrondnetwork/erdjs";
import BigNumber from "bignumber.js";
import Button from "components/Button";
import Input from "components/Input";
import Modal from "components/Modal";
import Token from "components/Token";
import { gasLimit, network } from "const/network";
import { useWallet } from "context/wallet";
import { toEGLD, toWei } from "helper/balance";
import IPool from "interface/pool";
import IconRight from "assets/svg/right-yellow.svg";
import styles from "./RemoveLiquidityModal.module.css";
import { notification } from "antd";
import { Slider } from "antd";
import { theme } from "tailwind.config";
import { useDebounce } from "use-debounce";
import { useSwap } from "context/swap";

interface Props {
    open?: boolean;
    onClose?: () => void;
    pool: IPool;
}

const RemoveLiquidityModal = ({ open, onClose, pool }: Props) => {
    const [liquidity, setLiquidity] = useState<string>("");
    const [liquidityPercent, setLiquidityPercent] = useState<number>(0);
    const [value0, setValue0] = useState<string>("");
    const [value1, setValue1] = useState<string>("");
    const [liquidityDebounce] = useDebounce(liquidity, 500);
    const {
        provider,
        callContract,
        fetchBalances,
        balances,
        proxy
    } = useWallet();
    const { slippage } = useSwap();

    const ownLiquidity = useMemo(() => {
        return balances[pool.lpToken.id]
            ? balances[pool.lpToken.id].balance
            : new BigNumber(0);
    }, [balances, pool]);

    const onChangeLiquidityNumber = useCallback(
        l => {
            let totalOwnLiquid = toEGLD(pool.lpToken, ownLiquidity.toString());
            if (new BigNumber(l).gt(totalOwnLiquid)) {
                l = totalOwnLiquid.toString();
            }

            setLiquidity(l);
            setLiquidityPercent(
                toWei(pool.lpToken, l)
                    .multipliedBy(100)
                    .div(ownLiquidity)
                    .toNumber()
            );
        },
        [pool.lpToken, ownLiquidity]
    );

    const onChangeLiquidityPercent = useCallback(
        (percent: number) => {
            setLiquidity(
                toEGLD(
                    pool.lpToken,
                    ownLiquidity
                        .multipliedBy(percent)
                        .div(100)
                        .toString(10)
                ).toString(10)
            );
            setLiquidityPercent(percent);
        },
        [ownLiquidity, pool.lpToken]
    );

    useEffect(() => {
        if (!liquidityDebounce) {
            return;
        }

        proxy
            .queryContract(
                new Query({
                    address: new Address(pool.address),
                    func: new ContractFunction("getRemoveLiquidityTokens"),
                    args: [
                        new BigUIntValue(
                            new BigNumber(
                                toWei(pool.lpToken, liquidityDebounce)
                            )
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
        let tx = await callContract(new Address(pool.address), {
            func: new ContractFunction("ESDTTransfer"),
            gasLimit: new GasLimit(gasLimit),
            args: [
                new TokenIdentifierValue(Buffer.from(pool.lpToken.id)),
                new BigUIntValue(toWei(pool.lpToken, liquidity)),
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

        notification.success({
            message: "Successfully remove liquidity",
            onClick: () =>
                window.open(
                    network.explorerAddress +
                        "/transactions/" +
                        tx.getHash().toString(),
                    "_blank"
                )
        });

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
        <Modal
            open={open}
            onClose={onClose}
            contentClassName={styles.content}
            dark="650"
        >
            <div className="flex flex-row items-center mb-3">
                <div className="mr-3">
                    <div className="text-text-input-3 text-xs">
                        {pool.tokens[0].name} & {pool.tokens[1].name}
                    </div>
                </div>
                <div className="flex flex-row justify-between items-center">
                    <div
                        className={styles.tokenIcon}
                        style={{ backgroundColor: pool.tokens[0].icon }}
                    ></div>
                    <div
                        className={styles.tokenIcon}
                        style={{
                            backgroundColor: pool.tokens[1].icon,
                            marginLeft: "-3px"
                        }}
                    ></div>
                </div>
            </div>
            <div className="flex flex-row items-baseline text-2xl font-bold text-yellow-700">
                Withdraw Liquidity
            </div>
            <div className="flex flex-row my-10 gap-8">
                <div className="relative w-2/3">
                    <div>
                        <div className="flex flex-row items-center">
                            <div className="flex flex-row items-center font-bold w-1/3">
                                <IconRight className="mr-4" />
                                <span>TOTAL</span>
                            </div>
                            <Input
                                className="flex-1"
                                backgroundClassName="bg-ash-dark-700"
                                textColorClassName="text-input-3"
                                placeholder="0"
                                type="number"
                                textAlign="right"
                                textClassName="text-lg"
                                value={liquidity}
                                onChange={e =>
                                    onChangeLiquidityNumber(e.target.value)
                                }
                                style={{ height: 72 }}
                            />
                        </div>
                        <div className="flex flex-row items-center">
                            <div className="w-1/3"></div>
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
                                            theme.extend.colors.slider.track,
                                        width: 7,
                                        height: 7
                                    }}
                                    min={0}
                                    max={100}
                                    value={liquidityPercent}
                                    onChange={e => onChangeLiquidityPercent(e)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="my-1.5">
                            <div className="flex flex-row">
                                <Token
                                    token={pool.tokens[0]}
                                    className="w-1/3"
                                />
                                <Input
                                    className="flex-1"
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
                            <div className="bg-bg py-2 text-sm text-text-input-3 text-right">
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
                            <div className="flex flex-row">
                                <Token
                                    token={pool.tokens[1]}
                                    className="w-1/3"
                                />
                                <Input
                                    className="flex-1"
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
                            <div className="bg-bg py-2 text-sm text-text-input-3 text-right">
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

                        <div
                            className="absolute left-0 ml-2"
                            style={{ top: 62 }}
                        >
                            &
                        </div>
                    </div>
                </div>
                <div className="w-1/3 bg-ash-dark-500 p-8">
                    <div className="text-lg font-bold text-yellow-700">
                        Your profit will go down
                    </div>
                    <div className="flex flex-row flex-wrap text-xs my-8 gap-y-9">
                        <div className="w-1/2">
                            <div className="mb-4">Your Capacity</div>
                            <div>-</div>
                        </div>
                        <div className="w-full">
                            <div className="mb-4">Farm per day</div>
                            <div>- ELGD</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-row gap-8">
                <div className="w-2/3" />
                <div className="w-1/3">
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
        </Modal>
    );
};

export default RemoveLiquidityModal;
