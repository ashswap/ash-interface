import React, { useState } from "react";

const TxRecord = () => {
    return (
        <div
            className="px-7 h-12 bg-ash-dark-600 text-xs grid items-center"
            style={{ gridTemplateColumns: "2fr 0.8fr repeat(4, 1fr)" }}
        >
            <div className="text-pink-600">Swap USDC to ETH</div>
            <div className="text-right">
                <span className="text-ash-gray-600">$ </span>
                <span className="text-white">100,000,000,000</span>
            </div>
            <div className="text-right">
                <span className="text-white">100b USDC</span>
            </div>
            <div className="text-right">
                <span className="text-white">100b USDC</span>
            </div>
            <div className="text-right">
                <span className="text-pink-600">(0x761d38...5d60f3)</span>
            </div>
            <div className="text-right">
                <span className="text-white">34m ago</span>
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
function TxsTable() {
    const [filter, setFilter] = useState<EFilterType>(EFilterType.ALL);
    const [orderBy, setOrderBy] = useState<EOrderBy>(EOrderBy.TIME);
    return (
        <div>
            <div
                className="h-12 px-7 bg-ash-dark-600 text-ash-gray-600 grid text-xs items-center"
                style={{ gridTemplateColumns: "2fr 0.8fr repeat(4, 1fr)" }}
            >
                <div className="flex space-x-3">
                    <span
                        className={`cursor-pointer ${
                            filter === EFilterType.ALL && "text-white"
                        }`}
                    >
                        All
                    </span>
                    <span
                        className={`cursor-pointer ${
                            filter === EFilterType.SWAP && "text-white"
                        }`}
                    >
                        Swaps
                    </span>
                    <span
                        className={`cursor-pointer ${
                            filter === EFilterType.DEPOSIT && "text-white"
                        }`}
                    >
                        Deposits
                    </span>
                    <span
                        className={`cursor-pointer ${
                            filter === EFilterType.WITHDRAW && "text-white"
                        }`}
                    >
                        Withdraws
                    </span>
                </div>
                <div
                    className={`cursor-pointer text-right ${
                        orderBy === EOrderBy.VALUE && "text-white"
                    }`}
                >
                    Total Value
                </div>
                <div
                    className={`cursor-pointer text-right ${
                        orderBy === EOrderBy.TOKEN1 && "text-white"
                    }`}
                >
                    Token Amount
                </div>
                <div
                    className={`cursor-pointer text-right ${
                        orderBy === EOrderBy.TOKEN2 && "text-white"
                    }`}
                >
                    Token Amount
                </div>
                <div
                    className={`cursor-pointer text-right ${
                        orderBy === EOrderBy.WALLET && "text-white"
                    }`}
                >
                    Wallet
                </div>
                <div
                    className={`cursor-pointer text-right ${
                        orderBy === EOrderBy.TIME && "text-white"
                    }`}
                >
                    Time
                </div>
            </div>
            {[1, 2, 3, 4, 5].map((val) => {
                return <div key={val} className="border-t border-ash-dark-400">
                    <TxRecord  />
                </div>;
            })}
        </div>
    );
}

export default TxsTable;
