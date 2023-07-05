import BigNumber from "bignumber.js";
import TextAmt from "components/TextAmt";
import React, { memo, useMemo } from "react";
type DAOResultBarProps = {
    yes: BigNumber.Value;
    no: BigNumber.Value;
    requiredSupportPct: BigNumber.Value;
    detail?: boolean;
};
function DAOResultBar({ yes, no, detail, requiredSupportPct }: DAOResultBarProps) {
    const total = useMemo(() => {
        return new BigNumber(yes).plus(no);
    }, [yes, no]);
    const yesPct = useMemo(() => {
        if (total.eq(0)) return 0;
        return new BigNumber(yes).multipliedBy(100).idiv(total).toNumber();
    }, [yes, total]);
    const noPct = useMemo(() => 100 - yesPct, [yesPct]);
    return (
        <div>
            <div className="mb-2 flex justify-between font-bold text-2xl">
                <span className="text-stake-green-500">{yesPct}%</span>
                <span className="text-ash-purple-500">{noPct}%</span>
            </div>
            <div className="relative mb-2 w-full h-5 bg-ash-purple-500">
                <div
                    className="h-full bg-stake-green-500 colored-drop-shadow-sm colored-drop-shadow-stake-green-500/50"
                    style={{ width: `${yesPct}%` }}
                ></div>
                <div className="absolute bottom-0 -top-full -translate-x-1/2 border-l-[3px] border-l-white border-dashed" style={{left: `${requiredSupportPct}%`}}></div>
            </div>
            {detail ? (
                <div className="flex justify-between text-sm">
                    <span className="text-stake-green-500">Support <span className="font-bold"><TextAmt number={yes}/> veASH</span></span>
                    <span className="text-ash-purple-500">Against <span className="font-bold"><TextAmt number={no}/> veASH</span></span>
                </div>
            ) : (
                <div className="flex justify-between font-bold text-sm">
                    <span className="text-stake-green-500">Support</span>
                    <span className="text-ash-purple-500">Against</span>
                </div>
            )}
        </div>
    );
}

export default memo(DAOResultBar);
