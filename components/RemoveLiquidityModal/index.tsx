import { useState, useCallback } from "react";
import {
    Address,
    ContractFunction,
    GasLimit,
    TokenIdentifierValue,
    BigUIntValue
} from "@elrondnetwork/erdjs";
import BigNumber from "bignumber.js";
import Button from "components/Button";
import Input from "components/Input";
import Modal from "components/Modal";
import Token from "components/Token";
import { gasLimit, network } from "const/network";
import { useWallet } from "context/wallet";
import { toWei } from "helper/balance";
import IPool from "interface/pool";
import IconRight from "assets/svg/right-yellow.svg";
import styles from "./RemoveLiquidityModal.module.css";
import { notification } from "antd";
import { Slider } from "antd";
import { theme } from "tailwind.config";

interface Props {
    open?: boolean;
    onClose?: () => void;
    pool: IPool;
}

const RemoveLiquidityModal = (props: Props) => {
    const [liquidity, setLiquidity] = useState<string>("");
    const [value0, setValue0] = useState<string>("");
    const [value1, setValue1] = useState<string>("");
    const { provider, callContract, fetchBalances, balances, slippage } = useWallet();

    const removeLP = useCallback(async () => {
        let tx = await callContract(new Address(props.pool.address), {
            func: new ContractFunction("ESDTTransfer"),
            gasLimit: new GasLimit(gasLimit),
            args: [
                new TokenIdentifierValue(Buffer.from(props.pool.lpToken.id)),
                new BigUIntValue(toWei(props.pool.lpToken, liquidity)),
                new TokenIdentifierValue(Buffer.from("removeLiquidity")),
                new BigUIntValue(toWei(props.pool.tokens[0], value0).multipliedBy(slippage)),
                new BigUIntValue(toWei(props.pool.tokens[1], value1).multipliedBy(slippage)),
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

        if (props.onClose) {
            props.onClose();
        }
    }, [provider, value0, value1, props.pool]);

    return (
        <Modal
            open={props.open}
            onClose={props.onClose}
            contentClassName={styles.content}
            dark="600"
        >
            <div className="flex flex-row items-center mb-3">
                <div className="mr-3">
                    <div className="text-text-input-3 text-xs">
                        {props.pool.tokens[0].name} &{" "}
                        {props.pool.tokens[1].name}
                    </div>
                </div>
                <div className="flex flex-row justify-between items-center">
                    <div
                        className={styles.tokenIcon}
                        style={{ backgroundColor: props.pool.tokens[0].icon }}
                    ></div>
                    <div
                        className={styles.tokenIcon}
                        style={{
                            backgroundColor: props.pool.tokens[1].icon,
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
                                onChange={e => setLiquidity(e.target.value)}
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
                                />
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="my-1.5">
                            <div className="flex flex-row">
                                <Token
                                    token={props.pool.tokens[0]}
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
                                    {balances[props.pool.tokens[0].id]
                                        ? balances[
                                              props.pool.tokens[0].id
                                          ].balance
                                              .div(
                                                  new BigNumber(
                                                      10
                                                  ).exponentiatedBy(
                                                      props.pool.tokens[0]
                                                          .decimals
                                                  )
                                              )
                                              .toFixed(3)
                                              .toString()
                                        : "0"}{" "}
                                    {props.pool.tokens[0].name}
                                </span>
                            </div>
                        </div>

                        <div className="my-1.5">
                            <div className="flex flex-row">
                                <Token
                                    token={props.pool.tokens[1]}
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
                                    {balances[props.pool.tokens[1].id]
                                        ? balances[
                                              props.pool.tokens[1].id
                                          ].balance
                                              .div(
                                                  new BigNumber(
                                                      10
                                                  ).exponentiatedBy(
                                                      props.pool.tokens[1]
                                                          .decimals
                                                  )
                                              )
                                              .toFixed(3)
                                              .toString()
                                        : "0"}{" "}
                                    {props.pool.tokens[1].name}
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
