import { ReactElement, CSSProperties } from "react";
import styles from "./IconButton.module.css";

interface Props {
    icon?: ReactElement;
    iconSize?: "small" | "big";
    activeIcon?: ReactElement;
    onClick?: () => void;
    active?: boolean;
    className?: string | undefined;
    style?: CSSProperties | undefined;
}

const IconButton = (props: Props) => {
    return (
        <div
            className={`${styles.container} ${props.className ||
                "bg-bg"} ${props.active || ""} ${props.iconSize === 'small' ? styles.iconSmall : styles.iconBig }`}
            onClick={props.onClick}
            style={props.style}
        >
            {(!props.active || (props.active && !props.activeIcon)) &&
                props.icon}
            {props.active && props.activeIcon && props.activeIcon}
        </div>
    );
};

export default IconButton;
