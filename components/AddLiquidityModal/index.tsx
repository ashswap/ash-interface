import {
    Address,
    ContractFunction,
    GasLimit,
    TokenIdentifierValue,
    BigUIntValue,
    AddressValue,
    Query
} from "@elrondnetwork/erdjs";
import BigNumber from "bignumber.js";
import Button from "components/Button";
import Checkbox from "components/Checkbox";
import IconButton from "components/IconButton";
import Input from "components/Input";
import Modal from "components/Modal";
import Token from "components/Token";
import { gasLimit, network } from "const/network";
import { useWallet } from "context/wallet";
import { toEGLD, toWei } from "helper/balance";
import IPool from "interface/pool";
import IconRight from "assets/svg/right-white.svg";
import { useEffect, useState, useCallback, useMemo } from "react";
import styles from "./AddLiquidity.module.css";
import { IToken } from "interface/token";
import { notification } from "antd";
import { useDebounce } from "use-debounce";

interface Props {
    open?: boolean;
    onClose?: () => void;
    pool: IPool;
    tokenValue0: string;
    tokenValue1: string;
    capacityPercent: string;
}

const AddLiquidityModal = ({
    open,
    onClose,
    pool,
    tokenValue0,
    tokenValue1,
    capacityPercent
}: Props) => {
    const [isAgree, setAgree] = useState<boolean>(false);
    const [value0, setValue0] = useState<string>("");
    const [value0Debounce] = useDebounce(value0, 500);
    const [value1, setValue1] = useState<string>("");
    const [value1Debounce] = useDebounce(value1, 500);
    const {
        provider,
        proxy,
        callContract,
        fetchBalances,
        balances
    } = useWallet();
    const [rates, setRates] = useState<BigNumber[] | undefined>(undefined);
    const [liquidity, setLiquidity] = useState<string>("");

    // reset when open modal
    useEffect(() => {
        if (open) {
            setAgree(false);
        }
    }, [open]);

    const addLP = useCallback(async () => {
        let tx = await callContract(new Address(provider?.account.address), {
            func: new ContractFunction("MultiESDTNFTTransfer"),
            gasLimit: new GasLimit(gasLimit),
            args: [
                new AddressValue(new Address(pool.address)),
                new BigUIntValue(new BigNumber(2)),

                new TokenIdentifierValue(Buffer.from(pool.tokens[0].id)),
                new BigUIntValue(new BigNumber(0)),
                new BigUIntValue(toWei(pool.tokens[0], value0)),

                new TokenIdentifierValue(Buffer.from(pool.tokens[1].id)),
                new BigUIntValue(new BigNumber(0)),
                new BigUIntValue(toWei(pool.tokens[1], value1)),

                new TokenIdentifierValue(Buffer.from("addLiquidity")),
                new BigUIntValue(toWei(pool.tokens[0], value0)),
                new BigUIntValue(toWei(pool.tokens[1], value1))
            ]
        });

        fetchBalances();

        notification.success({
            message: "Successfully add liquidity",
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
    }, [provider, value0, value1, pool, onClose, callContract, fetchBalances]);

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
            )
        ]).then(results => {
            let rates = results.slice(0, 2).map(result => {
                return new BigNumber(
                    "0x" +
                        Buffer.from(result.returnData[0], "base64").toString(
                            "hex"
                        )
                );
            });

            setRates(rates);
        });
    }, [pool, proxy, setRates]);

    const onChangeValue0 = useCallback(
        (value: string) => {
            if (!rates) {
                return;
            }

            setValue0(value);
            setValue1(
                toEGLD(
                    pool.tokens[1],
                    rates[0].multipliedBy(new BigNumber(value)).toString()
                ).toFixed(3)
            );
        },
        [rates, pool]
    );

    const onChangeValue1 = useCallback(
        (value: string) => {
            if (!rates) {
                return;
            }

            setValue1(value);
            setValue0(
                toEGLD(
                    pool.tokens[0],
                    rates[1].multipliedBy(new BigNumber(value)).toString()
                ).toFixed(3)
            );
        },
        [rates, pool]
    );

    const balance0 = useMemo(() => {
        return balances[pool.tokens[0].id]
            ? balances[pool.tokens[0].id].balance
                  .div(
                      new BigNumber(10).exponentiatedBy(pool.tokens[0].decimals)
                  )
                  .toFixed(3)
                  .toString()
            : "0";
    }, [balances, pool]);

    const balance1 = useMemo(() => {
        return balances[pool.tokens[1].id]
            ? balances[pool.tokens[1].id].balance
                  .div(
                      new BigNumber(10).exponentiatedBy(pool.tokens[1].decimals)
                  )
                  .toFixed(3)
                  .toString()
            : "0";
    }, [balances, pool]);

    useEffect(() => {
        if (value0Debounce === "" || value1Debounce === "") {
            return;
        }

        proxy
            .queryContract(
                new Query({
                    address: new Address(pool.address),
                    func: new ContractFunction("getAddLiquidityTokens"),
                    args: [
                        new BigUIntValue(
                            new BigNumber(toWei(pool.tokens[0], value0Debounce))
                        ),
                        new BigUIntValue(
                            new BigNumber(toWei(pool.tokens[1], value1Debounce))
                        )
                    ]
                })
            )
            .then(({ returnData }) => {
                console.log(returnData);

                let liquidity = new BigNumber(
                    "0x" + Buffer.from(returnData[0], "base64").toString("hex")
                );

                setLiquidity(
                    toEGLD(pool.lpToken, liquidity.toString()).toFixed(3)
                );
            });
    }, [value0Debounce, value1Debounce, pool, proxy]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            contentClassName={styles.content}
            dark="650"
        >
            <div className="flex flex-row justify-between items-center w-1/3">
                <div>
                    <div className="text-text-input-3 text-xs">Deposit</div>
                    <div className="flex flex-row items-baseline text-2xl font-bold">
                        <span>{pool.tokens[0].name}</span>
                        <span className="text-sm px-3">&</span>
                        <span>{pool.tokens[1].name}</span>
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
                            marginLeft: "-10px"
                        }}
                    ></div>
                </div>
            </div>
            <div className="flex flex-row my-10 gap-8">
                <div className="relative w-7/12">
                    <div className="my-1.5">
                        <div className="flex flex-row">
                            <div className={`flex flex-row items-center w-1/3`}>
                                <div
                                    style={{
                                        backgroundColor: pool.tokens[0].icon
                                    }}
                                    className={styles.smallTokenIcon}
                                />
                                <div>
                                    <div className={styles.smallTokenName}>
                                        {pool.tokens[0].name}
                                    </div>
                                    <div className="text-text-input-3 text-xs">
                                        {tokenValue0} in pool
                                    </div>
                                </div>
                            </div>
                            <Input
                                className="flex-1"
                                backgroundClassName="bg-ash-dark-700"
                                textColorClassName="text-input-3"
                                placeholder="0"
                                type="number"
                                textAlign="right"
                                textClassName="text-lg"
                                value={value0}
                                onChange={e => onChangeValue0(e.target.value)}
                            />
                        </div>
                        <div className="bg-bg py-2 text-sm text-text-input-3 text-right">
                            <span>Balance: </span>
                            <span
                                className="text-earn select-none cursor-pointer"
                                onClick={() => onChangeValue1(balance0)}
                            >
                                {balance0} {pool.tokens[0].name}
                            </span>
                        </div>
                    </div>

                    <div className="my-1.5">
                        <div className="flex flex-row">
                            <div className={`flex flex-row items-center w-1/3`}>
                                <div
                                    style={{
                                        backgroundColor: pool.tokens[1].icon
                                    }}
                                    className={styles.smallTokenIcon}
                                />
                                <div>
                                    <div className={styles.smallTokenName}>
                                        {pool.tokens[1].name}
                                    </div>
                                    <div className="text-text-input-3 text-xs">
                                        {tokenValue1} in pool
                                    </div>
                                </div>
                            </div>
                            <Input
                                className="flex-1"
                                backgroundClassName="bg-ash-dark-700"
                                textColorClassName="text-input-3"
                                placeholder="0"
                                type="number"
                                textAlign="right"
                                textClassName="text-lg"
                                value={value1}
                                onChange={e => onChangeValue1(e.target.value)}
                            />
                        </div>
                        <div className="bg-bg py-2 text-sm text-text-input-3 text-right">
                            <span>Balance: </span>
                            <span
                                className="text-earn select-none cursor-pointer"
                                onClick={() => onChangeValue1(balance1)}
                            >
                                {balance1} {pool.tokens[1].name}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="flex flex-row items-center font-bold w-1/3">
                            <IconRight className="mr-4" />
                            <span>Liquidity</span>
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
                            disabled
                            style={{ height: 72 }}
                        />
                    </div>

                    <div className="absolute left-0 ml-2" style={{ top: 62 }}>
                        &
                    </div>
                </div>
                <div className="w-5/12 bg-ash-dark-500 p-8">
                    <div className="text-lg font-bold">Estimate value</div>
                    <div className="flex flex-col text-xs my-8 gap-y-9">
                        <div className="flex flex-row">
                            <div className="w-8/12">
                                <div className="mb-2">Earn per month</div>
                                <div>-</div>
                            </div>
                            <div className="w-4/12">
                                <div className="mb-2">Farm per day</div>
                                <div>-</div>
                            </div>
                        </div>
                        <div className="flex flex-row gap-10">
                            <div>
                                <div className="mb-2">APR</div>
                                <div className="text-pink-600 font-bold">
                                    _%
                                </div>
                            </div>
                            <div>
                                <ul style={{ listStyle: "disc" }}>
                                    <li className="mb-2">
                                        Emissions APR:{" "}
                                        <span className="text-pink-600">
                                            500%
                                        </span>
                                    </li>
                                    <li>
                                        Trading APR:{" "}
                                        <span className="text-pink-600">
                                            12%
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <div className="mb-2">Your Capacity</div>
                                <div style={{ color: "#00FF75" }}>
                                    {capacityPercent}%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-row gap-8">
                <Checkbox
                    className="w-2/3"
                    checked={isAgree}
                    onChange={setAgree}
                    text={
                        <span>
                            I verify that I have read the{" "}
                            <b>
                                <u>AshSwap Pools Guide</u>
                            </b>{" "}
                            and understand the risks of providing liquidity,
                            including impermanent loss.
                        </span>
                    }
                />
                <div className="w-1/3">
                    <Button
                        topLeftCorner
                        style={{ height: 48 }}
                        className="mt-1.5"
                        outline
                        disable={!isAgree}
                        onClick={isAgree ? addLP : () => {}}
                    >
                        DEPOSIT
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default AddLiquidityModal;
