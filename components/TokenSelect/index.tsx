import IconClose from "assets/svg/close-1.svg";
import Down from "assets/svg/down.svg";
import Search from "assets/svg/search.svg";
import BigNumber from "bignumber.js";
import HeadlessModal, {
    HeadlessModalDefaultHeader
} from "components/HeadlessModal";
import Input from "components/Input";
import ListSwapPool from "components/ListSwapPool";
import ListToken from "components/ListToken";
import Token from "components/Token";
import { useWallet } from "context/wallet";
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
    resetPivotToken
}: Props) => {
    const [open, setOpen] = useState<boolean>(false);
    const [filtedTokenBalances, setFiltedTokenBalances] = useState<
        TokenBalance[]
    >([]);
    const [filtedValidPools, setFiltedValidPools] = useState<IPool[]>([]);
    const [keyword, setKeyword] = useState<string>("");
    const { tokens, balances } = useWallet();
    const screenSize = useScreenSize();

    const tokenBalances = useMemo(() => {
        let tokenBalances: TokenBalance[] = [];

        for (const tokenId in tokens) {
            if (Object.prototype.hasOwnProperty.call(tokens, tokenId)) {
                const tokenBalance: TokenBalance = {
                    token: tokens[tokenId],
                    balance: balances[tokenId]
                        ? balances[tokenId].balance
                        : new BigNumber(0)
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
                tokenBalances.filter(t =>
                    t.token.name.toLowerCase().includes(keyword.toLowerCase())
                )
            );

            if (validPools && pivotToken) {
                setFiltedValidPools(
                    validPools?.filter(p =>
                        p.tokens
                            .filter(t => t.id !== pivotToken?.id)[0]
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
            <div
                className={
                    `flex flex-row items-center justify-between text-sm font-bold w-44 cursor-pointer select-none p-4 rounded-xl text-pink-600 ` +
                    (value
                        ? "bg-ash-dark-600"
                        : `bg-bg-select hover:bg-bg-select-hover ${styles.containerHover}`)
                }
                onClick={() => setOpen(true)}
            >
                {value ? (
                    <Token token={value} />
                ) : (
                    <div className="text-xs sm:text-sm">Select a token</div>
                )}
                <Down />
            </div>
            <HeadlessModal open={open} onClose={() => setOpen(false)} transition={screenSize.sm ? 'btt' : 'center'}>
                <div className="clip-corner-4 clip-corner-tl bg-ash-dark-600 flex flex-col p-4 w-full sm:w-[27.375rem] mx-auto sm:mt-28 fixed bottom-0 max-h-full sm:static sm:min-h-[38.5rem]">
                    <HeadlessModalDefaultHeader
                        onClose={() => setOpen(false)}
                    />
                    <div className="flex-shrink-0 px-6 pt-1 pb-6">
                        <div className="font-bold text-lg text-white">
                            {modalTitle}
                        </div>
                        <div className="flex flex-row items-center my-8 w-full">
                            {pivotToken && type === "to" && renderPivotToken()}
                            <Input
                                placeholder="Search or try usdt-usdc"
                                suffix={<Search />}
                                outline
                                autoFocus
                                value={keyword}
                                onChange={e => onChangeKeyword(e.target.value)}
                                textClassName="text-sm"
                                className="w-full caret-pink-500 overflow-hidden h-12 px-5"
                            />
                            {pivotToken &&
                                type === "from" &&
                                renderPivotToken()}
                        </div>
                        {validPools && filtedValidPools.length === 0 ? (
                            <div className="text-insufficent-fund text-xs">
                                That doesn&apos;t look like a supported swap!
                            </div>
                        ) : (
                            <div className="font-normal text-xs text-white">
                                {validPools ? "Supported pairs" : "Owned"}
                            </div>
                        )}
                    </div>

                    <div className="overflow-auto px-6 pb-7 min-h-[35vh] sm:min-h-[initial]">
                        {validPools ? (
                            <ListSwapPool
                                items={filtedValidPools}
                                pivotToken={pivotToken!}
                                isPivotFirst={type === "to"}
                                onSelect={p =>
                                    onSelectToken(
                                        p.tokens.filter(
                                            t => t.id !== pivotToken?.id
                                        )[0]
                                    )
                                }
                            />
                        ) : (
                            <ListToken
                                className=""
                                items={filtedTokenBalances}
                                onSelect={t => onSelectToken(t.token)}
                            />
                        )}
                    </div>
                </div>
            </HeadlessModal>
        </>
    );
};

export default TokenSelect;
