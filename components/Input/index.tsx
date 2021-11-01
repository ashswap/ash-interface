import {ChangeEvent, HTMLInputTypeAttribute, ReactElement} from 'react'
import styles from './Input.module.css'

interface Props {
    suffix?: ReactElement | string
    placeholder?: string
    outline?: boolean
    autoFocus?: boolean
    type?: HTMLInputTypeAttribute
    className?: string | undefined;
    value?: string
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

const Input = (props: Props) => {
    return (
        <div className={`${styles.container} ${props.outline ? styles.outline : ''} ${props.className ? props.className : ''}`}>
            <input
                className={styles.input}
                type={props.type || "text"}
                placeholder={props.placeholder}
                autoFocus={props.autoFocus}
                value={props.value}
                onChange={props.onChange}
            />
            {
                props.suffix && <span className="ml-3">{props.suffix}</span>
            }
        </div>
    )
}

export default Input;