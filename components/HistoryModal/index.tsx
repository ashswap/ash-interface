import { AccountInfoSliceNetworkType } from "@multiversx/sdk-dapp/types";
import IconNewTab from "assets/svg/new-tab.svg";
import {
    accAddressState,
    accIsLoggedInState,
    networkConfigState,
} from "atoms/dappState";
import BaseModal from "components/BaseModal";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import pools from "const/pool";
import { toEGLD, toEGLDD } from "helper/balance";
import { fetcher } from "helper/common";
import { formatAmount } from "helper/number";
import { IESDTInfo } from "helper/token/token";
import { useScreenSize } from "hooks/useScreenSize";
import IPool from "interface/pool";
import { TxStatsRecord } from "interface/txStats";
import { useCallback, useEffect, useMemo } from "react";
import { useRecoilValue } from "recoil";
import useSWR from "swr";

const getTokenFromPools = (...pools: IPool[]) => {
    const map = new Map<string, IESDTInfo>();
    pools.map((pool) => {
        pool.tokens.map((token) => {
            map.set(token.identifier, token);
        });
    });
    return Array.from(map.values());
};
const TOKENS = getTokenFromPools(...pools);
interface Props {
    open: boolean;
    onClose?: () => void;
}
const emptyArray: TxStatsRecord[] = [];
const HistoryModal = ({ open, onClose }: Props) => {
    const loggedIn = useRecoilValue(accIsLoggedInState);
    const address = useRecoilValue(accAddressState);
    const { data: txHistory, mutate: refresh } = useSWR<TxStatsRecord[]>(
        loggedIn
            ? `${ASHSWAP_CONFIG.ashApiBaseUrl}/user/${address}/transaction?offset=0&limit=50`
            : null,
        (url) =>
            fetcher(url).then((data) =>
                Array.isArray(data) ? data : emptyArray
            ),
        { fallback: emptyArray }
    );
    const screenSize = useScreenSize();
    const network: AccountInfoSliceNetworkType =
        useRecoilValue(networkConfigState).network;

    const displayTx = useMemo(() => {
        return (txHistory || [])
            .map((record) => {
                const { action, transaction_hash } = record;
                const token1 = TOKENS.find(
                    (t) => t.identifier === record.token_id_1
                );
                const token2 = TOKENS.find(
                    (t) => t.identifier === record.token_id_2
                );
                const token3 = TOKENS.find(
                    (t) => t.identifier === record.token_id_3
                );
                switch (action) {
                    case "exchange":
                        if (
                            !record.amount_1 ||
                            !record.amount_2 ||
                            !token1 ||
                            !token2
                        ) {
                            return null;
                        }
                        return {
                            msg: `Swap ${toEGLD(
                                token1,
                                record.amount_1
                            ).decimalPlaces(7)} ${token1.symbol} to ${toEGLD(
                                token2,
                                record.amount_2
                            ).decimalPlaces(7)} ${token2.symbol}`,
                            txHash: transaction_hash,
                            status: "success",
                        };
                    case "addLiquidity":
                    case "removeLiquidity":
                        const msg = (
                            [
                                [token1, record.amount_1],
                                [token2, record.amount_2],
                                [token3, record.amount_3],
                            ] as [IESDTInfo, string][]
                        )
                            .map(([t, amt]) => {
                                if (!t || !amt) return "";
                                const egld = toEGLDD(t.decimals, amt);
                                return `${formatAmount(egld.toNumber())} ${
                                    t.symbol
                                }`;
                            })
                            .join(", ")
                            .replace(/, $/, "");
                        return {
                            msg: `${
                                action === "addLiquidity" ? "Add" : "Remove"
                            } ${msg}`,
                            txHash: transaction_hash,
                            status: "success",
                        };
                    default:
                        return null;
                }
            })
            .filter((val) => val !== null);
    }, [txHistory]);
    useEffect(() => {
        if (open) {
            refresh();
        }
    }, [open, refresh]);
    const openTransaction = useCallback(
        (txHash: string) => {
            if (typeof window !== "undefined") {
                window.open(
                    network.explorerAddress + "/transactions/" + txHash,
                    "_blank"
                );
            }
        },
        [network.explorerAddress]
    );

    return (
        <BaseModal
            isOpen={open}
            onRequestClose={() => onClose && onClose()}
            type={screenSize.msm ? "drawer_btt" : "modal"}
            className="clip-corner-4 clip-corner-tl bg-ash-dark-600 p-4 text-white sm:w-[32rem] w-full max-h-full sm:max-h-[80vh] mx-auto flex flex-col"
        >
            <div className="flex justify-end mb-3">
                <BaseModal.CloseBtn />
            </div>
            <div className="px-4 font-bold text-2xl mb-5">History</div>
            <div className="grow overflow-auto">
                <div className="px-4">
                    {displayTx.slice(0, 50).map((record) => {
                        if (!record) {
                            return null;
                        }
                        const { msg, status, txHash } = record;
                        return (
                            <div
                                key={txHash}
                                className={`flex flex-row justify-between py-3 text-xs sm:text-sm ${
                                    status === "success"
                                        ? "text-ash-green-500"
                                        : "text-ash-purple-500"
                                }`}
                            >
                                <div
                                    className="flex flex-row select-none cursor-pointer"
                                    onClick={() => openTransaction(txHash)}
                                >
                                    <div
                                        className={`shrink-0 mt-1.5 h-[5px] w-[5px] ${
                                            status === "success"
                                                ? "bg-ash-green-500"
                                                : "bg-ash-purple-500"
                                        }`}
                                    ></div>
                                    <div className="mx-4 text-sm font-bold hover:underline">
                                        {msg}
                                    </div>
                                </div>
                                <div
                                    className="select-none cursor-pointer"
                                    onClick={() => openTransaction(txHash)}
                                >
                                    <IconNewTab />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </BaseModal>
    );
};

export default HistoryModal;
