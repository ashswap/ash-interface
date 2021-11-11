import styles from "./SlippageSelect.module.css";

interface Props {
    children?: string;
    active?: boolean;
    onClick?: () => void;
}

const SlippageSelect = (props: Props) => {
    return (
        <div
            className={`${styles.container} ${
                props.active ? styles.active : ""
            }`}
            onClick={props.onClick}
        >
            {props.children}
        </div>
    );
};

export default SlippageSelect;
