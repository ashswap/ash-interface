import { Popover, Transition } from "@headlessui/react";
import ICCheck from "assets/svg/check.svg";
import ICChevronDown from "assets/svg/chevron-down.svg";
import ICHexagonDuo from "assets/svg/hexagon-duo.svg";
import { IToken } from "interface/token";
import { useState } from "react";
import { usePopper } from "react-popper";
const TokenOption = ({
    token,
    checked,
    onChange,
}: {
    token?: IToken;
    checked: boolean;
    onChange: (val: boolean) => void;
}) => {
    return (
        <div>
            <div
                className="flex items-center justify-between px-4 py-2 text-xs"
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
                    <div className="bg-ash-blue-500 w-4 h-4 rounded-full mr-1.5"></div>
                    <div className="font-bold">USDT</div>
                </div>
                <div>
                    <span className="text-ash-gray-500">$&nbsp;</span>
                    <span>32m</span>
                </div>
            </div>
        </div>
    );
};
const TokensSelectorForChart = () => {
    const [referenceElement, setReferenceElement] = useState<any>();
    const [popperElement, setPopperElement] = useState<any>();
    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        strategy: "fixed",
        // modifiers: [{ name: "offset", options: { offset: [0, 10] } }],
    });
    const tokens = [1, 2, 3, 4];
    const [selectedTokens, setSelectedTokens] = useState<number[]>([]);
    const onSelectChange = (val: boolean, token: number) => {
        let temp = [...selectedTokens];
        if (val) {
            temp.push(token);
        } else {
            temp = temp.filter((t) => t !== token);
        }
        setSelectedTokens(temp);
    };
    return (
        <Popover className="relative">
            <Popover.Button
                ref={setReferenceElement}
                className="w-48 lg:w-[16.5rem] h-full px-4 flex items-center justify-between text-xs bg-ash-dark-400"
            >
                <div className="text-ash-gray-500">Select token to view</div>
                <ICChevronDown className="inline-block w-3 h-3 text-pink-600" />
            </Popover.Button>

            <Popover.Panel
                ref={setPopperElement}
                style={styles.popper}
                {...attributes.popper}
                className="w-48 lg:w-[16.5rem] transition-none z-10"
            >
                <Transition
                    enter="transition duration-200 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                >
                    <div className="bg-ash-dark-400 py-4">
                        {tokens.map((token) => {
                            return (
                                <TokenOption
                                    key={token}
                                    checked={selectedTokens.some(
                                        (val) => val === token
                                    )}
                                    onChange={(val) =>
                                        onSelectChange(val, token)
                                    }
                                />
                            );
                        })}
                    </div>
                </Transition>
            </Popover.Panel>
        </Popover>
    );
};

export default TokensSelectorForChart;
