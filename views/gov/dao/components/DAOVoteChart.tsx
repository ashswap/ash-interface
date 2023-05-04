import BigNumber from "bignumber.js";
import DonutChart, { DounutChartRecord } from "components/Chart/DonutChart";
import { HEX_COLORS } from "const/colors";
import { getHexColor } from "helper/color";
import { shortenString } from "helper/string";
import { useScreenSize } from "hooks/useScreenSize";
import { memo, useMemo } from "react";

type Props = {
    items?: string[][];
    totalPower: BigNumber.Value;
};
function DAOVoteChart({ items = [], totalPower }: Props) {
    const screenSize = useScreenSize();
    const data: DounutChartRecord[] = useMemo(() => {
        let otherPowers = new BigNumber(totalPower || 0);
        const records = (items || []).slice(0, 10).map(([address, power], i) => {
            const record: DounutChartRecord = {
                id: address,
                name: shortenString(address),
                value: new BigNumber(power).div(1e18).toNumber(),
                theme: HEX_COLORS[i] ?? getHexColor(address),
            };
            otherPowers = otherPowers.minus(record.value);
            return record;
        });
        if(otherPowers.gt(0)){
            records.push({
                id: "othersProposalVoterPower",
                name: "Others",
                value: otherPowers.toNumber(),
                theme: getHexColor('othersProposalVoterPower'),
            })
        }
        return records;
    }, [items, totalPower]);
    const radius = useMemo(() => {
        return screenSize.isMobile ? 90 : 130;
    }, [screenSize.isMobile]);
    return (
        <div className="flex flex-col-reverse xs:flex-row xs:items-center gap-7.5">
            <div className="grow flex flex-col gap-y-4">
                {data.map((r) => {
                    return (
                        <div key={r.id} className="flex items-center">
                            <div
                                className="w-4 h-4 mr-4 rounded-full"
                                style={{ backgroundColor: r.theme }}
                            ></div>
                            <div className="font-bold text-xs text-white">
                                {r.name}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="w-full xs:w-2/3 max-w-[20rem]">
                <DonutChart data={data} radius={radius} />
            </div>
        </div>
    );
}

export default memo(DAOVoteChart);
