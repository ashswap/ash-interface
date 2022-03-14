import { Slider } from "antd";
import Checkbox from "components/Checkbox";
import HeadlessModal, {
    HeadlessModalDefaultHeader,
} from "components/HeadlessModal";
import InputCurrency from "components/InputCurrency";
import { useDappContext } from "context/dapp";
import React, { useMemo, useState } from "react";
import { theme } from "tailwind.config";
import LockPeriod from "./LockPeriod";
import ICChevronRight from "assets/svg/chevron-right.svg";
import moment from "moment";
import Switch from "components/Switch";
import { useScreenSize } from "hooks/useScreenSize";
type props = {
    open: boolean;
    onClose: () => void;
};
const EXTEND_OPTS = [
    { value: 7, label: "+ 7 days" },
    { value: 30, label: "+ 30 days" },
    { value: 365, label: "+ 1 year" },
];
const MAX_LOCK = 4 * 365;
function StakeMoreModal({ open, onClose }: props) {
    const maxLock = 4 * 365;
    const minLock = 7;
    const currentLockDays = 30;
    const [extendLockPeriod, setExtendLockPeriod] = useState(7);
    const [isAgree, setIsAgree] = useState(false);
    const [isExtend, setIsExtend] = useState(false);
    const {isMobile} = useScreenSize();
    const dapp = useDappContext();
    const remaining = useMemo(() => {
        let years = Math.floor(currentLockDays / 365);
        let days = currentLockDays % 365;
        const y = years ? `${years} ${years > 1 ? "years" : "year"}` : "";
        const d = days ? `${days} ${days > 1 ? "days" : "day"}` : "";
        return [y, d].filter((s) => !!s).join(" ");
    }, [currentLockDays]);
    const extendOpts = useMemo(() => {
        const max = MAX_LOCK - currentLockDays;
        return [
            ...EXTEND_OPTS.filter((opt) => opt.value < max),
            { value: max, label: `max: ${max.toLocaleString("en-US")} days` },
        ];
    }, []);
    return (
        <>
            <HeadlessModal open={open} onClose={() => onClose()} transition={`${isMobile ? "btt" : "center"}`}>
                <div className="bg-stake-dark-400 p-4 fixed bottom-0 inset-x-0 sm:static sm:mt-28 sm:ash-container flex flex-col max-h-[calc(100%-2.75rem)] sm:max-h-full">
                    <HeadlessModalDefaultHeader onClose={() => onClose()} />
                    <div className="mt-4 px-6 lg:px-20 pb-12 overflow-auto">
                        <div className="text-pink-600 text-2xl font-bold mb-9 lg:mb-14">
                            Manage Your Governance Stake
                        </div>
                        <div className="sm:flex sm:space-x-8 lg:space-x-24 mb-24">
                            <div className="flex flex-col flex-grow mb-16 lg:mb-0">
                                <div className="w-full grid grid-cols-2 gap-x-4 lg:gap-x-7.5 mb-16 lg:mb-12">
                                    <div>
                                        <div className="text-ash-gray-500 text-xs lg:text-sm font-bold mb-2 lg:mb-4">
                                            {isMobile ? "Added Amount" : "I want to stake more!"}
                                        </div>
                                        <InputCurrency className="w-full text-white text-lg font-bold bg-ash-dark-400 h-14 lg:h-18 px-6 flex items-center text-right outline-none" />
                                        <div className="text-right text-2xs lg:text-xs mt-2">
                                            <span className="text-ash-gray-500">
                                                Balance:{" "}
                                            </span>
                                            <span className="text-earn">
                                                341.311 ASH
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-ash-gray-500 text-xs lg:text-sm font-bold mb-2 lg:mb-4 flex items-center">
                                            <div className="mr-1">Current</div>
                                            <div className="flex items-center">
                                                <div className="w-3 h-3 bg-ash-purple-500 rounded-full mr-1"></div>
                                                <div>ASH Staked</div>
                                            </div>
                                        </div>
                                        <div className="bg-stake-dark-500 h-14 lg:h-18 px-6 flex items-center justify-end text-ash-gray-500">
                                            <div className="text-right text-sm lg:text-lg">
                                                200
                                            </div>
                                        </div>
                                        <div className="text-right text-2xs lg:text-xs mt-2 text-ash-gray-500">
                                            <span>Total stake: </span>
                                            <span>300 ASH</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-16 lg:mb-11">
                                    <div className="text-ash-gray-500 text-sm font-bold underline mb-2 lg:mb-4">
                                        Current lock period
                                    </div>
                                    <div className="bg-stake-dark-500 text-ash-gray-500 h-18 lg:h-20 pl-6 pr-4 flex items-center justify-between">
                                        <div className="text-lg lg:text-2xl font-bold">
                                            {moment()
                                                .add(currentLockDays, "days")
                                                .format("DD MMM, yyyy")}
                                        </div>
                                        <div className="text-xs lg:text-sm underline pl-5 border-l border-l-ash-gray-500">
                                            {remaining}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center">
                                        <Switch
                                            className="flex items-center"
                                            checked={isExtend}
                                            onChange={(val) => setIsExtend(val)}
                                        >
                                            <span className="ml-3 text-ash-gray-500 text-sm font-bold underline">
                                                I want to extend my lock period!
                                            </span>
                                        </Switch>
                                    </div>
                                    {isExtend && (
                                        <div className="mt-8">
                                            <LockPeriod
                                                lockDay={extendLockPeriod + currentLockDays}
                                                min={currentLockDays + 7}
                                                max={MAX_LOCK}
                                                options={extendOpts.map(opt => ({...opt, value: opt.value + currentLockDays}))}
                                                lockDayChange={(val) =>
                                                    setExtendLockPeriod(val - currentLockDays)
                                                }
                                            />
                                            {/* <div className="mt-4 flex space-x-2">
                                                {extendOpts.map((opt, i) => {
                                                    return (
                                                        <button
                                                            key={opt.value}
                                                            className={`border border-ash-gray-500 bg-ash-gray-500/10 h-11 lg:h-12 flex items-center justify-center px-1 text-ash-gray-500 text-xs lg:text-sm ${i === extendOpts.length - 1 ? "flex-grow" : "w-24"}`}
                                                            onClick={() => setExtendLockPeriod(opt.value)}
                                                        >
                                                            {opt.label}
                                                        </button>
                                                    );
                                                })}
                                            </div> */}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="w-full sm:w-1/3 lg:w-[17.8125rem] flex-shrink-0 bg-stake-dark-500 py-[2.375rem] px-10">
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

export default StakeMoreModal;
