import {ReactElement} from 'react'
import styles from './IconButton.module.css'

interface Props {
    icon?: ReactElement
}

const IconButton = (props: Props) => {
    return (
        <div className={styles.container}>
            {props.icon}
        </div>
    )
}

export default IconButton;