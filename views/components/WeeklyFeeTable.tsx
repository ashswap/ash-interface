import ICArrowLeft from "assets/svg/arrow-left.svg";
import ICArrowRight from "assets/svg/arrow-right.svg";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { fetcher } from "helper/common";
import { formatAmount } from "helper/number";
import moment from "moment";
import { useMemo, useState } from "react";
import useSWR from "swr";
type FeeRecord = {
    from_timestamp: number;
    to_timestamp: number;
    total_admin_fee_in_usd: number;
};
const Row = ({ order, feeData }: { order: number; feeData: FeeRecord }) => {
    const from = useMemo(() => {
        return moment.unix(feeData.from_timestamp);
    }, [feeData.from_timestamp]);
    const to = useMemo(() => {
        return moment.unix(feeData.to_timestamp);
    }, [feeData.to_timestamp]);
    return (
        <div className="grid grid-cols-[2rem,1fr,1fr] gap-x-4 sm:gap-x-8 lg:gap-x-28 items-center h-12 bg-ash-dark-600 px-4.5 lg:px-6 text-stake-gray-500 text-xs">
            <div className="text-right">{order}</div>
            <div className="">
                {/* <span className="text-white">{from.format("DD MMM, ")}</span>
                <span>{from.format("yyyy")}</span>
                <span> - </span>
                <span className="text-white">{to.format("DD MMM, ")}</span>
                <span>{to.format("yyyy")}</span> */}
                <span className="text-white">{from.format("DD MMM, ")}</span>
                <span>{from.format("YYYY")}</span>
            </div>
            <div className="text-right">
                $
                <span className="text-white">
                    {formatAmount(feeData.total_admin_fee_in_usd)}
                </span>
            </div>
        </div>
    );
};
function WeeklyFeeTable() {
    // testing/BoY purpose: currently calculate fee every 10 minutes -> should get x*7*24*60/10 records from server
    const { data } = useSWR<FeeRecord[]>(
        `${
            ASHSWAP_CONFIG.ashApiBaseUrl
        }/stake/governance/summary?offset=0&limit=${(10 * 7 * 24 * 60) / 10}`,
        fetcher
    );
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const records = useMemo(() => {
        const map: Record<number, FeeRecord[]> = {};
        (data || []).map((val) => {
            const key = moment
                .unix(val.from_timestamp)
                .utc()
                // for BoY only
                // .weekday(0)
                .endOf("days")
                .unix();
            map[key] = [...(map[key] || []), val];
        });
        return Object.entries(map)
            .map(([k, val]) => {
                const sum = val.reduce(
                    (total, feeRecord) =>
                        total + feeRecord.total_admin_fee_in_usd,
                    0
                );
                const record: FeeRecord = {
                    from_timestamp: val[val.length - 1].from_timestamp,
                    to_timestamp: val[0].to_timestamp,
                    total_admin_fee_in_usd: sum,
                };
                return record;
            })
            .sort((x, y) => y.from_timestamp - x.from_timestamp);
    }, [data]);
    const displayRecords: FeeRecord[][] = useMemo(() => {
        const length = records.length;
        const nPage = Math.ceil(length / pageSize);
        const pagination: FeeRecord[][] = [];
        for (let i = 0; i < nPage; i++) {
            pagination.push(
                records.slice(i * pageSize, i * pageSize + pageSize)
            );
        }
        setPageIndex((val) => (pagination.length < val + 1 ? 0 : val));
        return pagination;
    }, [records, pageSize]);
    return (
        <div>
            <div className="grid grid-cols-[2rem,1fr,1fr] gap-x-4 sm:gap-x-8 lg:gap-x-28 items-center h-12 bg-ash-dark-600 px-4.5 lg:px-6 text-stake-gray-500 text-xs">
                <div className="text-right">#</div>
                <div className="">Time</div>
                <div className="text-right">Fees</div>
            </div>
            {displayRecords[pageIndex]?.map((val, index) => {
                return (
                    <Row
                        key={val.from_timestamp}
                        order={pageIndex * pageSize + index + 1}
                        feeData={val}
                    />
                );
            })}
            <div className="bg-ash-dark-600 h-14 flex items-center justify-center text-xs">
                <button
                    className={`p-1 ${
                        pageIndex === 0
                            ? "text-white/20 pointer-events-none"
                            : "text-pink-600"
                    }`}
                    disabled={pageIndex === 0}
                    onClick={() => setPageIndex((i) => i - 1)}
                >
                    <ICArrowLeft className="w-4 h-4" />
                </button>
                <div className="px-6">
                    <span className="text-white">{pageIndex + 1}</span>
                    <span className="text-ash-gray-500">/</span>
                    <span className="text-ash-gray-500">
                        {displayRecords.length}
                    </span>
                </div>
                <button
                    className={`p-1 ${
                        pageIndex === displayRecords.length - 1
                            ? "text-white/20 pointer-events-none"
                            : "text-pink-600"
                    }`}
                    disabled={pageIndex === displayRecords.length - 1}
                    onClick={() => setPageIndex((i) => i + 1)}
                >
                    <ICArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default WeeklyFeeTable;
