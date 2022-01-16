import { CSSProperties } from "react";
import styles from "./Panel.module.css";

interface Props {
    children?: any;
    className?: string | undefined;
    topLeftCorner?: boolean;
    topRightCorner?: boolean;
    dark?: "600" | "650" | "700";
    style?: CSSProperties | undefined;
}

const Panel = (props: Props) => {
    const dark = props.dark || "700";

    return (
        <div
            className={`flex flex-col max-w-full items-center justify-center ${
                dark === "700"
                    ? styles.dark700
                    : dark === "650"
                    ? styles.dark650
                    : styles.dark600
            } ${props.className || ""}`}
            style={props.style}
        >
            <div
                className={`${
                    props.topLeftCorner
                        ? styles.topLeftCorner
                        : props.topRightCorner
                        ? styles.topRightCorner
                        : styles.topLeftCorner
                } max-w-full`}
            >
                {props.children}
            </div>
        </div>
    );
};
interface PanelV2Props {
    children?: any;
    className?: string | undefined;
    corner?: "frameTopLeft" | "frameTopRight";
}
export const PanelV2 = (props: PanelV2Props) => {
    return (
        <div
            className={`${
                styles[props.corner || "frameTopLeft"]
            } ${props.className || "text-base text-ash-dark-700"}`}
        >
            <div className="relative bg-current">{props.children}</div>
        </div>
    );
};

export const PanelContent = (props: Props) => {
    return (
        <div
            className={`${styles.content} ${props.className || ""}`}
            style={props.style}
        >
            {props.children}
        </div>
    );
};

export default Panel;
