import BasePopover from "components/BasePopover";
import moment from "moment";
import React, { useCallback, useMemo, useRef, useState } from "react";
import ICChevronDown from "assets/svg/chevron-down.svg";
import { DatePicker } from "antd";
import useClickOutside from "hooks/useClickOutside";

type props = {
    lockDay: number;
    currentLock?: number;
    min?: number;
    max?: number;
    options: { value: number; label: string }[];
    lockDayChange: (val: number) => void;
};

function LockPeriod({
    lockDay,
    min,
    max,
    currentLock = 0,
    options,
    lockDayChange,
}: props) {
    const datePickerRef = useRef<HTMLDivElement>(null);
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const onClickOutside = useCallback(() => {
        setOpenDatePicker(false);
    }, []);
    useClickOutside(datePickerRef, onClickOutside);
    const fUnlockDate = useMemo(() => {
        return moment().add(lockDay, "days").format("DD MMM, yyyy");
    }, [lockDay]);
    const fSelectedDate = useMemo(() => {
        let years = Math.floor(lockDay / 365);
        let days = Math.floor(lockDay % 365);
        let minutes = Math.ceil(((lockDay % 365) - days) * 24 * 60);
        const y = years ? `${years} ${years > 1 ? "years" : "year"}` : "";
        const d = days ? `${days} ${days > 1 ? "days" : "day"}` : "";
        const m = minutes
            ? `${minutes} ${minutes > 1 ? "minutes" : "minute"}`
            : "";
        return [y, d, m].filter((s) => !!s).join(" ");
    }, [lockDay]);
    const dateValue = useMemo(() => {
        return moment().endOf("days").add(lockDay, "days")
    }, [lockDay]);
    return (
        <div className="bg-ash-dark-400 h-20 flex items-center justify-between pr-3">
            <div ref={datePickerRef} className="pl-6 py-3 relative">
                <DatePicker
                    className="invisible w-0 h-0 p-0 border-0 absolute left-0 bottom-0"
                    dropdownClassName="bg-pink-600 left-0 "
                    open={openDatePicker}
                    popupStyle={{ left: "0px" }}
                    suffixIcon={undefined}
                    inputReadOnly={true}
                    showToday={false}
                    disabledDate={(current) => {
                        if (!current) return false;
                        const checkMin =
                            !!min &&
                            min > 0 &&
                            current.endOf("days") <
                                moment().add(min, "days").endOf("days");
                        const checkMax =
                            !!min &&
                            !!max &&
                            max > min &&
                            max > 0 &&
                            current.endOf("days") >
                                moment().add(max, "days").endOf("day");
                        return current && (checkMin || checkMax);
                    }}
                    getPopupContainer={(el) => {
                        return el.parentElement as any;
                    }}
                    value={dateValue}
                    onChange={(val) =>
                        val &&
                        lockDayChange(
                            val
                                .endOf("days")
                                .diff(moment().endOf("days"), "days")
                        )
                    }
                />
                <div
                    onClick={() => setOpenDatePicker(true)}
                    className="text-white text-lg lg:text-2xl font-bold"
                >
                    {fUnlockDate}
                </div>
            </div>
            <div className="py-3">
                <BasePopover
                    className="absolute w-full text-white left-0"
                    button={({ open }) => (
                        <button
                            className={`transition ease-in-out duration-200 w-40 lg:w-[12.5rem] h-14 px-7 flex items-center justify-between ${
                                open
                                    ? "bg-ash-dark-700 text-white"
                                    : "bg-ash-gray-500/10 text-stake-gray-500"
                            }`}
                        >
                            <span className="font-bold text-xs lg:text-sm mr-2">
                                {open ? "LOCK PERIOD" : fSelectedDate}
                            </span>
                            <ICChevronDown className="w-2 h-auto" />
                        </button>
                    )}
                >
                    {({ close }) => (
                        <ul className="bg-ash-dark-700 py-6">
                            {options.map((lock) => {
                                return (
                                    <li key={lock.value} className="relative">
                                        <button
                                            className="w-full py-3 text-left px-6"
                                            onClick={() => {
                                                lockDayChange(lock.value);
                                                close();
                                            }}
                                        >
                                            {lock.label}
                                        </button>
                                        {lock.value === lockDay && (
                                            <span className="absolute w-[3px] h-5 bg-pink-600 top-1/2 -translate-y-1/2 left-0"></span>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </BasePopover>
            </div>
        </div>
    );
}

export default LockPeriod;
