import {ReactElement} from 'react'
import styles from './IconButton.module.css'

interface Props {
    icon?: ReactElement
    activeIcon?: ReactElement
    onClick?: () => void
    active?: boolean
    className?: string | undefined
}

const IconButton = (props: Props) => {
    return (
        <div className={`${styles.container} ${props.className || 'bg-bg'} ${props.active || ''}`} onClick={props.onClick}>
            {(!props.active || props.active && !props.activeIcon) && props.icon}
            {(props.active && props.activeIcon) && props.activeIcon}
        </div>
    )
}

export default IconButton;