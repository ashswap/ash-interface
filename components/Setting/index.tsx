import BigNumber from "bignumber.js";
import InputCurrency from "components/InputCurrency";
import SlippageSelect from "components/SlippageSelect";
import { Percent } from "helper/fraction/percent";
import useInputNumberString from "hooks/useInputNumberString";
import { useRecoilState } from "recoil";
import { agSlippageAtom } from "views/swap/Aggregator/atoms/aggregator";

interface Props {}

const Setting = (props: Props) => {
    const [slippage, setSlippage] = useRecoilState(agSlippageAtom);
    const [displaySlip, setDisplaySlip] = useInputNumberString(slippage.toFixed(2), 2);
    return (
        <div>
            <div className="font-bold text-lg">Settings</div>
            <div className="font-normal text-xs mt-14">Slippage Tolerance</div>
            <div className="flex flex-row gap-1 my-5">
                <SlippageSelect
                    active={slippage.equalTo(new Percent(100, 100_000))}
                    onClick={() => {
                        setSlippage(new Percent(100, 100_000));
                        setDisplaySlip("0.1");
                    }}
                >
                    0.1%
                </SlippageSelect>
                <SlippageSelect
                    active={slippage.equalTo(new Percent(500, 100_000))}
                    onClick={() => {
                        setSlippage(new Percent(500, 100_000));
                        setDisplaySlip("0.5");
                    }}
                >
                    0.5%
                </SlippageSelect>
                <SlippageSelect
                    active={slippage.equalTo(new Percent(1_000, 100_000))}
                    onClick={() => {
                        setSlippage(new Percent(1_000, 100_000));
                        setDisplaySlip("1");
                    }}
                >
                    1%
                </SlippageSelect>
            </div>
            <div className="flex items-center h-12 px-5 bg-ash-dark-400 text-white text-sm">
                <InputCurrency
                    className="grow bg-transparent outline-none"
                    placeholder="Custom"
                    value={displaySlip}
                    decimals={2}
                    onChange={(e) => {
                        const raw = e.target.value;
                        setDisplaySlip(raw);
                        if (raw) {
                            if (raw === ".") setSlippage(new Percent(0));
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
                                const [numerator, denominator] = valid === 0 ? [0, 100_000] : new BigNumber(valid).toFraction();
                                setSlippage(new Percent(numerator, denominator));
                            }
                        } else {
                            setSlippage(new Percent(1_000, 100_000));
                        }
                    }}
                />
                <div>%</div>
            </div>
            {slippage.lessThan(new Percent(100, 100_000)) && (
                <div className="text-insufficent-fund text-xs mt-12">
                    Your transactions may fail.
                </div>
            )}
        </div>
    );
};

export default Setting;
