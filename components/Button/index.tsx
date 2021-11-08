import {CSSProperties, ReactElement} from 'react'
import styles from './Button.module.css'

interface Props {
    children?: string
    leftIcon?: ReactElement
    style?: CSSProperties
    topLeftCorner?: boolean
    bottomRightCorner?: boolean
    outline?: boolean
    white?: boolean
    dark?: boolean
    disable?: boolean
    className?: string | undefined;
    textClassName?: string | undefined;
    onClick?: () => void
}

const Button = (props: Props) => {
    return (
        <div className={`${props.disable ? styles.disable : ''} ${props.white ? styles.white : ''} ${props.dark ? styles.dark : ''} ${props.outline ? styles.outline : ''} ${props.className || ''}`} onClick={props.onClick}>
            <div className={props.topLeftCorner ? styles.topLeftCorner : (props.bottomRightCorner ? styles.bottomRightCorner : '')} style={props.style}>
                <div className={`${styles.content} ${props.textClassName || ''}`}>
                    {props.leftIcon}
                    {props.children}
                </div>
            </div>
        </div>
    )
}

export default Button;