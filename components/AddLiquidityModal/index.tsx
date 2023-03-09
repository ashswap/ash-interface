import ICChevronRight from "assets/svg/chevron-right.svg";
import { addLPSessionIdAtom } from "atoms/addLiquidity";
import {
    accIsInsufficientEGLDState,
    accIsLoggedInState,
} from "atoms/dappState";
import {
    ashRawPoolV1ByAddressQuery,
    poolV1FeesQuery,
    PoolsState,
    ashRawPoolV2ByAddressQuery,
} from "atoms/poolsState";
import { tokenMapState } from "atoms/tokensState";
import BigNumber from "bignumber.js";
import Avatar from "components/Avatar";
import BaseModal from "components/BaseModal";
import GlowingButton from "components/GlowingButton";
import InputCurrency from "components/InputCurrency";
import Switch from "components/Switch";
import TextAmt from "components/TextAmt";
import OnboardTooltip from "components/Tooltip/OnboardTooltip";
import { POOLS_MAP_ADDRESS } from "const/pool";
import { MINIMUM_EGLD_AMT } from "const/wrappedEGLD";
import { toEGLDD, toWei } from "helper/balance";
import { ContractManager } from "helper/contracts/contractManager";
import { Fraction } from "helper/fraction/fraction";
import { calculateEstimatedMintAmount } from "helper/stableswap/calculator/amounts";
import { getTokenFromId } from "helper/token";
import { IESDTInfo } from "helper/token/token";
import { TokenAmount } from "helper/token/tokenAmount";
import { useOnboarding } from "hooks/useOnboarding";
import usePoolAddLP from "hooks/usePoolContract/usePoolAddLP";
import { useScreenSize } from "hooks/useScreenSize";
import produce from "immer";
import { EPoolType } from "interface/pool";
import { Unarray } from "interface/utilities";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from "recoil";
import { theme } from "tailwind.config";
import { useDebounce } from "use-debounce";

