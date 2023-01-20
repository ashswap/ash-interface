import ICChevronRight from "assets/svg/chevron-right.svg";
import { addLPSessionIdAtom } from "atoms/addLiquidity";
import {
    accIsInsufficientEGLDState,
    accIsLoggedInState,
} from "atoms/dappState";
import {
    ashRawPoolByAddressQuery,
    poolFeesQuery,
    PoolsState,
} from "atoms/poolsState";
import { tokenMapState } from "atoms/tokensState";
import BigNumber from "bignumber.js";
import Avatar from "components/Avatar";
import BaseModal from "components/BaseModal";
import GlowingButton from "components/GlowingButton";
import InputCurrency from "components/InputCurrency";
import TextAmt from "components/TextAmt";
import OnboardTooltip from "components/Tooltip/OnboardTooltip";
import { toEGLDD, toWei } from "helper/balance";
import { Fraction } from "helper/fraction/fraction";
import { calculateEstimatedMintAmount } from "helper/stableswap/calculator/amounts";
import { IESDTInfo } from "helper/token/token";
import { TokenAmount } from "helper/token/tokenAmount";
import { useOnboarding } from "hooks/useOnboarding";
import usePoolAddLP from "hooks/usePoolContract/usePoolAddLP";
import { useScreenSize } from "hooks/useScreenSize";
import produce from "immer";
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
        if (window && value) {
            let dataLayer = (window as any).dataLayer || [];
            dataLayer.push({
                event: "input_liquidity_value",
                amount: value,
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
                            <Link href="/swap" passHref>
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
                        onClick={() => onChangeValue(balance)}
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
    const [inputValues, setInputValues] = useState(
        poolData.pool.tokens.map(() => new BigNumber(0))
    );
    const [isProMode, setIsProMode] = useState(false);
    const [adding, setAdding] = useState(false);
    const addPoolLP = usePoolAddLP();
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
                const poolData = await snapshot.getPromise(
                    ashRawPoolByAddressQuery(pool.address)
                );
                const poolFee = await snapshot.getPromise(
                    poolFeesQuery(pool.address)
                );
                if (!loggedIn || adding || !poolData) return;
                const { ampFactor, reserves, totalSupply } = poolData;
                if (!ampFactor || !reserves || !totalSupply) return;
                setAdding(true);

                try {
                    const { mintAmount } = calculateEstimatedMintAmount(
                        new BigNumber(ampFactor),
                        pool.tokens.map(
                            (t, i) => new TokenAmount(t, reserves[i])
                        ),
                        poolFee.swap,
                        new TokenAmount(pool.lpToken, totalSupply),
                        pool.tokens.map((t, i) =>
                            toWei(t, inputValues[i].toString() || "0")
                        )
                    );
                    const { sessionId } = await addPoolLP(
                        pool,
                        pool.tokens.map((t, i) =>
                            toWei(t, inputValues[i].toString() || "0")
                        ),
                        mintAmount.raw
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
            inputValues,
            pool,
            onClose,
            adding,
            loggedIn,
            addPoolLP,
            setAddLPSessionId,
        ]
    );
    const tokenInputProps = useMemo(() => {
        return pool.tokens.map((t, i) => {
            const userInput = Fraction.fromBigNumber(inputValues[i] || 0);
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
    }, [pool, tokenMap, inputValues]);

    const liquidityValue = useMemo(() => {
        return pool.tokens.reduce(
            (total, t, i) =>
                total.plus(
                    new BigNumber(inputValues[i] || 0).multipliedBy(
                        tokenMap[t.identifier]?.price || 0
                    )
                ),
            new BigNumber(0)
        );
    }, [pool, tokenMap, inputValues]);

    const canAddLP = useMemo(() => {
        return (
            !isInsufficientEGLD &&
            tokenInputProps.every((t) => !t.isInsufficientFund) &&
            !adding &&
            !inputValues
                .reduce((total, val) => total.plus(val || 0), new BigNumber(0))
                .eq(0)
        );
    }, [isInsufficientEGLD, adding, inputValues, tokenInputProps]);

    useEffect(() => {
        if (liquidityValue.gt(0)) {
            setOnboardedDepositInput(true);
        }
    }, [liquidityValue, setOnboardedDepositInput]);

    return (
        <div className="px-8 pb-16 sm:pb-7 grow overflow-auto">
            <div className="inline-flex justify-between items-center">
                <div className="mr-2">
                    {/* <div className="text-text-input-3 text-xs">Deposit</div> */}
                    <div className="text-lg sm:text-2xl font-bold">
                        {pool.tokens.map((t, i) => {
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
                    {pool.tokens.map((t, i) => {
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
                                            onChangeValue={(val, num) => {
                                                setInputRawValues((state) =>
                                                    produce(state, (draft) => {
                                                        draft[i] = val;
                                                    })
                                                );
                                                setInputValues((state) =>
                                                    produce(state, (draft) => {
                                                        draft[i] = num;
                                                    })
                                                );
                                            }}
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
                        and understand the associated risks.
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
            className={`clip-corner-4 clip-corner-tl bg-ash-dark-600 text-white p-4 flex flex-col max-h-full max-w-4xl mx-auto`}
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
