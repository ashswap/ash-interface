import Modal from "components/Modal";
import { network } from "const/network";
import { useWallet } from "context/wallet";
import { toEGLD } from "helper/balance";
import styles from "./HistoryModal.module.css";
import pools from "const/pool";
import IconNewTab from "assets/svg/new-tab.svg";

interface Props {
    open?: boolean;
    onClose?: () => void;
}

const HistoryModal = ({ open, onClose }: Props) => {
    const { transactionsHistory } = useWallet();

    const openTransaction = (txHash: string) => {
        window.open(
            network.explorerAddress +
                "/transactions/" +
                txHash,
            "_blank"
        )
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            contentClassName={styles.content}
            dark="650"
            contentStyle={{ width: 350 }}
        >
            <div className="font-bold text-2xl">History</div>
            {transactionsHistory.slice(0, 7).map((d: any, i: number) => {
                if (!d.action || !d.action.arguments) {
                    return null;
                }

                const { functionName } = d.action.arguments;
                if (functionName !== "exchange") {
                    return null;
                }

                const status = d.status === "success" ? "succeed" : "failed";

                let extraInfo = "";
                const pool = pools.find(pool => pool.address === d.receiver);

                // invalid pool
                if (!pool) {
                    return null;
                }

                // not transfer token
                if (d.action.arguments.transfers.length === 0) {
                    return null;
                }

                const swapFromToken = d.action.arguments.transfers[0].token;
                let tokenFrom = pool.tokens.find(t => t.id === swapFromToken);
                if (!tokenFrom) {
                    return null;
                }
                const swapFromValue = d.action.arguments.transfers[0].value;

                const swapToValue = d.tokenValue;
                const swapToToken = d.tokenIdentifier;
                let tokenTo = pool.tokens.find(t => t.id === swapToToken);
                if (!tokenTo) {
                    return null;
                }

                extraInfo +=
                    toEGLD(tokenFrom, swapFromValue).toFixed(3) +
                    " " +
                    tokenFrom.name +
                    " to " +
                    toEGLD(tokenTo, swapToValue).toFixed(3) +
                    " " +
                    tokenTo.name;

                return (
                    <div
                        key={i}
                        style={{ color: "#00FF75" }}
                        className="flex flex-row justify-between items-center my-3"
                    >
                        <div className="flex flex-row select-none cursor-pointer" onClick={() => openTransaction(d.txHash)}>
                            <div
                                className={`mt-1.5 ${styles.dot} ${styles.greenDot}`}
                            ></div>
                            <div className="mx-4 hover:underline">{`Swap ${status} ${extraInfo}`}</div>
                        </div>
                        <div
                            className="select-none cursor-pointer"
                            onClick={() => openTransaction(d.txHash)}
                        >
                            <IconNewTab />
                        </div>
                    </div>
                );
            })}
        </Modal>
    );
};

export default HistoryModal;
