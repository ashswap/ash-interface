import {
    Address,
    ContractFunction,
    GasLimit,
    TokenIdentifierValue,
    BigUIntValue,
    AddressValue
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
import { toWei } from "helper/balance";
import IPool from "interface/pool";
import IconRight from "assets/svg/right-white.svg";
import { useEffect, useState, useCallback } from "react";
import styles from "./AddLiquidity.module.css";
import { IToken } from "interface/token";
import { notification } from "antd";

interface Props {
    open?: boolean;
    onClose?: () => void;
    pool: IPool;
}

const AddLiquidityModal = ({open, onClose, pool}: Props) => {
    const [isAgree, setAgree] = useState<boolean>(false);
    const [value0, setValue0] = useState<string>("");
    const [value1, setValue1] = useState<string>("");
    const { provider, callContract, fetchBalances, balances } = useWallet();

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
                new BigUIntValue(toWei(pool.tokens[1], value1)),
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

    return (
        <Modal
            open={open}
            onClose={onClose}
            contentClassName={styles.content}
            dark="600"
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
                <div className="relative w-2/3">
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
                                onChange={e => setValue0(e.target.value)}
                            />
                        </div>
                        <div className="bg-bg py-2 text-sm text-text-input-3 text-right">
                            <span>Balance: </span>
                            <span className="text-earn">
                                {balances[pool.tokens[0].id]
                                    ? balances[pool.tokens[0].id].balance
                                          .div(
                                              new BigNumber(10).exponentiatedBy(
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
                                onChange={e => setValue1(e.target.value)}
                            />
                        </div>
                        <div className="bg-bg py-2 text-sm text-text-input-3 text-right">
                            <span>Balance: </span>
                            <span className="text-earn">
                                {balances[pool.tokens[1].id]
                                    ? balances[pool.tokens[1].id].balance
                                          .div(
                                              new BigNumber(10).exponentiatedBy(
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

                    <div className="absolute left-0 ml-2" style={{ top: 62 }}>
                        &
                    </div>
                </div>
                <div className="w-1/3 bg-ash-dark-500 p-8">
                    <div className="text-lg font-bold text-center">
                        Estimate Earning
                    </div>
                    <div className="flex flex-row flex-wrap text-xs my-8 gap-y-9">
                        <div className="w-1/2">
                            <div className="mb-4">APR</div>
                            <div>-</div>
                        </div>
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
