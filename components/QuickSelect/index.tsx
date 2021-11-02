import Token from 'components/Token';
import IToken from 'interface/token';
import styles from './QuickSelect.module.css'

interface Props {
    className?: string | undefined;
    tokens: IToken[];
    onChange?: (t: IToken) => void;
}

const QuickSelect = (props: Props) => {
    const onSelectToken = (t: IToken) => {
        if (props.onChange) {
            props.onChange(t)
        }
    }

    return (
        <div className={`${styles.container} ${props.className || ''}`}>
            <div className={styles.content}>
                <div className={styles.label}>Quick select</div>
                <div className="flex flex-row">
                    {
                        props.tokens.slice(0, 5).map(t => (
                            <Token key={t.id} token={t} small className="flex-1 select-none cursor-pointer" onClick={() => onSelectToken(t)} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default QuickSelect;