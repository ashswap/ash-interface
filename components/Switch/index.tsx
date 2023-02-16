import { useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import styles from "./Switch.module.css";
interface Props {
    checked?: boolean;
    onChange?: (val: boolean) => void;
    children?: any;
    className?: string;
    ref?: any
}
function Switch({checked, onChange, children, className, ref}: Props) {
    const [_checked, set_checked] = useState(checked ?? false);
    const toggle = useCallback(() => {
        set_checked(val => !val);
        if (typeof onChange === "function") {
            onChange(!_checked);
        }
    }, [_checked, onChange]);
    useEffect(() => {
        set_checked(!!checked);
    }, [checked]);
    useImperativeHandle(
        ref,
        () => {
            toggle: () => toggle()
        },
        [toggle],
    )
    return (
        <div className={`cursor-pointer inline-block ${className}`} onClick={toggle}>
            <div
                className="relative inline-block"
                role="switch"
                aria-checked={_checked}
                tabIndex={0}
            >
                <svg
                    width="33"
                    height="16"
                    viewBox="0 0 33 16"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    className={
                        _checked ? "text-pink-600/20" : "text-ash-gray-500/30"
                    }
                >
                    <path d="M7.9245 0H25.0755L33 8L25.0755 16H7.9245L0 8L7.9245 0Z" />
                </svg>
                <div
                    className={`transition-all duration-200 ease-in absolute w-[12.54px] h-[12.54px] rotate-45 top-[50%] translate-y-[-50%] ${
                        _checked
                            ? "left-[15px] bg-pink-600 " + styles.active
                            : "left-[5px] bg-ash-gray-500"
                    }`}
                ></div>
            </div>
            {children}
        </div>
    );
}

export default Switch;
