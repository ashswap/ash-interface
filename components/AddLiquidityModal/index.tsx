import {
    Address,
    AddressValue,
    ArgSerializer,
    BigUIntValue,
    ContractFunction,
    EndpointParameterDefinition,
    GasLimit,
    Query,
    TokenIdentifierValue,
    TypeExpressionParser,
    TypeMapper,
} from "@elrondnetwork/erdjs";
import { notification } from "antd";
import IconNewTab from "assets/svg/new-tab-green.svg";
import IconRight from "assets/svg/right-white.svg";
import BigNumber from "bignumber.js";
import Button from "components/Button";
import Checkbox from "components/Checkbox";
import HeadlessModal, {
    HeadlessModalDefaultHeader,
} from "components/HeadlessModal";
import InputCurrency from "components/InputCurrency";
import { usePool } from "components/ListPoolItem";
import Switch from "components/Switch";
import { gasLimit, network } from "const/network";
import { useDappContext } from "context/dapp";
import { useWallet } from "context/wallet";
import { toEGLD, toWei } from "helper/balance";
import { useScreenSize } from "hooks/useScreenSize";
import IPool from "interface/pool";
import { IToken } from "interface/token";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { theme } from "tailwind.config";
import { useDebounce } from "use-debounce";

interface Props {
    open?: boolean;
    onClose?: () => void;
    pool: IPool;
}
interface TokenInputProps {
    token: IToken;
    value: string;
    isInsufficentFund: boolean;
    onChangeValue: (val: string) => void;
    balance: string;
    tokenInPool: string;
}
const TokenInput = ({
    token,
    value,
    isInsufficentFund,
    onChangeValue,
    balance,
    tokenInPool,
}: TokenInputProps) => {
    return (
        <>
            <div className="bg-ash-dark-700 sm:bg-transparent flex space-x-1 items-center sm:items-stretch">
                <div
                    className={`flex items-center w-24 sm:w-1/3 px-4 sm:px-0 border-r border-r-ash-gray-500 sm:border-r-0`}
                >
                    <div className="w-5 h-5 rounded-full mr-2 flex-shrink-0">
                        <Image src={token.icon} alt="token icon" />
                    </div>
                    <div className="hidden sm:block overflow-hidden">
                        <div className="text-sm font-bold text-white sm:pb-1">
                            {token.name}
                        </div>
                        <div className="text-text-input-3 text-xs truncate leading-tight">
                            {tokenInPool}&nbsp; in pool
                        </div>
                    </div>
                    <div className="block sm:hidden text-xs font-bold text-white">
                        {token.name}
                    </div>
                </div>

                <InputCurrency
                    className="flex-1 overflow-hidden bg-ash-dark-700 text-white text-right text-lg outline-none px-5 h-12"
                    placeholder="0"
                    value={value}
                    style={{
                        border: isInsufficentFund
                            ? `1px solid ${theme.extend.colors["insufficent-fund"]}`
                            : "",
                    }}
                    onChange={(e) => onChangeValue(e.target.value)}
                />
            </div>
            <div
                className="flex flex-row justify-between py-2 text-text-input-3 text-right"
                style={{ fontSize: 10 }}
            >
                <div style={{ marginLeft: "33.333%" }}>
                    {isInsufficentFund ? (
                        <>
                            Insufficient fund -{" "}
                            <Link href="/swap" passHref>
                                <span className="text-insufficent-fund select-none cursor-pointer">
                                    Go trade!
                                </span>
                            </Link>
                        </>
                    ) : null}
                </div>
                <div>
                    <span>Balance: </span>
                    <span
                        className="text-earn select-none cursor-pointer"
                        onClick={() => onChangeValue(balance)}
                    >
                        {balance} {token.name}
                    </span>
                </div>
            </div>
        </>
    );
};

