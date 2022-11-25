
import TextAmt from "components/TextAmt";
import { randomUUID } from "crypto";
import { formatAmount } from "helper/number";
import { FarmWeightChartRecord } from "interface/chart";
import { Unarray } from "interface/utilities";
import { v4 as uuidv4 } from 'uuid';
import React, { useCallback, useMemo, useState } from "react";
import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Sector,
    SectorProps,
} from "recharts";
const data = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
];
type PieSectorDataItem = Required<
    Extract<
        Unarray<
            ReturnType<typeof Pie["getDerivedStateFromProps"]>["curSectors"]
        >,
        {}
    >
> & { payload: any };
const renderActiveShape = (props: PieSectorDataItem) => {
    const RADIAN = Math.PI / 180;
    const {
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        startAngle,
        endAngle,
        fill,
        payload,
        percent,
        value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";
    const uuid = uuidv4();
    
    return (
        <g>
            {/* <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                {payload.name}
            </text> */}
            <defs>
                <filter id={`ALFC-shadowUv${uuid}`} height="200%">
                    <feDropShadow
                        dx="0"
                        dy="0"
                        stdDeviation="6"
                        floodColor={fill}
                    />
                </filter>
            </defs>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 10}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                color={"#ff005c"}
                lightingColor="#ff005c"
                colorInterpolation="#ff005c"
                colorInterpolationFilters="auto"
                filter={`url(#ALFC-shadowUv${uuid})`}
            />
            {/* <path
                d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
                stroke={fill}
                fill="none"
            /> */}
            {/* <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" /> */}
            {/* <text
                x={ex + (cos >= 0 ? 1 : -1) * 12}
                y={ey}
                textAnchor={textAnchor}
                fill="#333"
            >{`PV ${value}`}</text> */}
            {/* <text
                x={ex + (cos >= 0 ? 1 : -1) * 12}
                y={ey}
                dy={18}
                textAnchor={textAnchor}
                fill="#999"
            >
                {`(Rate ${(percent * 100).toFixed(2)}%)`}
            </text> */}
        </g>
    );
};
type AllocationChartProps = {
    data: FarmWeightChartRecord[],
    radius: number
}
function AllocationChart({data, radius}: AllocationChartProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const onPieEnter = useCallback((_: any, index: number) => {
        setActiveIndex(index);
    }, []);
    const activeRecord = useMemo(() => {
        return data[activeIndex];
    }, [activeIndex, data]);
    return (
        <div className="relative w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={radius * 0.75}
                        outerRadius={radius}
                        fill="#8884d8"
                        dataKey="value"
                        onMouseEnter={onPieEnter}
                        stroke="transparent"
                    >
                        {data.map(d => {
                            return <Cell key={d.farmAddress} fill={d.color} />
                        })}
                        
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute left-1/2 top-1/2 flex flex-col justify-center items-center" style={{width: radius * 1.5, height: radius * 1.5, transform: `translate(-50%, -50%) scale(${Math.min(radius / 200, 1)})`}}>
                <div className="flex items-center mb-4">
                    <div className="w-4 h-4 mr-2.5" style={{backgroundColor: activeRecord.color}}></div>
                    <div className="font-bold text-2xl text-white">
                        {activeRecord.name}
                    </div>
                </div>
                <div className="font-semibold text-xs text-stake-gray-500 mb-3">
                    Weight
                </div>
                <div className="font-bold text-5xl text-white">{formatAmount(activeRecord.value)}%</div>
            </div>
        </div>
    );
}

export default AllocationChart;
