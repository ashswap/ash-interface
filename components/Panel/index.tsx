import { ReactElement } from 'react'
import styles from './Panel.module.css'

interface Props {
    children?: any
    className?: string | undefined;
    topLeftCorner?: boolean
    topRightCorner?: boolean
    dark?: '600' | '650' | '700'
}

const Panel = (props: Props) => {
    const dark = props.dark || '700'

    return (
        <div className={`flex flex-col items-center justify-center pt-3.5 ${dark === '700' ? styles.dark700 : (dark === '650' ? styles.dark650 : styles.dark600)} ${props.className || ''}`}>
            <div className={props.topLeftCorner ? styles.topLeftCorner : (props.topRightCorner ? styles.topRightCorner : styles.topLeftCorner)}>
                {props.children}
            </div>
        </div>
    )
}

export const PanelContent = (props: Props) => {
    return (
        <div className={`${styles.content} ${props.className || ''}`}>{props.children}</div>
    )
}

export default Panel;