const AddLiquidityModal = ({ open, onClose, pool }: Props) => {
    const [isAgree, setAgree] = useState<boolean>(false);
    const [value0, setValue0] = useState<string>("");
    const [value0Debounce] = useDebounce(value0, 500);
    const [value1, setValue1] = useState<string>("");
    const [value1Debounce] = useDebounce(value1, 500);
    const [isProMode, setIsProMode] = useState(false);
    const screenSize = useScreenSize();
    const { callContract, fetchBalances, balances, tokenPrices } = useWallet();
    const dapp = useDappContext();
    // const provider = dapp.dapp.provider;
    const [rates, setRates] = useState<BigNumber[] | undefined>(undefined);
    const [liquidity, setLiquidity] = useState<string>("");
    const poolContext = usePool();

    // reset when open modal
    useEffect(() => {
        if (open) {
            setAgree(false);
            setValue0("");
            setValue1("");
            setLiquidity("");
        }
    }, [open]);

    const addLP = useCallback(async () => {
        if (!dapp.loggedIn) return;
        try {
            let tx = await callContract(new Address(dapp.address), {
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
                ],
            });

            fetchBalances();

            let key = `open${Date.now()}`;
            notification.open({
                key,
                message: `Add liquidity Success ${value0} ${pool.tokens[0].name} and ${value1} ${pool.tokens[1].name}`,
                icon: <IconNewTab />,
                onClick: () =>
                    window.open(
                        network.explorerAddress +
                            "/transactions/" +
                            tx.toString(),
                        "_blank"
                    ),
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
    }, [dapp, value0, value1, pool, onClose, callContract, fetchBalances]);

    // find pools + fetch reserves
    useEffect(() => {
        let isMounted = true;

        if (!pool || !dapp.dapp.proxy) {
            return;
        }

        Promise.all([
            dapp.dapp.proxy.queryContract(
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
                        ),
                    ],
                })
            ),
            dapp.dapp.proxy.queryContract(
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
                        ),
                    ],
                })
            ),
        ]).then((results) => {
            let rates = results.slice(0, 2).map((result) => {
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
                    new EndpointParameterDefinition("foo", "bar", mappedType),
                ];
                let values = serializer.stringToValues(
                    resultHex,
                    endpointDefinitions
                );

                return values[0].valueOf().field0;
            });

            if (isMounted) {
                setRates(rates);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [pool, dapp.dapp.proxy, setRates]);

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

    const isInsufficentFund0 = useMemo(() => {
        if (value0 === "" || balance0 === "") {
            return false;
        }

        const v0 = new BigNumber(value0);
        const b0 = new BigNumber(balance0);

        return v0.gt(b0);
    }, [value0, balance0]);

    const isInsufficentFund1 = useMemo(() => {
        if (value1 === "" || balance1 === "") {
            return false;
        }

        const v1 = new BigNumber(value1);
        const b1 = new BigNumber(balance1);

        return v1.gt(b1);
    }, [value1, balance1]);

    // useEffect(() => {
    //     if (value0Debounce === "" || value1Debounce === "") {
    //         return;
    //     }

    //     proxy
    //         .queryContract(
    //             new Query({
    //                 address: new Address(pool.address),
    //                 func: new ContractFunction("getAddLiquidityTokens"),
    //                 args: [
    //                     new BigUIntValue(
    //                         new BigNumber(toWei(pool.tokens[0], value0Debounce))
    //                     ),
    //                     new BigUIntValue(
    //                         new BigNumber(toWei(pool.tokens[1], value1Debounce))
    //                     )
    //                 ]
    //             })
    //         )
    //         .then(({ returnData }) => {

    //             let liquidity = new BigNumber(
    //                 "0x" + Buffer.from(returnData[0], "base64").toString("hex")
    //             );

    //             setLiquidity(
    //                 toEGLD(pool.lpToken, liquidity.toString()).toFixed(3)
    //             );
    //         });
    // }, [value0Debounce, value1Debounce, pool, proxy]);

    useEffect(() => {
        if (!value0Debounce || !value1Debounce) {
            return;
        }

        let token0 = pool.tokens[0];
        let token1 = pool.tokens[1];

        let balance0 = new BigNumber(value0Debounce);
        let balance1 = new BigNumber(value1Debounce);

        const valueUsd0 = balance0.multipliedBy(tokenPrices[token0.id]);
        const valueUsd1 = balance1.multipliedBy(tokenPrices[token1.id]);

        setLiquidity(valueUsd0.plus(valueUsd1).toFixed(3));
    }, [
        pool,
        tokenPrices,
        poolContext.tokenBalances,
        value0Debounce,
        value1Debounce,
    ]);

    return (
        <HeadlessModal
            open={!!open}
            onClose={() => onClose && onClose()}
            transition={screenSize.sm ? "btt" : "center"}
        >
            <div
                className={`clip-corner-4 clip-corner-tl bg-ash-dark-600 text-white p-4 fixed bottom-0 inset-x-0 sm:static sm:mt-28 sm:ash-container flex flex-col max-h-full ${
                    isProMode ? "" : "max-w-[51.75rem] mx-auto"
                }`}
            >
                <HeadlessModalDefaultHeader
                    onClose={() => onClose && onClose()}
                />
                <div className="px-8 mt-6 pb-16 sm:pb-7 flex-grow overflow-auto">
                    <div className="mb-14">
                        <Switch
                            checked={isProMode}
                            onChange={setIsProMode}
                            className="flex items-center space-x-2"
                        >
                            <span className={`${isProMode && "text-pink-600"}`}>
                                Pro-mode
                            </span>
                        </Switch>
                    </div>

                    <div className="inline-flex justify-between items-center">
                        <div className="mr-2">
                            {/* <div className="text-text-input-3 text-xs">Deposit</div> */}
                            <div className="flex flex-row items-baseline text-lg sm:text-2xl font-bold">
                                <span>{pool.tokens[0].name}</span>
                                <span className="text-sm px-3">&</span>
                                <span>{pool.tokens[1].name}</span>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <div className="w-6 h-6 sm:w-9 sm:h-9 rounded-full">
                                <Image
                                    src={pool.tokens[0].icon}
                                    width={52}
                                    height={52}
                                    alt="token icon"
                                />
                            </div>
                            <div className="w-6 h-6 sm:w-9 sm:h-9 rounded-full -ml-1 sm:ml-[-0.375rem]">
                                <Image
                                    src={pool.tokens[1].icon}
                                    width={52}
                                    height={52}
                                    alt="token icon"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="sm:flex my-10 sm:space-x-4 lg:space-x-8">
                        <div className="relative sm:w-6/12 lg:w-7/12 overflow-hidden">
                            <div className="py-1.5">
                                <TokenInput
                                    token={pool.tokens[0]}
                                    tokenInPool={toEGLD(
                                        pool.tokens[0],
                                        poolContext.value0.toString()
                                    ).toFixed(2)}
                                    value={value0}
                                    onChangeValue={(val) => onChangeValue0(val)}
                                    isInsufficentFund={isInsufficentFund0}
                                    balance={balance0}
                                />
                            </div>
                            <div className="py-1.5">
                                <TokenInput
                                    token={pool.tokens[1]}
                                    tokenInPool={toEGLD(
                                        pool.tokens[1],
                                        poolContext.value1.toString()
                                    ).toFixed(2)}
                                    value={value1}
                                    onChangeValue={(val) => onChangeValue1(val)}
                                    isInsufficentFund={isInsufficentFund1}
                                    balance={balance1}
                                />
                            </div>

                            <div className="flex items-center space-x-1 bg-ash-dark-700 sm:bg-transparent mb-11 sm:mb-0">
                                <div className="flex items-center font-bold w-24 sm:w-1/3 px-4 sm:px-0 border-r border-r-ash-gray-500 sm:border-r-0">
                                    <IconRight className="mr-4" />
                                    <span>TOTAL</span>
                                </div>
                                <InputCurrency
                                    className="flex-1 overflow-hidden bg-ash-dark-700 text-right text-lg h-[4.5rem] px-5 outline-none"
                                    placeholder="0"
                                    value={liquidity}
                                    disabled
                                />
                            </div>

                            <div
                                className="absolute left-0 ml-2"
                                style={{ top: 62 }}
                            >
                                &
                            </div>
                        </div>
                        <div className="sm:w-6/12 lg:w-5/12 bg-ash-dark-500 p-8 sm:p-4 lg:p-8 text-ash-gray-500 sm:text-white">
                            <div className="text-lg font-bold">
                                Estimate value
                            </div>
                            <div className="flex flex-col text-xs mt-8 gap-y-9">
                                <div
                                    className={`flex space-x-1 ${
                                        isProMode
                                            ? "sm:flex-wrap sm:space-x-0"
                                            : "sm:space-y-8 sm:block"
                                    }`}
                                >
                                    <div
                                        className={`w-6/12 ${
                                            isProMode && "sm:w-8/12"
                                        }`}
                                    >
                                        <div className="mb-2">
                                            Earn per month
                                        </div>
                                        <div>-</div>
                                    </div>
                                    <div
                                        className={`w-6/12 ${
                                            isProMode && "sm:w-4/12"
                                        }`}
                                    >
                                        <div className="mb-2">Farm per day</div>
                                        <div>-</div>
                                    </div>
                                </div>
                                {isProMode && (
                                    <div className="flex flex-col sm:flex-row gap-10 flex-wrap">
                                        <div className="flex gap-10">
                                            <div>
                                                <div className="mb-2">APR</div>
                                                <div className="text-pink-600 font-bold">
                                                    _%
                                                </div>
                                            </div>
                                            <div>
                                                <ul
                                                    style={{
                                                        listStyle: "disc",
                                                    }}
                                                >
                                                    <li className="mb-2">
                                                        Emissions APR:{" "}
                                                        <span className="text-pink-600">
                                                            _%
                                                        </span>
                                                    </li>
                                                    <li>
                                                        Trading APR:{" "}
                                                        <span className="text-pink-600">
                                                            _%
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="mb-2">
                                                Your Capacity
                                            </div>
                                            <div style={{ color: "#00FF75" }}>
                                                {poolContext.capacityPercent.toFixed(
                                                    2
                                                )}
                                                %
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="sm:flex gap-8">
                        <Checkbox
                            className="w-full mb-12 sm:mb-0 sm:w-2/3"
                            checked={isAgree}
                            onChange={setAgree}
                            text={
                                <span>
                                    I verify that I have read the{" "}
                                    <a
                                        href="https://docs.ashswap.io/guides/add-remove-liquidity"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <b className="text-white">
                                            <u>AshSwap Pools Guide</u>
                                        </b>
                                    </a>{" "}
                                    and understand the risks of providing
                                    liquidity, including impermanent loss.
                                </span>
                            }
                        />
                        <div className="w-full sm:w-1/3">
                            <Button
                                topLeftCorner
                                style={{ height: 48 }}
                                outline
                                disable={!isAgree}
                                onClick={isAgree ? addLP : () => {}}
                            >
                                DEPOSIT
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </HeadlessModal>
    );
};

export default AddLiquidityModal;
