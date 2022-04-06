export const ChartLineX = ({
    label,
    y,
    width,
    height,
    left,
}: {
    label: string;
    y: number;
    width: number;
    height: number;
    left: number;
}) => {
    return (
        <>
            <line
                width={width}
                height={height}
                strokeDasharray="5, 5"
                x1={left}
                y1={y}
                x2={width}
                y2={y}
                strokeWidth={1}
                stroke="#FF005C"
            ></line>
            <rect
                x={width}
                y={y - 14}
                width="62"
                height="28"
                fill="#FF005C"
                className="transition-none"
            ></rect>
            <text
                x={width + 12}
                y={y}
                width="62"
                height="28"
                fill="white"
                // textAnchor="middle"
                alignmentBaseline="central"
                fontSize={12}
            >
                {label}
            </text>
        </>
        //   <svg width="600" height="1" version="1.1" xmlns="http://www.w3.org/2000/svg">

        // </svg>
    );
};
