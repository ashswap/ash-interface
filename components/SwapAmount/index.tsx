import QuickSelect from 'components/QuickSelect';
import TokenSelect from 'components/TokenSelect';
import pools from 'const/pool';
import IPool from 'interface/pool';
import IToken from 'interface/token';
import { useMemo, useState } from 'react';
import styles from './SwapAmount.module.css'

interface Props {
    topLeftCorner?: boolean
    bottomRightCorner?: boolean
    showQuickSelect?: boolean
    onChange?: (t: IToken) => void
    children?: any
    type: 'from' | 'to'
    poolWithToken?: IToken
}

const SwapAmount = (props: Props) => {
    const [selectedToken, setSelectedToken] = useState<IToken | undefined>(undefined)

    const onSelectToken = (t: IToken) => {
        setSelectedToken(t)
        if (props.onChange) {
            props.onChange(t)
        }
    }

    let validPools = useMemo(() => {
        if (!props.poolWithToken) {
            return undefined
        }

        return pools.filter(p => p.tokens.findIndex(t => t.id == props.poolWithToken?.id) !== -1)
    }, [props.poolWithToken])

    let suggestedTokens = useMemo(() => {
        let tokens: IToken[] = []
        
        validPools?.map(p => {
            p.tokens.forEach(t => {
                if (t.id !== props.poolWithToken?.id) {
                    tokens.push(t)
                }
            })
        })

        return tokens
    }, [validPools, props.poolWithToken])

    return (
        <div className={props.topLeftCorner ? styles.topLeftCorner : (props.bottomRightCorner ? styles.bottomRightCorner : '')}>
            <div className="bg-bg flex flex-row px-2.5 pt-3.5 pb-5.5">
                <TokenSelect
                    modalTitle={props.type === 'from' ? 'Swap from' : 'Swap to'}
                    value={selectedToken}
                    onChange={onSelectToken}
                    validPools={validPools}
                    pivotToken={props.poolWithToken}
                    type={props.type}
                />
                <input className={styles.input} type="number" placeholder="0.00" />
            </div>
            {
                props.showQuickSelect && <QuickSelect tokens={suggestedTokens} onChange={onSelectToken} />
            }
            {props.children}
        </div>
    )
}

export default SwapAmount;