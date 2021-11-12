import { useState } from "react";
import Panel, { PanelContent } from "components/Panel";
import IPool from "interface/pool";
import Down from "assets/svg/down-white.svg";
import styles from "./PoolCard.module.css";
import Button from "components/Button";
import AddLiquidityModal from "components/AddLiquidityModal";
import { theme } from "tailwind.config";
import RemoveLiquidityModal from "components/RemoveLiquidityModal";

interface Props {
    pool: IPool;
    type: "deposit" | "withdraw";
    className?: string | undefined;
}

const PoolCard = (props: Props) => {
    const [isExpand, setIsExpand] = useState<boolean>(false);
    const [openAddLiquidity, setOpenAddLiquidity] = useState<boolean>(false);
    const [openRemoveLiquidity, setOpenRemoveLiquidity] = useState<boolean>(false);

    return (
        <Panel className={`${props.className || ""}`} topRightCorner>
            <PanelContent className={`${styles.content}`}>
                <div className="flex flex-row justify-between items-start">
                    <div>
                        <div className="text-text-input-3 text-xs pb-2.5">
                            {props.type === "deposit"
                                ? "Deposit"
                                : "Your Liquidity"}
                        </div>
                        {props.type === "deposit" ? (
                            <div className="flex flex-row items-baseline text-2xl font-bold">
                                <span>{props.pool.tokens[0].name}</span>
                                <span className="text-sm px-3">&</span>
                                <span>{props.pool.tokens[1].name}</span>
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-row items-baseline text-2xl font-bold">
                                    {props.pool.tokens[0].name}
                                </div>
                                <div className="text-earn font-bold text-lg">
                                    1.52
                                </div>
                            </>
                        )}
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <div
                            className={styles.tokenIcon}
                            style={{
                                backgroundColor: props.pool.tokens[0].icon
                            }}
                        ></div>
                        <div
                            className={styles.tokenIcon}
                            style={{
                                backgroundColor: props.pool.tokens[1].icon,
                                marginLeft: "-10px"
                            }}
                        ></div>
                    </div>
                </div>
                {props.type === "deposit" ? (
                    <>
                        <div className="flex flex-row my-12 justify-between items-center">
                            <div>
                                <div className="text-text-input-3 text-xs mb-4">
                                    APR Earn
                                </div>
                                <div className="text-yellow-600 font-bold text-lg">
                                    921%
                                </div>
                            </div>
                            <div>
                                <div className="text-text-input-3 text-xs mb-4">
                                    Farming per day
                                </div>
                                <div>
                                    <span className="text-earn font-bold text-lg">
                                        0.52
                                    </span>
                                    <span className="text-xs font-normal">
                                        {" "}
                                        <span className="text-earn">
                                            {props.pool.tokens[0].name}
                                        </span>{" "}
                                        per 1,000 {props.pool.tokens[1].name}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Button
                            bottomRightCorner
                            style={{ height: 56 }}
                            textClassName="text-sm"
                            onClick={() => setOpenAddLiquidity(true)}
                        >
                            Deposit
                        </Button>
                    </>
                ) : (
                    <>
                        <div className="flex flex-row my-12 justify-between items-center">
                            <div style={{ paddingRight: 42 }}>
                                <div className="flex flex-row items-baseline text-2xl font-bold">
                                    {props.pool.tokens[1].name}
                                </div>
                                <div className="text-earn font-bold text-lg">
                                    1.52
                                </div>
                            </div>
                            <div>
                                <div className="text-text-input-3 text-xs mb-4">
                                    Your capacity
                                </div>
                                <div className="text-white font-bold text-lg">
                                    0.002%
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row items-center font-bold text-xs">
                            <div
                                className="text-yellow-600 underline select-none"
                                style={{
                                    paddingRight: 42,
                                    textDecorationColor:
                                        theme.extend.colors.yellow[600]
                                }}
                            >
                                <span className="cursor-pointer" onClick={() => setOpenRemoveLiquidity(true)}>Withdraw</span>
                            </div>
                            <div
                                className="text-pink-600 underline select-none"
                                style={{
                                    textDecorationColor:
                                        theme.extend.colors.pink[600]
                                }}
                            >
                                <span className="cursor-pointer" onClick={() => setOpenAddLiquidity(true)}>
                                    Deposit more
                                </span>
                            </div>
                        </div>
                    </>
                )}

                <div className="bg-bg my-4 text-text-input-3">
                    <div className="flex flex-row justify-between items-center p-4">
                        <div className={styles.poolInfoLabel}>
                            Total Liquidity
                        </div>
                        <div className="text-sm">$512,913,133</div>
                    </div>
                    <div className="flex flex-row justify-between items-center p-4">
                        <div className={styles.poolInfoLabel}>24H Volume</div>
                        <div className="text-sm">$12,913,133</div>
                    </div>
                    {isExpand && (
                        <>
                            <div className="flex flex-row justify-between items-center p-4">
                                <div className={styles.poolInfoLabel}>
                                    Performance Fee
                                </div>
                                <div className="text-sm">2%</div>
                            </div>
                            <div className="flex flex-row justify-between items-center p-4">
                                <div className={styles.poolInfoLabel}>
                                    Trading APR
                                </div>
                                <div className="text-sm">32%</div>
                            </div>
                            <div className="flex flex-row justify-between items-center p-4">
                                <div className={styles.poolInfoLabel}>
                                    Emissions APR
                                </div>
                                <div className="text-sm">51%</div>
                            </div>
                        </>
                    )}
                </div>

                <div
                    className="flex flex-row justify-center items-center select-none cursor-pointer py-2"
                    onClick={() => setIsExpand(!isExpand)}
                >
                    <div className="font-bold text-sm mr-2">Detail</div>
                    <Down
                        style={{
                            transform: `rotate(${isExpand ? "180" : "0"}deg)`
                        }}
                    />
                </div>

                <AddLiquidityModal
                    open={openAddLiquidity}
                    onClose={() => setOpenAddLiquidity(false)}
                    pool={props.pool}
                />
                <RemoveLiquidityModal
                    open={openRemoveLiquidity}
                    onClose={() => setOpenRemoveLiquidity(false)}
                    pool={props.pool}
                />
            </PanelContent>
        </Panel>
    );
};

export default PoolCard;