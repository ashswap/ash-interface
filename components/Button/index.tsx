import {CSSProperties, ReactElement} from 'react'
import styles from './Button.module.css'

interface Props {
    children?: string
    leftIcon?: ReactElement
    style?: CSSProperties
    topLeftCorner?: boolean
    bottomRightCorner?: boolean
    outline?: boolean
}

const Button = (props: Props) => {
    return (
        <div className={props.outline ? styles.outline : ''}>
            <div className={props.topLeftCorner ? styles.topLeftCorner : (props.bottomRightCorner ? styles.bottomRightCorner : '')} style={props.style}>
                <div className="flex flex-row justify-center items-center gap-2 h-full bg-pink-600 px-4 py-1.5 cursor-pointer select-none text-white font-medium text-xs leading-5">
                    {props.leftIcon}
                    {props.children}
                </div>
            </div>
        </div>
    )
}

export default Button;