import SlippageSelect from "components/SlippageSelect";
import { useSwap } from "context/swap";
import InputCurrency from "components/InputCurrency";
import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";

interface Props {}

const Setting = (props: Props) => {
    const { slippage, setSlippage } = useSwap();
    const [displaySlip, setDisplaySlip] = useState("");
    return (
        <div>
            <div className="font-bold text-lg">Settings</div>
            <div className="font-normal text-xs mt-14">Slippage Tolerance</div>
            <div className="flex flex-row gap-1 my-5">
                <SlippageSelect
                    active={slippage === 0.001}
                    onClick={() => setSlippage(0.001)}
                >
                    0.1%
                </SlippageSelect>
                <SlippageSelect
                    active={slippage === 0.005}
                    onClick={() => setSlippage(0.005)}
                >
                    0.5%
                </SlippageSelect>
                <SlippageSelect
                    active={slippage === 0.01}
                    onClick={() => setSlippage(0.01)}
                >
                    1%
                </SlippageSelect>
            </div>
            <div className="flex items-center h-12 px-5 bg-ash-dark-400 text-white text-sm">
                <InputCurrency
                    className="flex-grow bg-transparent outline-none"
                    placeholder="Custom"
                    value={displaySlip}
                    onChange={(e) => {
                        const raw = e.target.value;
                        setDisplaySlip(raw);
                        if (raw) {
                            if (raw === ".") setSlippage(0);
                            else {
                                const val = new BigNumber(raw)
                                    .div(100)
                                    .toNumber();
                                const valid = Math.min(Math.max(val, 0), 1);
                                if (val !== valid) {
                                    setDisplaySlip(
                                        new BigNumber(valid)
                                            .multipliedBy(100)
                                            .toString(10)
                                    );
                                }
                                setSlippage(valid);
                            }
                        } else {
                            setSlippage(0.01);
                        }
                    }}
                />
                <div>%</div>
            </div>
            {slippage < 0.005 && (
                <div className="text-insufficent-fund text-xs mt-12">
                    Your transactions may be failed.
                </div>
            )}
        </div>
    );
};

export default Setting;
