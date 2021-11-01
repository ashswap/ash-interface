import { ReactElement } from 'react'
import styles from './Panel.module.css'

interface Props {
    children?: any
    className?: string | undefined;
}

const Panel = (props: Props) => {
    return (
        <div className={"flex flex-col items-center justify-center pt-3.5 " + props.className}>
            <div className={styles.container}>
                {props.children}
            </div>
        </div>
    )
}

export const PanelContent = (props: Props) => {
    return (
        <div className={styles.content}>{props.children}</div>
    )
}

export default Panel;