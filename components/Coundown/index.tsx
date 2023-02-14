import moment from "moment";
import React, { useEffect, useState } from "react";

const CountBlock = ({ num, small = false }: { num: number; small?: boolean }) => {
    return (
        <div className="relative">
            <div className={`bg-white -skew-x-12 ${small ? "w-[18px] h-[24px] sm:w-[24px] sm:h-[32px]" : " w-[36px] h-[45px] sm:w-[60px] sm:h-[75px] lg:w-[80px] lg:h-[100px]"}`}></div>
            <div className={`absolute inset-0 flex items-center justify-center font-bold text-ash-dark-400 ${small ? "text-sm sm:text-base" : "text-4xl sm:text-5xl lg:text-7xl"}`}>
                {num}
            </div>
        </div>
    );
};
function Countdown({ timestamp, small = false }: { timestamp: number, small?: boolean }) {
    const [remainArr, setRemainArr] = useState<number[][]>(
        new Array(4).fill([0, 0])
    );
    useEffect(() => {
        const func = () => {
            const duration = moment.duration(
                moment.unix(timestamp).diff(moment())
            );
            if (duration.milliseconds() > 0) {
                const d = Math.floor(duration.asDays());
                const h = duration.hours();
                const m = duration.minutes();
                const s = duration.seconds();
                setRemainArr(
                    [d, h, m, s].map((val) => [Math.floor(val / 10), val % 10])
                );
            } else {
                setRemainArr(new Array(4).fill([0, 0]));
            }
        };
        func();
        const interval = setInterval(() => {
            func();
        }, 1000);
        return () => clearInterval(interval);
    }, [timestamp]);
    return (
        <div>
            <div className={`flex ${small ? "mb-1" : "mb-1.5 sm:mb-4"}`}>
            {remainArr.map(([n1, n2], i) => {
                return (
                    <div key={i} className="flex">
                        <div className={`flex ${small ? "space-x-[1px]" : "space-x-1"}`}>
                            <CountBlock num={n1} small={small} />
                            <CountBlock num={n2} small={small} />
                            
                        </div>
                        {i < remainArr.length - 1 && (
                                <div className={`flex flex-col justify-center items-center ${small ? "space-y-0.5 mx-1 sm:mx-1.5" : "space-y-1 lg:space-y-2 mx-2 sm:mx-4 lg:mx-5"}`}>
                                    <div className={`bg-white ${small ? "w-0.5 h-0.5" : "w-1 h-1 lg:w-2 lg:h-2"}`}></div>
                                    <div className={`bg-white ${small ? "w-0.5 h-0.5" : "w-1 h-1 lg:w-2 lg:h-2"}`}></div>
                                </div>
                            )}
                    </div>
                );
            })}
        </div>
        <div className={`flex justify-around ${small ? "space-x-4 text-2xs sm:text-sm" : "space-x-5 sm:space-x-9 lg:space-x-12 text-2xs sm:text-xs lg:text-sm"}`}>
            <div className="text-white font-bold flex-1 text-center">days</div>
            <div className="text-white font-bold flex-1 text-center">{small ? "hrs" : "hours"}</div>
            <div className="text-white font-bold flex-1 text-center">{small ? "mins" : "minutes"}</div>
            <div className="text-white font-bold flex-1 text-center">{small ? "secs" : "seconds"}</div>
        </div>
        </div>
    );
}

export default Countdown;
