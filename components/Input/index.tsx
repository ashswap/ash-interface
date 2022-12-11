import {
    ChangeEvent,
    CSSProperties,
    HTMLInputTypeAttribute,
    ReactElement,
} from "react";
import styles from "./Input.module.css";

interface Props {
    suffix?: ReactElement | string;
    placeholder?: string;
    outline?: boolean;
    disabled?: boolean;
    autoFocus?: boolean;
    type?: HTMLInputTypeAttribute;
    className?: string | undefined;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    textAlign?: "left" | "right";
    backgroundClassName?: string | undefined;
    textColorClassName?: string | undefined;
    textClassName?: string | undefined;
    style?: CSSProperties | undefined;
    size?: number;
}

const Input = (props: Props) => {
    let textAlign = props.textAlign || "left";
    let backgroundClassName = props.backgroundClassName || "bg-bg";
    let textColorClassName = props.textColorClassName || "text-input-2";

    return (
        <div
            className={`${styles.container} ${backgroundClassName} ${
                props.outline ? styles.outline : ""
            } ${props.className || ""}`}
            style={props.style}
        >
            <input
                className={`overflow-auto ${
                    styles.input
                } text-${textAlign} text-${textColorClassName} placeholder-${textColorClassName} ${
                    props.textClassName || ""
                }`}
                type={props.type || "text"}
                placeholder={props.placeholder}
                autoFocus={props.autoFocus}
                value={props.value}
                onChange={props.onChange}
                disabled={props.disabled}
                size={props.size}
            />
            {props.suffix && <span className="ml-3">{props.suffix}</span>}
        </div>
    );
};

export default Input;
