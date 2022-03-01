import IconClose from "assets/svg/close.svg";
import IconButton from "components/IconButton";
import SlippageSelect from "components/SlippageSelect";
import styles from "./Setting.module.css";
import Input from "components/Input";
import { useSwap } from "context/swap";

interface Props {}

const Setting = (props: Props) => {
    const { slippage, setSlippage } = useSwap();

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
            <Input
                suffix="%"
                placeholder="Custom"
                type="number"
                textClassName="text-sm"
                className="h-12 px-5"
                onChange={e => {
                    setSlippage(parseFloat(e.target.value) / 100);
                }}
                value={(slippage * 100).toString()}
            />
            {slippage < 0.005 && (
                <div className="text-insufficent-fund text-xs mt-12">
                    Your transactions may be failed.
                </div>
            )}
        </div>
    );
};

export default Setting;
