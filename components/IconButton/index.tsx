import {ReactElement} from 'react'
import styles from './IconButton.module.css'

interface Props {
    icon?: ReactElement
    activeIcon?: ReactElement
    onClick?: () => void
    active?: boolean
}

const IconButton = (props: Props) => {
    return (
        <div className={`${styles.container} ${props.active ? styles.active: ''}`} onClick={props.onClick}>
            {(!props.active || props.active && !props.activeIcon) && props.icon}
            {(props.active && props.activeIcon) && props.activeIcon}
        </div>
    )
}

export default IconButton;