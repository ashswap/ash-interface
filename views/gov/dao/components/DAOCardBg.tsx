import ICGovVote from "assets/svg/gov-vote.svg";
import customTwMerge from "helper/customTwMerge";
import { DAOStatus } from "interface/dao";
import { memo, useMemo } from "react";
import { DAOThemeTextClassName } from "../const/theme";

function DAOCardBg({
    status,
    clipClassName = "",
}: {
    status?: DAOStatus;
    clipClassName?: string;
}) {
    const govClassName = useMemo(() => {
        const _status: DAOStatus = status || "pending";
        return ` ${DAOThemeTextClassName[_status]}`;
    }, [status]);
    const bgStyle: React.CSSProperties = useMemo(() => {
        return {
            backgroundImage: `radial-gradient(circle 250px at 100% 0%, currentColor, transparent)`,
        };
    }, []);
    return (
        <div className={`absolute inset-0 ${govClassName}`}>
            <div
                className={`overflow-hidden absolute inset-0 ${clipClassName}`}
            >
                <div className="absolute inset-0" style={bgStyle}></div>
            </div>
            <div
                className={customTwMerge(
                    "overflow-hidden transition-all duration-300 absolute inset-[1px] bg-stake-dark-400",
                    clipClassName
                )}
            ></div>
            <ICGovVote
                className={`w-[3.75rem] h-auto absolute -top-3.5 right-1 colored-drop-shadow-sm colored-drop-shadow-current`}
            />
        </div>
    );
}
export default memo(DAOCardBg);
