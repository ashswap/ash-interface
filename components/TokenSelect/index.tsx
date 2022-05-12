import IconClose from "assets/svg/close-1.svg";
import Down from "assets/svg/down.svg";
import Search from "assets/svg/search.svg";
import BigNumber from "bignumber.js";
import BaseModal from "components/BaseModal";
import Input from "components/Input";
import ListSwapPool from "components/ListSwapPool";
import ListToken from "components/ListToken";
import Token from "components/Token";
import OnboardTooltip from "components/Tooltip/OnboardTooltip";
import { useWallet } from "context/wallet";
import { useOnboarding } from "hooks/useOnboarding";
import { useScreenSize } from "hooks/useScreenSize";
import IPool from "interface/pool";
import { IToken } from "interface/token";
import { TokenBalance } from "interface/tokenBalance";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./TokenSelect.module.css";

interface Props {
    onChange?: (t: IToken) => void;
    value?: IToken;
    validPools?: IPool[];
    pivotToken?: IToken;
    modalTitle: string;
    type: "from" | "to";
    resetPivotToken: () => any;
}

const TokenSelect = ({
    value,
    validPools,
    onChange,
    modalTitle,
    pivotToken,
    type,
    resetPivotToken,
}: Props) => {
    const [open, setOpen] = useState<boolean>(false);
    const [filtedTokenBalances, setFiltedTokenBalances] = useState<
        TokenBalance[]
    >([]);
    const [filtedValidPools, setFiltedValidPools] = useState<IPool[]>([]);
    const [keyword, setKeyword] = useState<string>("");
    const { tokens, balances } = useWallet();
    const screenSize = useScreenSize();
    // user onboarding
    const [openOnboardSelectToken, setOnboardedSelectToken] =
        useOnboarding("swap_select_token");
    const [openOnboardSearchToken, setOnboardedSearchToken] =
        useOnboarding("swap_search_token");
    const [onboardingSelectTokenTo, setOnBoardedSelectTokenTo] = useOnboarding(
        "swap_pop_select_token_to"
    );
    const [onboardingAvailablePair, setOnboardedAvailablePair] = useOnboarding(
        "swap_view_available_pair"
    );
    // end user onboarding

    const tokenBalances = useMemo(() => {
        let tokenBalances: TokenBalance[] = [];

        for (const tokenId in tokens) {
            if (Object.prototype.hasOwnProperty.call(tokens, tokenId)) {
                const tokenBalance: TokenBalance = {
                    token: tokens[tokenId],
                    balance: balances[tokenId]?.balance || new BigNumber(0),
                };

                tokenBalances.push(tokenBalance);
            }
        }

        return tokenBalances;
    }, [tokens, balances]);

    const onChangeKeyword = useCallback(
        (keyword: string) => {
            setKeyword(keyword);
            setFiltedTokenBalances(
                tokenBalances.filter((t) =>
                    t.token.name.toLowerCase().includes(keyword.toLowerCase())
                )
            );

            if (validPools && pivotToken) {
                setFiltedValidPools(
                    validPools?.filter((p) =>
                        p.tokens
                            .filter((t) => t.id !== pivotToken?.id)[0]
                            .name.toLowerCase()
                            .includes(keyword.toLowerCase())
                    )
                );
            }
        },
        [tokenBalances, validPools, pivotToken]
    );

    const onSelectToken = (t: IToken) => {
        setOpen(false);

        if (onChange) {
            onChange(t);
        }
    };

    useEffect(() => {
        setFiltedTokenBalances(tokenBalances);
    }, [tokenBalances]);

    useEffect(() => {
        if (validPools) {
            setFiltedValidPools(validPools);
        }
    }, [validPools]);

    useEffect(() => {
        if (value) setOnboardedSearchToken(true);
    }, [value, setOnboardedSearchToken]);

    const renderPivotToken = () => {
        if (!pivotToken) {
            return null;
        }

        return (
            <>
                {type === "from" && <div className="mx-2">-</div>}
                <div
                    className="flex flex-row items-center justify-center gap-3.5 bg-bg h-12 rounded-lg"
                    style={{ padding: "18px 12px 18px 18px" }}
                >
                    <Token token={pivotToken} />
                    <IconClose
                        className="cursor-pointer"
                        onClick={resetPivotToken}
                    />
                </div>
                {type === "to" && <div className="mx-2">-</div>}
            </>
        );
    };

    return (
        <>
            <OnboardTooltip
                open={
                    type === "from" && screenSize.lg && openOnboardSelectToken
                }
                onArrowClick={() => setOnboardedSelectToken(true)}
                placement="left"
                zIndex={10}
                content={
                    <OnboardTooltip.Panel>
                        <div className="px-6 py-2.5 text-sm font-bold">
                            <span className="text-stake-green-500">
                                Select a token{" "}
                            </span>
                            <span>to swap</span>
                        </div>
                    </OnboardTooltip.Panel>
                }
            >
                <div
                    className={
                        `flex flex-row items-center justify-between text-sm font-bold w-44 cursor-pointer select-none p-4 rounded-xl text-pink-600 ` +
                        (value
                            ? "bg-ash-dark-600"
                            : `bg-bg-select hover:bg-bg-select-hover ${styles.containerHover}`)
                    }
                    onClick={() => {
                        setOpen(true);
                        setOnboardedSelectToken(true);
                    }}
                >
                    {value ? (
                        <Token token={value} />
                    ) : (
                        <div className="text-xs sm:text-sm">Select a token</div>
                    )}
                    <Down />
                </div>
            </OnboardTooltip>

            <BaseModal
                isOpen={open}
                onRequestClose={() => setOpen(false)}
                type={screenSize.msm ? "drawer_btt" : "modal"}
                className="clip-corner-4 clip-corner-tl bg-ash-dark-600 flex flex-col p-4 w-full sm:w-[27.375rem] mx-auto max-h-full"
            >
                <div className="flex justify-end">
                    <BaseModal.CloseBtn />
                </div>
                <div className="flex-shrink-0 px-6 pt-1 pb-6">
                    <div className="font-bold text-lg text-white">
                        {modalTitle}
                    </div>
                    <OnboardTooltip
                        open={
                            type === "to" &&
                            pivotToken &&
                            screenSize.lg &&
                            onboardingSelectTokenTo
                        }
                        placement="right"
                        onArrowClick={() => setOnBoardedSelectTokenTo(true)}
                        content={
                            <OnboardTooltip.Panel>
                                <div className="px-6 py-2.5 text-sm font-bold">
                                    <span className="text-stake-green-500">
                                        Select token{" "}
                                    </span>
                                    <span>that you want to swap to</span>
                                </div>
                            </OnboardTooltip.Panel>
                        }
                    >
                        <div>
                            <OnboardTooltip
                                open={
                                    type === "from" &&
                                    screenSize.lg &&
                                    openOnboardSearchToken
                                }
                                onArrowClick={() =>
                                    setOnboardedSearchToken(true)
                                }
                                placement="left"
                                content={
                                    <OnboardTooltip.Panel>
                                        <div className="px-6 py-2.5 text-sm font-bold">
                                            <span>Try </span>
                                            <span className="text-stake-green-500">
                                                usdt-usdc
                                            </span>
                                        </div>
                                    </OnboardTooltip.Panel>
                                }
                            >
                                <div className="flex flex-row items-center py-8 w-full overflow-hidden">
                                    {pivotToken &&
                                        type === "to" &&
                                        renderPivotToken()}

                                    <Input
                                        placeholder="Search or try usdt-usdc"
                                        suffix={<Search />}
                                        outline
                                        autoFocus
                                        value={keyword}
                                        onChange={(e) => {
                                            onChangeKeyword(e.target.value);
                                            if (type === "from") {
                                                setOnboardedSearchToken(true);
                                            } else {
                                                setOnBoardedSelectTokenTo(true);
                                            }
                                        }}
                                        textClassName="text-sm"
                                        className="w-full caret-pink-500 overflow-hidden h-12 px-5"
                                    />
                                    {pivotToken &&
                                        type === "from" &&
                                        renderPivotToken()}
                                </div>
                            </OnboardTooltip>
                        </div>
                    </OnboardTooltip>

                    {validPools && filtedValidPools.length === 0 && (
                        <>
                            <div className="text-insufficent-fund text-xs mb-14">
                                That doesn&apos;t look like a supported swap!
                            </div>
                        </>
                    )}
                    <div className="font-normal text-xs text-white">
                        {validPools ? "Supported pairs" : "Owned"}
                    </div>
                </div>

                <div className="flex-grow overflow-auto px-6 pb-7 min-h-[35vh] sm:min-h-[initial]">
                    {validPools ? (
                        <OnboardTooltip
                            open={
                                type === "to" &&
                                screenSize.lg &&
                                validPools &&
                                filtedValidPools.length === 0 &&
                                onboardingAvailablePair
                            }
                            placement="right"
                            onArrowClick={() => setOnboardedAvailablePair(true)}
                            content={
                                <OnboardTooltip.Panel>
                                    <div className="px-6 py-2.5 text-sm font-bold text-white">
                                        <div>
                                            <span>View your </span>
                                            <span className="text-stake-green-500">
                                                available pairs
                                            </span>
                                        </div>
                                        {/* <a href="">
                                            <span className="text-xs underline">
                                                Why your pair is not supported?
                                            </span>
                                            <span></span>
                                        </a> */}
                                    </div>
                                </OnboardTooltip.Panel>
                            }
                        >
                            <div>
                                <ListSwapPool
                                    items={
                                        filtedValidPools.length === 0
                                            ? validPools
                                            : filtedValidPools
                                    }
                                    pivotToken={pivotToken!}
                                    isPivotFirst={type === "to"}
                                    onSelect={(p) => {
                                        onSelectToken(
                                            p.tokens.filter(
                                                (t) => t.id !== pivotToken?.id
                                            )[0]
                                        );
                                        setOnboardedAvailablePair(true);
                                    }}
                                />
                            </div>
                        </OnboardTooltip>
                    ) : (
                        <ListToken
                            className=""
                            items={filtedTokenBalances}
                            onSelect={(t) => onSelectToken(t.token)}
                        />
                    )}
                </div>
            </BaseModal>
        </>
    );
};

export default TokenSelect;
