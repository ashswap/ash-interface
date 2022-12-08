import customTwMerge from "helper/customTwMerge";
import { useMemo } from "react";

const pinkClassName =
    "bg-pink-600 active:bg-pink-800 text-white disabled:bg-ash-dark-400 disabled:text-white";
const cyanClassName =
    "bg-ash-cyan-500 active:bg-ash-steel-500 text-ash-dark-400 disabled:bg-ash-dark-400 disabled:text-white";
const yellowClassName =
    "bg-yellow-600 active:bg-yellow-700 text-white disabled:bg-ash-dark-400 disabled:text-white";
const greenClassName =
    "bg-stake-green-500 active:bg-stake-green-500/80 text-white disabled:bg-ash-dark-400 disabled:text-white";
const purpleClassName =
    "bg-ash-purple-500 active:bg-ash-purple-500/80 text-white disabled:bg-ash-dark-400 disabled:text-white";
const THEME = {
    pink: pinkClassName,
    cyan: cyanClassName,
    yellow: yellowClassName,
    green: greenClassName,
    purple: purpleClassName
};
export type BaseButtonProps = JSX.IntrinsicElements["button"] & {
    theme?: keyof typeof THEME;
};
function BaseButton({ theme, ...props }: BaseButtonProps) {
    const className = useMemo(() => {
        const baseClassName =
            "inline-flex justify-center items-center text-center relative transition-all disabled:cursor-not-allowed disabled:opacity-50";
        const themeClassName = theme ? THEME[theme] : "";
        return customTwMerge(baseClassName, themeClassName, props.className);
    }, [theme, props.className]);
    return (
        <button {...props} className={className}>
            {props.children}
        </button>
    );
}

export default BaseButton;
