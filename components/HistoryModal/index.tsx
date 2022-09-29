import { AccountInfoSliceNetworkType } from "@elrondnetwork/dapp-core/types";
import { getNetworkConfig } from "@elrondnetwork/dapp-core/utils";
import IconNewTab from "assets/svg/new-tab.svg";
import {
    accAddressState,
    accIsLoggedInState,
    networkConfigState,
} from "atoms/dappState";
import BaseModal from "components/BaseModal";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { ENVIRONMENT } from "const/env";
import pools from "const/pool";
import { toEGLD } from "helper/balance";
import { fetcher } from "helper/common";
import { IESDTInfo } from "helper/token/token";
import { useScreenSize } from "hooks/useScreenSize";
import IPool from "interface/pool";
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
interface TXRecord {
    txHash: string;
    gasLimit: number;
    gasPrice: number;
    gasUsed: number;
    miniBlockHash: string;
    nonce: number;
    receiver: string;
    receiverShard: number;
    round: number;
    sender: string;
    senderShard: number;
    signature: string;
    status: string;
    value: string;
    fee: string;
    timestamp: number;
    data: string;
    function: string;
    action: {
        category: string;
        name: string;
        description: string;
        arguments: {
            transfers: {
                type: string;
                name: string;
                ticker: string;
                token: string;
                decimals: number;
                value: string;
            }[];
            receiver: string;
            functionName: string;
            functionArgs: string[];
        };
    }
}

const actions = ["exchange", "addLiquidity", "removeLiquidity"];
const receiver = pools.map((p) => p.address);
const actionMap = {
    exchange: "Swap",
    addLiquidity: "Add liquidity",
    removeLiquidity: "Remove liquidity",
};
const HistoryModal = ({ open, onClose }: Props) => {
    const loggedIn = useRecoilValue(accIsLoggedInState);
    const address = useRecoilValue(accAddressState);
    const network: AccountInfoSliceNetworkType =
        useRecoilValue(networkConfigState).network;
    const { data: txHistory, mutate: refresh } = useSWR<TXRecord[]>(
        loggedIn
            ? `${network.apiAddress}/transactions?function=${actions.join(
                  ","
              )}&sender=${address}&receiver=${receiver.join(",")}&size=50`
            : null,
        fetcher
    );
    const screenSize = useScreenSize();

    const displayTx = useMemo(() => {
        return (txHistory || [])
            .map((record) => {
                const { function: func, txHash, status } = record;
                const pool = pools.find((p) => p.address === record.action.arguments.receiver);
                if(!pool) return null;
                return {
                    msg: `${
                        actionMap[func as keyof typeof actionMap]
                    } on pool ${pool?.tokens.map((t) => t.symbol).join("-")}.`,
                    txHash,
                    status,
                };
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
