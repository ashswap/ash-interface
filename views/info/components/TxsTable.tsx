import { AccountInfoSliceNetworkType } from "@elrondnetwork/dapp-core/types";
import ICArrowLeft from "assets/svg/arrow-left.svg";
import ICArrowRight from "assets/svg/arrow-right.svg";
import ICChevronDown from "assets/svg/chevron-down.svg";
import { networkConfigState } from "atoms/dappState";
import BigNumber from "bignumber.js";
import BasePopover from "components/BasePopover";
import { POOLS_MAP_ADDRESS } from "const/pool";
import { TOKENS_MAP } from "const/tokens";
import { toEGLDD } from "helper/balance";
import { formatAmount } from "helper/number";
import { IESDTInfo } from "helper/token/token";
import { TokenAmount } from "helper/token/tokenAmount";
import { useScreenSize } from "hooks/useScreenSize";
import { TxStatsRecord } from "interface/txStats";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";

const TxRecord = ({ txStats }: { txStats: TxStatsRecord }) => {
    const [time, setTime] = useState("");
    const network: AccountInfoSliceNetworkType =
        useRecoilValue(networkConfigState).network;

    const displayTx = useMemo(() => {
        const {
            action,
            transaction_hash,
            amount_1,
            amount_2,
            amount_3,
            token_id_1,
            token_id_2,
            token_id_3,
            receiver,
            lp_token_amount,
        } = txStats;
        const token1 = TOKENS_MAP[token_id_1];
        const token2 = TOKENS_MAP[token_id_2];
        const token3 = TOKENS_MAP[token_id_3];
        const pool = POOLS_MAP_ADDRESS[receiver];
        switch (action) {
            case "exchange":
                if (!amount_1 || !amount_2 || !token1 || !token2) {
                    return null;
                }
                return {
                    msg: `Swap ${toEGLDD(
                        token1.decimals,
                        amount_1
                    ).decimalPlaces(7)} ${token1.symbol} to ${toEGLDD(
                        token2.decimals,
                        amount_2
                    ).decimalPlaces(7)} ${token2.symbol}`,
                    txHash: transaction_hash,
                    status: "success",
                    tokensIn: [new TokenAmount(token1, amount_1)],
                    tokensOut: [new TokenAmount(token2, amount_2)],
                };
            case "addLiquidity":
            case "removeLiquidity":
                const tokenTuples = [
                    [token1, amount_1],
                    [token2, amount_2],
                    [token3, amount_3],
                ] as [IESDTInfo, string][];
                const msg = tokenTuples
                    .map(([t, amt]) => {
                        if (!t || !amt) return "";
                        const egld = toEGLDD(t.decimals, amt);
                        return `${formatAmount(egld.toNumber())} ${t.symbol}`;
                    })
                    .join(", ")
                    .replace(/, $/, "");
                const tokensIn = tokenTuples
                    .filter(([t, amt]) => {
                        const bigAmt = new BigNumber(amt || 0);
                        return !!t && bigAmt.gt(0);
                    })
                    .map(([t, amt]) => new TokenAmount(t, amt));
                const tokensOut = [
                    new TokenAmount(pool.lpToken, lp_token_amount || 0),
                ];
                return {
                    msg: `${
                        action === "addLiquidity" ? "Add" : "Remove"
                    } ${msg}`,
                    txHash: transaction_hash,
                    status: "success",
                    tokensIn: action === "addLiquidity" ? tokensIn : tokensOut,
                    tokensOut: action === "addLiquidity" ? tokensOut : tokensIn,
                };
            default:
                return null;
        }
    }, [txStats]);
    useEffect(() => {
        const ts = moment.unix(txStats.timestamp);
        const func = () => {
            const d = moment().diff(ts, "days");
            const h = moment().diff(ts, "hours");
            const m = moment().diff(ts, "minutes");
            const s = moment().diff(ts, "seconds");
            const num = d || h || m || s;
            const postfix =
                (d && "d") || (h && "h") || (m && "m") || (s && "s") || "";
            setTime(num + postfix + " ago");
        };
        func();
        const interval = setInterval(() => {
            func();
        }, 10000);
        return () => clearInterval(interval);
    }, [txStats]);

    return (
        <div className="px-4 lg:px-7 py-1 min-h-[3rem] bg-ash-dark-600 hover:bg-ash-dark-700 text-xs grid items-center gap-x-4 grid-cols-[2fr,repeat(2,1fr)] md:grid-cols-[2fr,repeat(4,1fr)] xl:grid-cols-[2fr,0.8fr,repeat(4,1fr)]">
            <div>
                <a
                    href={`${network.explorerAddress}/transactions/${txStats.transaction_hash}`}
                    target="_blank"
                    rel="noreferrer"
                >
                    <span className="text-pink-600">{displayTx?.msg}</span>
                </a>
            </div>
            <div className="text-right">
                <span className="text-ash-gray-600">$ </span>
                <span className="text-white">
                    {formatAmount(txStats.txValue || 0)}
                </span>
            </div>
            <div className="text-right hidden md:block">
                {displayTx?.tokensIn.map((t) => {
                    return (
                        <div key={t.token.identifier} className="text-white">
                            {formatAmount(t.egld)} {t.token.symbol}
                        </div>
                    );
                })}
            </div>
            <div className="text-right hidden md:block">
                {displayTx?.tokensOut.map((t) => {
                    return (
                        <div key={t.token.identifier} className="text-white">
                            {formatAmount(t.egld)} {t.token.symbol}
                        </div>
                    );
                })}
            </div>
            <div className="text-right hidden xl:block">
                <a
                    href={`${network.explorerAddress}/accounts/${txStats.caller}`}
                    target="_blank"
                    rel="noreferrer"
                >
                    <span className="text-pink-600">
                        {txStats.caller.slice(0, 4)}...
                        {txStats.caller.slice(-4)}
                    </span>
                </a>
            </div>
            <div className="text-right">
                <span className="text-white">{time}</span>
            </div>
        </div>
    );
};
enum EFilterType {
    ALL,
    SWAP,
    DEPOSIT,
    WITHDRAW,
}
enum EOrderBy {
    VALUE,
    TOKEN1,
    TOKEN2,
    WALLET,
    TIME,
}
const filterMap: Record<TxStatsRecord["action"], EFilterType> = {
    exchange: EFilterType.SWAP,
    addLiquidity: EFilterType.DEPOSIT,
    removeLiquidity: EFilterType.WITHDRAW,
};
const filterOptions = [
    { label: "All", value: EFilterType.ALL },
    { label: "Swaps", value: EFilterType.SWAP },
    { label: "Deposits", value: EFilterType.DEPOSIT },
    { label: "Withdraws", value: EFilterType.WITHDRAW },
];
function TxsTable({ data: dataProps }: { data: TxStatsRecord[] }) {
    const [filter, setFilter] = useState<EFilterType>(EFilterType.ALL);
    const [orderBy, setOrderBy] = useState<EOrderBy>(EOrderBy.TIME);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const screenSize = useScreenSize();
    const data = useMemo(() => dataProps.filter(tx => tx.caller && tx.action && tx.timestamp), [dataProps]);
    useEffect(() => {
        setOrderBy(EOrderBy.TIME);
    }, [screenSize.xl, screenSize.lg, screenSize.md, screenSize.sm]);
    const displayDataPagination = useMemo(() => {
        setPageIndex(0);
        if (!data) return [[]];
        const filtered =
            filter === EFilterType.ALL
                ? data
                : data.filter((val) => filterMap[val.action] === filter);
        const sorted = filtered
            .map((tx) => {
                switch (tx.action) {
                    case "addLiquidity":
                    case "removeLiquidity":
                        tx.txValue =
                            (tx.amount_1_usd || 0) +
                            (tx.amount_2_usd || 0) +
                            (tx.amount_3_usd || 0);
                        break;
                    case "exchange":
                        tx.txValue = tx.amount_1_usd;
                        break;
                    default:
                        tx.txValue = 0;
                }
                return tx;
            })
            .sort((x, y) => {
                switch (orderBy) {
                    case EOrderBy.VALUE:
                        return y.txValue! - x.txValue!;
                    case EOrderBy.TOKEN1:
                        const xAmt1 = x.amount_1;
                        const yAmt1 = y.amount_1;
                        const tokenX1 = TOKENS_MAP[x.token_id_1];
                        const tokenY1 = TOKENS_MAP[y.token_id_2];
                        return toEGLDD(tokenY1.decimals, yAmt1)
                            .minus(toEGLDD(tokenX1.decimals, xAmt1))
                            .toNumber();
                    case EOrderBy.TOKEN2:
                        const xAmt2 = x.amount_2;
                        const yAmt2 = y.amount_2;
                        const tokenX2 = TOKENS_MAP[x.token_id_2];
                        const tokenY2 = TOKENS_MAP[y.token_id_2];
                        return toEGLDD(tokenY2.decimals, yAmt2)
                            .minus(toEGLDD(tokenX2.decimals, xAmt2))
                            .toNumber();
                    case EOrderBy.WALLET:
                        return y.caller > x.caller
                            ? 1
                            : y.caller === x.caller
                            ? 0
                            : -1;
                    case EOrderBy.TIME:
                    default:
                        return y.timestamp - x.timestamp;
                }
            });
        const length = sorted.length;
        const nPage = Math.ceil(length / pageSize);
        const pagination: TxStatsRecord[][] = [];
        for (let i = 0; i < nPage; i++) {
            pagination.push(
                sorted.slice(i * pageSize, i * pageSize + pageSize)
            );
        }
        setPageIndex((val) => (pagination.length < val + 1 ? 0 : val));
        return pagination;
    }, [data, filter, orderBy, pageSize]);
    return (
        <div>
            <div className="h-12 px-4 lg:px-7 bg-ash-dark-600 text-ash-gray-600 grid text-2xs lg:text-xs items-center gap-x-4 grid-cols-[2fr,repeat(2,1fr)] md:grid-cols-[2fr,repeat(4,1fr)] xl:grid-cols-[2fr,0.8fr,repeat(4,1fr)]">
                <div>
                    <div className="hidden xl:flex space-x-3">
                        <span
                            className={`cursor-pointer ${
                                filter === EFilterType.ALL && "text-white"
                            }`}
                            onClick={() => setFilter(EFilterType.ALL)}
                        >
                            All
                        </span>
                        <span
                            className={`cursor-pointer ${
                                filter === EFilterType.SWAP && "text-white"
                            }`}
                            onClick={() => setFilter(EFilterType.SWAP)}
                        >
                            Swaps
                        </span>
                        <span
                            className={`cursor-pointer ${
                                filter === EFilterType.DEPOSIT && "text-white"
                            }`}
                            onClick={() => setFilter(EFilterType.DEPOSIT)}
                        >
                            Deposits
                        </span>
                        <span
                            className={`cursor-pointer ${
                                filter === EFilterType.WITHDRAW && "text-white"
                            }`}
                            onClick={() => setFilter(EFilterType.WITHDRAW)}
                        >
                            Withdraws
                        </span>
                    </div>
                    <div className="block xl:hidden">
                        <BasePopover
                            className="absolute w-full text-white left-0"
                            button={({ open }) => (
                                <button
                                    className={`transition ease-in-out duration-200 w-full h-7 px-2.5 flex items-center justify-between ${
                                        open
                                            ? " text-white"
                                            : "bg-ash-dark-400 text-ash-gray-500"
                                    }`}
                                >
                                    <span className="font-bold text-xs mr-2">
                                        <span className="text-white">
                                            {
                                                filterOptions.find(
                                                    (opt) =>
                                                        opt.value === filter
                                                )?.label
                                            }
                                        </span>
                                    </span>
                                    <ICChevronDown className="w-2 h-auto text-pink-600" />
                                </button>
                            )}
                        >
                            {({ close }) => (
                                <ul className="bg-ash-dark-700 py-6">
                                    {filterOptions.map((opt) => {
                                        return (
                                            <li
                                                key={opt.value}
                                                className="relative"
                                            >
                                                <button
                                                    className="w-full py-3 text-left px-6"
                                                    onClick={() => {
                                                        setFilter(opt.value);
                                                        close();
                                                    }}
                                                >
                                                    {opt.label}
                                                </button>
                                                {opt.value === filter && (
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
                <div
                    className={`cursor-pointer text-right ${
                        orderBy === EOrderBy.VALUE && "text-white"
                    }`}
                    onClick={() => setOrderBy(EOrderBy.VALUE)}
                >
                    Total Value
                </div>
                <div
                    className={`cursor-pointer text-right hidden md:block ${
                        orderBy === EOrderBy.TOKEN1 && "text-white"
                    }`}
                    onClick={() => setOrderBy(EOrderBy.TOKEN1)}
                >
                    Token Amount
                </div>
                <div
                    className={`cursor-pointer text-right hidden md:block ${
                        orderBy === EOrderBy.TOKEN2 && "text-white"
                    }`}
                    onClick={() => setOrderBy(EOrderBy.TOKEN2)}
                >
                    Token Amount
                </div>
                <div
                    className={`cursor-pointer text-right hidden xl:block ${
                        orderBy === EOrderBy.WALLET && "text-white"
                    }`}
                    onClick={() => setOrderBy(EOrderBy.WALLET)}
                >
                    Wallet
                </div>
                <div
                    className={`cursor-pointer text-right ${
                        orderBy === EOrderBy.TIME && "text-white"
                    }`}
                    onClick={() => setOrderBy(EOrderBy.TIME)}
                >
                    Time
                </div>
            </div>
            {displayDataPagination[pageIndex]?.map((val) => {
                return (
                    <div
                        key={val.transaction_hash}
                        className="border-t border-ash-dark-400"
                    >
                        <TxRecord txStats={val} />
                    </div>
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
                        {displayDataPagination.length}
                    </span>
                </div>
                <button
                    className={`p-1 ${
                        pageIndex === displayDataPagination.length - 1
                            ? "text-white/20 pointer-events-none"
                            : "text-pink-600"
                    }`}
                    disabled={pageIndex === displayDataPagination.length - 1}
                    onClick={() => setPageIndex((i) => i + 1)}
                >
                    <ICArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default TxsTable;