interface Props {
    open?: boolean;
    onClose?: () => void;
    poolData: Unarray<PoolsState["poolToDisplay"]>;
}
interface TokenInputProps {
    token: IESDTInfo;
    value: string;
    isInsufficentFund: boolean;
    onChangeValue: (val: string, number: BigNumber) => void;
    balance: string;
    tokenInPool: BigNumber;
}
const TokenInput = ({
    token,
    value,
    isInsufficentFund,
    onChangeValue: _onChangeValue,
    balance,
    tokenInPool,
}: TokenInputProps) => {
    const onChangeValue = useCallback(
        (val: string) => {
            const num = new BigNumber(val);
            _onChangeValue(val, num.isNaN() ? new BigNumber(0) : num);
        },
        [_onChangeValue]
    );
    const [deboundValue] = useDebounce(value, 500);
    useEffect(() => {
        if (window && deboundValue) {
            let dataLayer = (window as any).dataLayer || [];
            dataLayer.push({
                event: "input_liquidity_value",
                amount: deboundValue,
                token: token.identifier,
            });
        }
    }, [deboundValue, token]);
    return (
        <>
            <div className="bg-ash-dark-700 sm:bg-transparent flex space-x-1 items-center sm:items-stretch">
                <div
                    className={`flex items-center w-24 sm:w-1/3 px-4 sm:px-0 border-r border-r-ash-gray-500 sm:border-r-0`}
                >
                    <Avatar
                        src={token.logoURI}
                        alt="token icon"
                        className="w-5 h-5 mr-2 shrink-0"
                    />
                    <div className="hidden sm:block overflow-hidden">
                        <div className="text-sm font-bold text-white sm:pb-1">
                            {token.symbol}
                        </div>
                        <div className="text-text-input-3 text-xs truncate leading-tight">
                            <TextAmt number={tokenInPool} />
                            &nbsp; in pool
                        </div>
                    </div>
                    <div className="block sm:hidden text-xs font-bold text-white">
                        {token.symbol}
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
                    decimals={token.decimals}
                    onChange={(e) => onChangeValue(e.target.value)}
                />
            </div>
            <div
                className="flex flex-row justify-between py-2 text-text-input-3 text-right"
                style={{ fontSize: 10 }}
            >
                <div style={{ marginLeft: "33.333%" }}>
                    {isInsufficentFund && (
                        <span>
                            Insufficient fund -{" "}
                            <Link href="/swap">
                                <span className="text-insufficent-fund select-none cursor-pointer">
                                    Swap for more tokens!
                                </span>
                            </Link>
                        </span>
                    )}
                </div>
                <div>
                    <span>Balance: </span>
                    <span
                        className="text-earn select-none cursor-pointer"
                        onClick={() => {
                            onChangeValue(
                                token.identifier === "EGLD"
                                    ? BigNumber.max(
                                          new BigNumber(balance).minus(
                                              MINIMUM_EGLD_AMT.div(10 ** 18)
                                          ),
                                          0
                                      ).toString()
                                    : balance.toString()
                            );
                        }}
                    >
                        <TextAmt
                            number={balance}
                            options={{ notation: "standard" }}
                        />
                        &nbsp;
                        {token.symbol}
                    </span>
                </div>
            </div>
        </>
    );
};
const AddLiquidityContent = ({ onClose, poolData }: Props) => {
    const [inputRawValues, setInputRawValues] = useState(
        poolData.pool.tokens.map(() => "")
    );
    const [inputWeiValues, setInputWeiValues] = useState(
        poolData.pool.tokens.map(() => new BigNumber(0))
    );
    const [isBalanced, setIsBalanced] = useState(true);
    const [isProMode, setIsProMode] = useState(false);
    const [adding, setAdding] = useState(false);
    const { addLiquidity: addPoolLP } = usePoolAddLP();
    // recoil
    const tokenMap = useRecoilValue(tokenMapState);
    const loggedIn = useRecoilValue(accIsLoggedInState);
    const isInsufficientEGLD = useRecoilValue(accIsInsufficientEGLDState);
    const setAddLPSessionId = useSetRecoilState(addLPSessionIdAtom);
    // end recoil
    const { pool, liquidityData } = poolData;
    const [onboardingDepositInput, setOnboardedDepositInput] =
        useOnboarding("pool_deposit_input");

    const screenSize = useScreenSize();

    const addLP = useRecoilCallback(
        ({ snapshot }) =>
            async () => {
                let mintAmt = new BigNumber(0);
                if (pool.type === EPoolType.PoolV2) {
                    const rawPoolV2 = await snapshot.getPromise(
                        ashRawPoolV2ByAddressQuery(pool.address)
                    );
                    const amts = pool.tokens.map((t, i) => {
                        return inputWeiValues[i];
                    });
                    mintAmt = rawPoolV2?.reserves
                        .reduce((sum, r) => sum.plus(r), new BigNumber(0))
                        .gt(0)
                        ? await ContractManager.getPoolV2Contract(
                              pool.address
                          ).estimateAddLiquidity(amts)
                        : new BigNumber(0);
                } else {
                    const poolData = await snapshot.getPromise(
                        ashRawPoolV1ByAddressQuery(pool.address)
                    );
                    const poolFee = await snapshot.getPromise(
                        poolV1FeesQuery(pool.address)
                    );
                    if (!loggedIn || !poolData) return;
                    const { ampFactor, reserves, totalSupply } = poolData;
                    if (!ampFactor || !reserves || !totalSupply) return;

                    const { mintAmount } = calculateEstimatedMintAmount(
                        new BigNumber(ampFactor),
                        pool.tokens.map(
                            (t, i) => new TokenAmount(t, reserves[i])
                        ),
                        poolFee.swap,
                        new TokenAmount(pool.lpToken, totalSupply),
                        pool.tokens.map((t, i) => inputWeiValues[i])
                    );
                    mintAmt = mintAmount.raw;
                }
                try {
                    setAdding(true);
                    const { sessionId } = await addPoolLP(
                        pool,
                        pool.tokens.map((_t, i) => {
                            const t = getTokenFromId(_t.identifier);
                            return new TokenAmount(t, inputWeiValues[i]);
                        }),
                        mintAmt
                            .multipliedBy(0.99) // expected receive at least 99% of estimation LP
                            .integerValue(BigNumber.ROUND_DOWN)
                    );
                    setAddLPSessionId(sessionId || "");
                    if (sessionId) onClose?.();
                } catch (error) {
                    console.error(error);
                } finally {
                    setAdding(false);
                }
            },
        [
            inputWeiValues,
            pool,
            onClose,
            loggedIn,
            addPoolLP,
            setAddLPSessionId,
        ]
    );

    const onChangeInputValue = useRecoilCallback(
        ({ snapshot }) =>
            async (val: string, num: BigNumber, i: number) => {
                const p = POOLS_MAP_ADDRESS[pool.address];
                const inputWei = toWei(p.tokens[i], num.toString());
                if (isBalanced) {
                    let inputValues: BigNumber[] = [];
                    if (p.type === EPoolType.PoolV2) {
                        const poolV2 = await snapshot.getPromise(
                            ashRawPoolV2ByAddressQuery(pool.address)
                        );
                        if (!poolV2) return;
                        const priceScales = [
                            new BigNumber(1e18),
                            new BigNumber(poolV2.priceScale),
                        ];
                        const precisions = p.tokens.map((t) =>
                            new BigNumber(10).pow(18 - t.decimals)
                        );
                        const target = inputWei
                            .multipliedBy(priceScales[i])
                            .multipliedBy(precisions[i]);
                        // .idiv(1e18);
                        inputValues = priceScales.map((scale, j) => {
                            return (
                                target
                                    // .multipliedBy(1e18)
                                    .idiv(precisions[j].multipliedBy(scale))
                            );
                        });

                        const inputValuesX = p.tokens.map((t, j) => {
                            return inputWei
                                .multipliedBy(poolV2.reserves[j])
                                .idiv(poolV2.reserves[i]);
                        });
                    } else if (p.type === EPoolType.PlainPool) {
                        const poolV1 = await snapshot.getPromise(
                            ashRawPoolV1ByAddressQuery(pool.address)
                        );
                        if (!poolV1) return;
                        inputValues = p.tokens.map((t, j) => {
                            return inputWei
                                .multipliedBy(poolV1.reserves[j])
                                .idiv(poolV1.reserves[i]);
                        });
                    }
                    setInputWeiValues(inputValues);
                    setInputRawValues(
                        inputValues.map((input, j) =>
                            j === i
                                ? val
                                : new TokenAmount(
                                      p.tokens[j],
                                      input
                                  ).egld.toString(10)
                        )
                    );
                } else {
                    setInputRawValues((state) =>
                        produce(state, (draft) => {
                            draft[i] = val;
                        })
                    );
                    setInputWeiValues((state) => {
                        return produce(state, (draft) => {
                            draft[i] = inputWei;
                        });
                    });
                }
            },
        [pool.address, isBalanced]
    );

    const onChangeIsBalanced = useCallback(
        (val: boolean) => {
            const p = POOLS_MAP_ADDRESS[pool.address];
            setInputRawValues(p.tokens.map((t) => ""));
            setInputWeiValues(p.tokens.map((t) => new BigNumber(0)));
            setIsBalanced(val);
        },
        [pool.address]
    );

    const tokenInputProps = useMemo(() => {
        return pool.tokens.map((_t, i) => {
            const t = getTokenFromId(_t.identifier);
            const userInput = new TokenAmount(t, inputWeiValues[i]);
            const tokenAmt = new TokenAmount(
                t,
                tokenMap[t.identifier]?.balance || 0
            );
            const isInsufficientFund = userInput.greaterThan(tokenAmt);
            return {
                tokenAmt,
                isInsufficientFund,
                token: t,
            };
        });
    }, [pool, tokenMap, inputWeiValues]);

    const liquidityValue = useMemo(() => {
        return pool.tokens.reduce(
            (total, t, i) =>
                total.plus(
                    toEGLDD(t.decimals, inputWeiValues[i]).multipliedBy(
                        tokenMap[t.identifier]?.price || 0
                    )
                ),
            new BigNumber(0)
        );
    }, [pool, tokenMap, inputWeiValues]);

    const canAddLP = useMemo(() => {
        return (
            !isInsufficientEGLD &&
            tokenInputProps.every((t) => !t.isInsufficientFund) &&
            !adding &&
            !inputWeiValues
                .reduce((total, val) => total.plus(val || 0), new BigNumber(0))
                .eq(0)
        );
    }, [isInsufficientEGLD, adding, inputWeiValues, tokenInputProps]);

    useEffect(() => {
        if (liquidityValue.gt(0)) {
            setOnboardedDepositInput(true);
        }
    }, [liquidityValue, setOnboardedDepositInput]);

    return (
        <div className="px-8 pb-16 sm:pb-7 grow overflow-auto">
            <div className="mb-7 inline-flex justify-between items-center">
                <div className="mr-2">
                    {/* <div className="text-text-input-3 text-xs">Deposit</div> */}
                    <div className="text-lg sm:text-2xl font-bold">
                        {pool.tokens.map((_t, i) => {
                            const t = getTokenFromId(_t.identifier);
                            return (
                                <span key={t.identifier}>
                                    <span>{t.symbol}</span>
                                    {i !== pool.tokens.length - 1 && (
                                        <span className="text-sm">
                                            &nbsp;&&nbsp;
                                        </span>
                                    )}
                                </span>
                            );
                        })}
                    </div>
                </div>
                <div className="flex flex-row justify-between items-center">
                    {pool.tokens.map((_t, i) => {
                        const t = getTokenFromId(_t.identifier);
                        return (
                            <Avatar
                                key={t.identifier}
                                src={t.logoURI}
                                alt={t.symbol}
                                className={`w-6 h-6 sm:w-9 sm:h-9 ${
                                    i > 0 && "-ml-2"
                                }`}
                            />
                        );
                    })}
                </div>
            </div>
            <div className="px-6 py-7 bg-ash-dark-600 flex flex-col sm:flex-row sm:items-center">
                <div className="sm:w-1/2 mb-4 sm:mb-0">
                    <Switch
                        checked={isBalanced}
                        onChange={onChangeIsBalanced}
                        className="inline-flex items-center mb-7"
                    >
                        <span className="ml-2 font-bold text-sm text-stake-gray-500 underline">
                            Balanced Deposit
                        </span>
                    </Switch>
                    <div className="font-bold text-xs text-white">
                        We recommend that you make a balanced deposit if you
                        can.
                    </div>
                </div>
                <div className="hidden sm:block mx-9 border-l border-ash-gray-600 self-stretch"></div>
                <div className="sm:w-1/2 font-medium text-2xs text-stake-gray-500">
                    <div className="mb-4">
                        i.e. Depositing with balanced proportions incurs the
                        least fees.
                    </div>
                    <div>
                        But if you need to swap to have the correct amounts, it
                        is better to deposit in unbalanced/single-sided ways.
                    </div>
                </div>
            </div>
            <div className="my-10">
                <div className="relative">
                    <OnboardTooltip
                        open={onboardingDepositInput && screenSize.md}
                        placement="left"
                        onArrowClick={() => setOnboardedDepositInput(true)}
                        content={({ size }) => (
                            <OnboardTooltip.Panel size={size} className="w-36">
                                <div className="p-3 text-xs font-bold">
                                    <span className="text-stake-green-500">
                                        Input value{" "}
                                    </span>
                                    <span>that you want to deposit</span>
                                </div>
                            </OnboardTooltip.Panel>
                        )}
                    >
                        <div className="mb-8">
                            {tokenInputProps.map((p, i) => {
                                return (
                                    <div
                                        key={p.token.identifier}
                                        className="py-1.5"
                                    >
                                        <TokenInput
                                            token={p.token}
                                            tokenInPool={toEGLDD(
                                                pool.tokens[i].decimals,
                                                liquidityData?.lpReserves[i] ||
                                                    0
                                            )}
                                            value={inputRawValues[i]}
                                            onChangeValue={(val, num) =>
                                                onChangeInputValue(val, num, i)
                                            }
                                            isInsufficentFund={
                                                p.isInsufficientFund
                                            }
                                            balance={p.tokenAmt.egld.toString(
                                                10
                                            )}
                                        />
                                        {i !== tokenInputProps.length - 1 && (
                                            <div>&</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </OnboardTooltip>

                    <div className="flex items-center space-x-1 bg-ash-dark-700 sm:bg-transparent mb-11 sm:mb-0">
                        <div className="flex items-center font-bold w-24 sm:w-1/3 px-4 sm:px-0 border-r border-r-ash-gray-500 sm:border-r-0">
                            <ICChevronRight className="mr-4 text-pink-600" />
                            <span>TOTAL</span>
                        </div>
                        <div className="flex-1 overflow-hidden bg-ash-dark-700 text-right text-lg h-[4.5rem] px-5 outline-none flex items-center justify-end">
                            <span>
                                <span className="text-ash-gray-500">$ </span>
                                <TextAmt
                                    number={liquidityValue}
                                    options={{ notation: "standard" }}
                                    decimalClassName="text-stake-gray-500"
                                />
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="sm:flex gap-8">
                <div className="w-full mb-12 sm:mb-0 sm:w-2/3">
                    <span className="text-xs text-ash-gray-500">
                        Make sure you have read the{" "}
                        <a
                            href="https://docs.ashswap.io/guides/add-remove-liquidity"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <b className="text-white">
                                <u>AshSwap Pools Guide</u>
                            </b>
                        </a>{" "}
                        and understood the associated risks.
                    </span>
                </div>
                <div className="w-full sm:w-1/3">
                    <div className="border-notch-x border-notch-white/50">
                        <GlowingButton
                            theme="pink"
                            className="w-full h-12 uppercase font-bold clip-corner-1 clip-corner-tl"
                            wrapperClassName="hover:colored-drop-shadow-xs"
                            disabled={!canAddLP}
                            onClick={canAddLP ? addLP : () => {}}
                        >
                            {isInsufficientEGLD
                                ? "INSUFFICIENT EGLD BALANCE"
                                : "DEPOSIT"}
                        </GlowingButton>
                    </div>
                </div>
            </div>
        </div>
    );
};
const AddLiquidityModal = (props: Props) => {
    const { open, onClose, poolData } = props;
    const screenSize = useScreenSize();
    return (
        <BaseModal
            isOpen={!!open}
            onRequestClose={() => onClose && onClose()}
            type={screenSize.msm ? "drawer_btt" : "modal"}
            className={`clip-corner-4 clip-corner-tl bg-ash-dark-400 text-white p-4 flex flex-col max-h-full max-w-4xl mx-auto`}
        >
            <div className="flex justify-end mb-6">
                <BaseModal.CloseBtn />
            </div>
            <div className="grow overflow-auto">
                <AddLiquidityContent {...props} />
            </div>
        </BaseModal>
    );
};

export default AddLiquidityModal;
