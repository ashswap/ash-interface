import { Slider } from "antd";
import Checkbox from "components/Checkbox";
import HeadlessModal, {
    HeadlessModalDefaultHeader,
} from "components/HeadlessModal";
import InputCurrency from "components/InputCurrency";
import { useDappContext } from "context/dapp";
import React, { useState } from "react";
import { theme } from "tailwind.config";
import LockPeriod from "./LockPeriod";
import ICChevronRight from "assets/svg/chevron-right.svg";
type props = {
    open: boolean;
    onClose: () => void;
};
const predefinedLockPeriod = [
    { value: 7, label: "7 days" },
    { value: 30, label: "30 days" },
    { value: 365, label: "1 year" },
    { value: 365 * 2, label: "2 years" },
    { value: 365 * 3, label: "3 year" },
    { value: 365 * 4, label: "4 year" },
];
function FirstStakeModal({ open, onClose }: props) {
    const isFirstTime = true;
    const maxLock = 4 * 365;
    const minLock = 7;
    const [lockPeriod, setLockPeriod] = useState(7);
    const [isAgree, setIsAgree] = useState(false);
    const dapp = useDappContext();
    return (
        <>
            <HeadlessModal open={open} onClose={() => onClose()}>
                <div className="bg-stake-dark-400 p-4 fixed bottom-0 inset-x-0 sm:static sm:mt-28 sm:ash-container flex flex-col max-h-full">
                    <HeadlessModalDefaultHeader onClose={() => onClose()} />
                    <div className="pt-4 px-20 pb-12">
                        <div className="text-pink-600 text-2xl font-bold mb-14">
                            Governance Stake
                        </div>
                        <div className="sm:flex sm:space-x-8 lg:space-x-24 mb-24">
                            <div className="flex flex-col flex-grow">
                                <div className="w-full grid grid-cols-2 gap-x-7.5 mb-12">
                                    <div>
                                        <div className="text-ash-gray-500 text-sm font-bold mb-4">
                                            Token
                                        </div>
                                        <div className="bg-ash-dark-400/30 h-18 px-7 flex items-center">
                                            <div className="w-7 h-7 bg-pink-600 rounded-full mr-3"></div>
                                            <div className="text-white text-lg font-bold">
                                                ASH
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-ash-gray-500 text-sm font-bold mb-4">
                                            Input Amount
                                        </div>
                                        <InputCurrency className="w-full text-white text-lg font-bold bg-ash-dark-400 h-18 px-6 flex items-center text-right outline-none" />
                                        <div className="text-right text-xs mt-2">
                                            <span className="text-ash-gray-500">
                                                Balance:{" "}
                                            </span>
                                            <span className="text-earn">
                                                341.311 ASH
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm underline font-bold text-ash-gray-500 mb-4">
                                        Lock period
                                    </div>
                                    <LockPeriod
                                        lockDay={lockPeriod}
                                        min={7}
                                        max={4 * 365}
                                        options={predefinedLockPeriod}
                                        lockDayChange={(val) =>
                                            setLockPeriod(val)
                                        }
                                    />
                                    <div className="overflow-hidden mt-8">
                                        <Slider
                                            className="ash-slider ash-slider-pink my-0"
                                            step={1}
                                            marks={{
                                                [minLock]: "",
                                                [maxLock / 4]: "",
                                                [maxLock / 2]: "",
                                                [(maxLock * 3) / 4]: "",
                                                [maxLock]: "",
                                            }}
                                            handleStyle={{
                                                backgroundColor:
                                                    theme.extend.colors
                                                        .pink[600],
                                                borderRadius: 0,
                                                border:
                                                    "2px solid " +
                                                    theme.extend.colors
                                                        .pink[600],
                                                width: 7,
                                                height: 7,
                                            }}
                                            min={minLock}
                                            max={maxLock}
                                            value={lockPeriod}
                                            onChange={(e) => setLockPeriod(e)}
                                        />
                                        <div className="flex justify-between mt-1">
                                            <div className="text-sm font-bold text-white">
                                                7 days
                                            </div>
                                            <div className="text-sm font-bold text-pink-600">
                                                Max
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-[17.8125rem] flex-shrink-0 bg-stake-dark-500 py-[2.375rem] px-10">
                                <div className="text-white text-lg font-bold mb-16">
                                    Estimate Staking
                                </div>
                                <div className="flex flex-col space-y-11">
                                    <div>
                                        <div className="text-ash-gray-500 text-xs underline mb-2">
                                            VeASH Receive
                                        </div>
                                        <div className="text-white text-lg font-bold">
                                            _
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-ash-gray-500 text-xs underline mb-2">
                                            Your capacity
                                        </div>
                                        <div className="text-white text-lg font-bold">
                                            _
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-ash-gray-500 text-xs underline mb-2">
                                            Unlock Time
                                        </div>
                                        <div className="text-white text-lg font-bold min-h-[3rem]">
                                            _
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="sm:flex sm:space-x-8 lg:space-x-24">
                            <div className="w-full mb-12 sm:mb-0 sm:flex-grow">
                                <Checkbox
                                    checked={isAgree}
                                    onChange={setIsAgree}
                                    text={
                                        <span className="text-ash-gray-500">
                                            I verify that I have read the{" "}
                                            <a
                                                href="https://docs.ashswap.io/guides/add-remove-liquidity"
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <b className="text-white">
                                                    <u>AshSwap Pools Guide</u>
                                                </b>
                                            </a>{" "}
                                            and understand the risks of
                                            providing liquidity, including
                                            impermanent loss.
                                        </span>
                                    }
                                />
                            </div>
                            <div className="w-full sm:w-[17.8125rem] flex-shrink-0">
                                <div className="border-notch">
                                    <button
                                        className={`clip-corner-1 clip-corner-tl transition w-full h-12 flex items-center justify-center text-sm font-bold ${
                                            dapp.account.balance === "0"
                                                ? "bg-pink-600 text-ash-dark-600"
                                                : "bg-ash-dark-500 text-white"
                                        }`}
                                        disabled={dapp.account.balance === "0"}
                                    >
                                        {dapp.account.balance === "0" ? (
                                            "INSUFFICIENT EGLD BALANCE"
                                        ) : (
                                            <div className="flex items-center">
                                                <div className="mr-2">
                                                    STAKE
                                                </div>
                                                <ICChevronRight className="w-2 h-auto" />
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </HeadlessModal>
        </>
    );
}

export default FirstStakeModal