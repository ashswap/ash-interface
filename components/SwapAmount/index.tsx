import TokenSelect from 'components/TokenSelect';
import styles from './SwapAmount.module.css'

interface Props {
    topLeftCorner?: boolean
    bottomRightCorner?: boolean
}

const SwapAmount = (props: Props) => {
    return (
        <div className={props.topLeftCorner ? styles.topLeftCorner : (props.bottomRightCorner ? styles.bottomRightCorner : '')}>
            <div className="bg-bg flex flex-row px-2.5 pt-3.5 pb-5.5">
                <TokenSelect />
                <input className={styles.input} type="text" placeholder="0.00" />
            </div>
        </div>
    )
}

export default SwapAmount;