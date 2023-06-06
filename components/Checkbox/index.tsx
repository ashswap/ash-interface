import { ChangeEvent } from "react";
import styles from "./Checkbox.module.css";

interface Props {
    className?: string | undefined;
    onChange?: (checked: boolean) => void;
    text?: any;
    checked?: boolean;
}

const Checkbox = (props: Props) => {
    const onChange = (evt: ChangeEvent) => {
        if (!props.onChange) {
            return;
        }

        const target = evt.target as HTMLInputElement;
        props.onChange(target.checked);
    };

    return (
        <label className={`${styles.container} ${props.className || ""}`}>
            {props.text}
            <input
                className={styles.input}
                type="checkbox"
                checked={props.checked}
                onChange={onChange}
            />
            <span className={styles.checkmark}></span>
        </label>
    );
};

export default Checkbox;
