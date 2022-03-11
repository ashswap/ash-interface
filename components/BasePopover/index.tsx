import { Popover, Transition } from "@headlessui/react";
import ICCheck from "assets/svg/check.svg";
import ICChevronDown from "assets/svg/chevron-down.svg";
import ICHexagonDuo from "assets/svg/hexagon-duo.svg";
import IPool from "interface/pool";
import { IToken } from "interface/token";
import { MutableRefObject, useState } from "react";
import { usePopper } from "react-popper";
export const TokenOptionChart = ({
    token,
    pool,
    color,
    label,
    checked,
    onChange,
}: {
    token?: IToken;
    pool?: IPool;
    color?: string;
    label: string;
    checked: boolean;
    onChange: (val: boolean) => void;
}) => {
    return (
        <div>
            <div
                className="flex items-center justify-between px-4 py-2 text-xs cursor-pointer"
                style={{ boxShadow: "0px 4px 50px rgba(0, 0, 0, 0.25)" }}
                onClick={() => onChange(!checked)}
            >
                <div className="flex items-center mr-3">
                    <div className="mr-3 lg:mr-6 relative flex items-center justify-center">
                        <ICHexagonDuo
                            className="w-6 h-6 "
                            fill="#F90060"
                            stroke="#FF005c"
                            fillOpacity={0.3}
                        />
                        <ICCheck
                            className={`absolute w-2.5 h-2.5 ${
                                checked ? "opacity-100" : "opacity-0"
                            }`}
                        />
                    </div>
                    <div
                        className="w-4 h-4 rounded-full mr-1.5"
                        style={{ backgroundColor: color }}
                    ></div>
                    <div className="font-bold">{label}</div>
                </div>
                <div>
                    {/* <span className="text-ash-gray-500">$&nbsp;</span>
                    <span>32m</span> */}
                </div>
            </div>
        </div>
    );
};
type PopperOptions = Parameters<typeof usePopper>[2];
type props = {
    children: (ctx: {
        open: boolean;
        close: (
            focusableElement?:
                | HTMLElement
                | MutableRefObject<HTMLElement | null>
                | undefined
        ) => void;
    }) => any;
    options?: PopperOptions;
    button: (ctx: { open: boolean }) => any;
    className?: string;
};
const BasePopover = ({ children, options, button, className }: props) => {
    const [referenceElement, setReferenceElement] = useState<any>();
    const [popperElement, setPopperElement] = useState<any>();
    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        ...options,
        // modifiers: [{ name: "offset", options: { offset: [0, 10] } }],
    });
    return (
        <Popover className="relative">
            <Popover.Button as="div" ref={setReferenceElement}>
                {(ctx) => button(ctx)}
            </Popover.Button>

            <Popover.Panel
                ref={setPopperElement}
                style={styles.popper}
                {...attributes.popper}
                className={`transition-none z-10 ${className}`}
            >
                {(ctx) => 
                    <Transition
                        enter="transition duration-200 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                    >
                        {children(ctx)}
                    </Transition>
                }
            </Popover.Panel>
        </Popover>
    );
};

export default BasePopover;
