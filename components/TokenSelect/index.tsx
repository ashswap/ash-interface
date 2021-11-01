import { useCallback, useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import Modal from 'components/Modal';
import Input from 'components/Input';
import ListToken from 'components/ListToken';
import Token from 'components/Token';
import Down from 'assets/svg/down.svg';
import Search from 'assets/svg/search.svg';
import tokens from 'const/token';
import TokenBalance from 'interface/tokenBalance';
import styles from './TokenSelect.module.css';
import IToken from 'interface/token';

const TokenSelect = () => {
    const [open, setOpen] = useState<boolean>(false)
    const [filtedTokenBalances, setFiltedTokenBalances] = useState<TokenBalance[]>([]);
    const [keyword, setKeyword] = useState<string>('')
    const [selectedToken, setSelectedToken] = useState<IToken | null>(null)

    const tokenBalances = useMemo(() => {
        let tokenBalances: TokenBalance[] = tokens.map(t => ({
            token: t,
            balance: new BigNumber(100),
        }));

        return tokenBalances;
    }, [])

    const onChangeKeyword = useCallback(
        (keyword: string) => {
            setKeyword(keyword)
            setFiltedTokenBalances(tokenBalances.filter(t => t.token.name.toLowerCase().includes(keyword.toLowerCase())))
        },
        [tokenBalances],
    )

    const onSelectToken = (t: IToken) => {
        setSelectedToken(t)
        setOpen(false)
    }

    useEffect(() => {
        setFiltedTokenBalances(tokenBalances)
    }, [tokenBalances])

    return (
        <>
            <div
                className="flex flex-row items-center justify-between text-sm font-bold w-44 cursor-pointer select-none bg-bg-select p-4 rounded-xl text-pink-600"
                onClick={() => setOpen(true)}
            >
                {
                    selectedToken ? <Token token={selectedToken}/> : <div>Select a token</div>
                }
                <Down />
            </div>
            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="font-bold text-lg">Swap From</div>
                <Input
                    className="my-8"
                    placeholder="Search or try usdt-usdc"
                    suffix={<Search />}
                    outline
                    autoFocus
                    value={keyword}
                    onChange={e => onChangeKeyword(e.target.value)}
                />
                <div className="font-normal text-xs text-white ml-2">Owned</div>

                <ListToken
                    className={styles.listToken}
                    items={filtedTokenBalances}
                    onSelect={t => onSelectToken(t.token)}
                />
            </Modal>
        </>
    )
}

export default TokenSelect;