import ICGovVote from "assets/svg/gov-vote.svg";
import customTwMerge from "helper/customTwMerge";
import { DAOStatus } from "interface/dao";
import { memo, useMemo } from "react";
import { theme } from "tailwind.config";
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
            backgroundImage: `radial-gradient(circle 250px at 100% 0%, currentColor, ${theme.extend.colors["stake-dark"][400]})`,
        };
    }, []);
    return (
        <div className={`absolute inset-0 ${govClassName}`}>
            <div
                className={`absolute inset-0 ${clipClassName}`}
                style={bgStyle}
            ></div>
            <div
                className={customTwMerge(
                    "absolute inset-[1px] bg-stake-dark-400",
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
