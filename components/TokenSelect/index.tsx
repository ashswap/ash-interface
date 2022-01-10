import { useCallback, useEffect, useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import pools from "const/pool";
import Modal from "components/Modal";
import Input from "components/Input";
import ListToken from "components/ListToken";
import Token from "components/Token";
import ListSwapPool from "components/ListSwapPool";
import { TokenBalance } from "interface/tokenBalance";
import { IToken } from "interface/token";
import IPool from "interface/pool";
import Down from "assets/svg/down.svg";
import Search from "assets/svg/search.svg";
import IconClose from "assets/svg/close-1.svg";
import styles from "./TokenSelect.module.css";
import { useWallet } from "context/wallet";

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
                {value ? <Token token={value} /> : <div>Select a token</div>}
                <Down />
            </div>
            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="font-bold text-lg">{modalTitle}</div>
                <div className="flex flex-row items-center my-8 w-full">
                    {pivotToken && type === "to" && renderPivotToken()}
                    <Input
                        placeholder="Search or try usdt"
                        suffix={<Search />}
                        outline
                        autoFocus
                        value={keyword}
                        onChange={e => onChangeKeyword(e.target.value)}
                        textClassName="text-sm"
                        className="flex-1"
                    />
                    {pivotToken && type === "from" && renderPivotToken()}
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

                {validPools ? (
                    <ListSwapPool
                        items={filtedValidPools}
                        pivotToken={pivotToken!}
                        isPivotFirst={type === "to"}
                        onSelect={p =>
                            onSelectToken(
                                p.tokens.filter(t => t.id !== pivotToken?.id)[0]
                            )
                        }
                    />
                ) : (
                    <ListToken
                        className={styles.listToken}
                        items={filtedTokenBalances}
                        onSelect={t => onSelectToken(t.token)}
                    />
                )}
            </Modal>
        </>
    );
};

export default TokenSelect;
