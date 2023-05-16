import customTwMerge from "helper/customTwMerge";
import { DAOStatus } from "interface/dao";
import React, { memo } from "react";
import { DAOThemeTextClassName } from "../const/theme";
const STATUS_LABEL: Record<DAOStatus, string> = {
    active: "Active - Can vote",
    rejected: "Rejected",
    executed: "Executed",
    pending: "Pending",
    approved: "Passed",
    expired: "Expired",
};
type Props = {
    label?: string;
    status: DAOStatus;
    className?: string;
    textClassName?: string;
};
function DAOTag({ label, status, className, textClassName }: Props) {
    return (
        <div className="inline-block relative px-3 py-0.5 sm:py-1">
            <div
                className={customTwMerge(
                    `absolute inset-0 skew-x-[-10deg] bg-current ${DAOThemeTextClassName[status]}`,
                    className
                )}
            ></div>
            <div
                className={customTwMerge(
                    `relative font-bold text-xs sm:text-base capitalize ${
                        status === "active" ? "text-white" : "text-ash-dark-400"
                    }`,
                    textClassName
                )}
            >
                {label || STATUS_LABEL[status]}
            </div>
        </div>
    );
}

export default memo(DAOTag);
