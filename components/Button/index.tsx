import {CSSProperties, ReactElement} from 'react'
import styles from './Button.module.css'

interface Props {
    children?: any
    leftIcon?: ReactElement
    rightIcon?: ReactElement
    style?: CSSProperties
    topLeftCorner?: boolean
    bottomRightCorner?: boolean
    outline?: boolean
    white?: boolean
    dark?: 600 | 700
    disable?: boolean
    className?: string | undefined;
    textClassName?: string | undefined;
    onClick?: () => void
}

const Button = (props: Props) => {
    return (
        <div className={`${props.disable ? styles.disable : ''} ${props.white ? styles.white : ''} ${props.dark === 700 ? styles.dark : (props.dark === 600 ? styles.dark600 : '')} ${props.outline ? styles.outline : ''} ${props.className || ''}`} onClick={props.onClick}>
            <div className={props.topLeftCorner ? styles.topLeftCorner : (props.bottomRightCorner ? styles.bottomRightCorner : '')} style={props.style}>
                <div className={`${styles.content} ${props.textClassName || ''}`}>
                    {props.leftIcon}
                    {props.children}
                    {props.rightIcon}
                </div>
            </div>
        </div>
    )
}

export default Button;