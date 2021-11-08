import { useCallback, useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import Modal from 'components/Modal';
import Input from 'components/Input';
import ListToken from 'components/ListToken';
import Token from 'components/Token';
import Down from 'assets/svg/down.svg';
import Search from 'assets/svg/search.svg';
import pools from 'const/pool';
import TokenBalance from 'interface/tokenBalance';
import styles from './TokenSelect.module.css';
import IToken from 'interface/token';
import IPool from 'interface/pool';
import ListSwapPool from 'components/ListSwapPool';

interface Props {
    onChange?: (t: IToken) => void
    value?: IToken
    validPools?: IPool[]
    pivotToken?: IToken
    modalTitle: string
    type: 'from' | 'to'
}

const TokenSelect = ({value, validPools, onChange, modalTitle, pivotToken, type}: Props) => {
    const [open, setOpen] = useState<boolean>(false)
    const [filtedTokenBalances, setFiltedTokenBalances] = useState<TokenBalance[]>([]);
    const [filtedValidPools, setFiltedValidPools] = useState<IPool[]>([]);
    const [keyword, setKeyword] = useState<string>('')
    
    let tokenBalances = useMemo(() => {
        let tokenBalances: TokenBalance[] = []
        pools.map(p => {
            p.tokens.forEach(t => {
                if (tokenBalances.findIndex(b => b.token.id === t.id) === -1){
                    tokenBalances.push({
                        token: t,
                        balance: new BigNumber(100),
                    })
                }
            })
        })

        return tokenBalances
    }, [])

    const onChangeKeyword = useCallback(
        (keyword: string) => {
            setKeyword(keyword)
            setFiltedTokenBalances(tokenBalances.filter(t => t.token.name.toLowerCase().includes(keyword.toLowerCase())))

            if (validPools && pivotToken) {
                setFiltedValidPools(validPools?.filter(p => p.tokens.filter(t => t.id !== pivotToken?.id)[0].name.toLowerCase().includes(keyword.toLowerCase())))
            }
        },
        [tokenBalances, validPools, pivotToken],
    )

    const onSelectToken = (t: IToken) => {
        setOpen(false)
        
        if(onChange){
            onChange(t)
        }
    }

    useEffect(() => {
        setFiltedTokenBalances(tokenBalances)
    }, [tokenBalances])

    useEffect(() => {
        if (validPools) {
            setFiltedValidPools(validPools)
        }
    }, [validPools])

    return (
        <>
            <div
                className={"flex flex-row items-center justify-between text-sm font-bold w-44 cursor-pointer select-none p-4 rounded-xl text-pink-600 " + (value ? "bg-ash-dark-600" : "bg-bg-select")}
                onClick={() => setOpen(true)}
            >
                {
                    value ? <Token token={value}/> : <div>Select a token</div>
                }
                <Down />
            </div>
            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="font-bold text-lg">{modalTitle}</div>
                <Input
                    className="my-8"
                    placeholder="Search or try usdt-usdc"
                    suffix={<Search />}
                    outline
                    autoFocus
                    value={keyword}
                    onChange={e => onChangeKeyword(e.target.value)}
                    textClassName="text-sm"
                />
                <div className="font-normal text-xs text-white ml-2">{validPools ? 'Supported pairs' : 'Owned'}</div>

                {
                    validPools ?
                        (
                            <ListSwapPool
                                items={filtedValidPools}
                                pivotToken={pivotToken!}
                                isPivotFirst={type==='to'}
                                onSelect={p => onSelectToken(p.tokens.filter(t => t.id !== pivotToken?.id)[0])}
                            />
                        ) :
                        (
                            <ListToken
                                className={styles.listToken}
                                items={filtedTokenBalances}
                                onSelect={t => onSelectToken(t.token)}
                            />
                        )
                }
            </Modal>
        </>
    )
}

export default TokenSelect;