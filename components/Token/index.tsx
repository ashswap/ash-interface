import { IESDTInfo } from "helper/token/token";
import Image from "next/image";
import styles from "./Token.module.css";

interface Props {
    token: IESDTInfo;
    small?: boolean;
    className?: string | undefined;
    onClick?: () => void;
}

const Token = ({
    token: { symbol: name, logoURI: icon },
    small,
    className,
    onClick,
}: Props) => {
    return (
        <div
            className={`flex flex-row items-center ${
                small ? styles.small : ""
            } ${className ? className : ""}`}
            onClick={onClick}
        >
            <div className={styles.icon}>
                <Image src={icon || ""} alt="token icon" layout="fill" />
            </div>
            <div className={styles.text}>{name}</div>
        </div>
    );
};

export default Token;
