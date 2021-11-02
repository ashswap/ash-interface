import IToken from "interface/token";
import styles from './Token.module.css';

interface Props {
    token: IToken
    small?: boolean
    className?: string | undefined;
    onClick?: () => void;
}

const Token = ({token: {name, icon}, small, className, onClick}: Props) => {
    return (
        <div className={`flex flex-row items-center ${small ? styles.small : ''} ${className ? className : ''}`} onClick={onClick}>
            <div style={{backgroundColor: icon}} className={styles.icon} />
            <div className={styles.text}>{name}</div>
        </div>
    )
}

export default Token;