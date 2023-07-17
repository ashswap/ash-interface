import { useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

interface Props {
    checked?: boolean;
    onChange?: (val: boolean) => void;
    children?: any;
    className?: string;
    ref?: any
    theme?: "pink" | "yellow"
}
function Switch({checked, onChange, children, className, ref, theme = "pink"}: Props) {
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
                        _checked ? theme === "pink" ? "text-pink-600/20" : "text-yellow-500/20" : "text-ash-gray-500/30"
                    }
                >
                    <path d="M7.9245 0H25.0755L33 8L25.0755 16H7.9245L0 8L7.9245 0Z" />
                </svg>
                <div
                    className={`transition-all duration-200 ease-in absolute w-[12px] h-[12px] rotate-45 top-[8px] translate-y-[-50%] ${
                        _checked
                            ? `left-[18px] colored-drop-shadow-md ${theme === "pink" ? "bg-pink-600 colored-drop-shadow-pink-600/75" : "bg-yellow-500 colored-drop-shadow-yellow-500/75"}`
                            : "left-[3px] bg-ash-gray-500"
                    }`}
                ></div>
            </div>
            {children}
        </div>
    );
}

export default Switch;
