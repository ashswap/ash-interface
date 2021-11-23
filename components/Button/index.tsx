import { CSSProperties, ReactElement } from "react";
import styles from "./Button.module.css";

interface Props {
    children?: any;
    leftIcon?: ReactElement;
    rightIcon?: ReactElement;
    style?: CSSProperties;
    topLeftCorner?: boolean;
    bottomRightCorner?: boolean;
    outline?: boolean;
    primaryColor?: "dark-600" | "dark-700" | "white" | "yellow-700";
    disable?: boolean;
    className?: string | undefined;
    textClassName?: string | undefined;
    glowOnHover?: boolean;
    onClick?: () => void;
}

const Button = (props: Props) => {
    return (
        <div
            className={`${props.disable ? styles.disable : ""} ${
                props.outline ? styles.outline : ""
            } ${props.glowOnHover ? styles.glowHover : ""} ${
                props.primaryColor === "white"
                    ? styles.white
                    : props.primaryColor === "dark-600"
                    ? styles.dark600
                    : props.primaryColor === "dark-700"
                    ? styles.dark
                    : props.primaryColor === "yellow-700"
                    ? styles.yellow700
                    : ""
            } ${props.className || ""}`}
            onClick={props.onClick}
        >
            <div
                className={
                    props.topLeftCorner
                        ? styles.topLeftCorner
                        : props.bottomRightCorner
                        ? styles.bottomRightCorner
                        : ""
                }
                style={props.style}
            >
                <div
                    className={`${styles.content} ${props.textClassName || ""}`}
                >
                    {props.leftIcon}
                    {props.children}
                    {props.rightIcon}
                </div>
            </div>
        </div>
    );
};

export default Button;
