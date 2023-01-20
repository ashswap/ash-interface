import { TokenPayment } from "@elrondnetwork/erdjs/out";
import { accAddressState } from "atoms/dappState";
import { DAPP_CONFIG } from "const/dappConfig";
import { ENVIRONMENT } from "const/env";
import { LKASH_CONTRACT, LK_ASH_COLLECTION, START_REWARD_POOL, UNLOCK_TS } from "const/mainnet";
import { fetcher } from "helper/common";
import { ContractManager } from "helper/contracts/contractManager";
import { sendTransactions } from "helper/transactionMethods";
import { IMetaESDT } from "interface/tokens";
import moment from "moment";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRecoilValue } from "recoil";
import useSWR from "swr";
import usePendingTxKey from "./usePendingTxKey";

const useUnlockBtn = () => {
    const pendingTxKey = usePendingTxKey();
    const userAddress = useRecoilValue(accAddressState);
    const {
        data: lkASHList,
        error,
        mutate,
    } = useSWR<IMetaESDT[]>(
        userAddress
            ? `${DAPP_CONFIG.apiAddress}/accounts/${userAddress}/nfts?collections=${LK_ASH_COLLECTION}&type=MetaESDT`
            : null,
        fetcher
    );
    const mutateRef = useRef(mutate);
    const unlockAllLKASH = useCallback(async () => {
        if (!lkASHList?.length) return;
        const txs = await Promise.all(
            lkASHList?.map((t) => {
                return ContractManager.getLKASHContract(
                    LKASH_CONTRACT
                ).unlockTokens(
                    TokenPayment.metaEsdtFromBigInteger(
                        t.collection,
                        t.nonce,
                        ENVIRONMENT.NETWORK === "mainnet" ? t.balance : 1e18,
                        t.decimals
                    )
                );
            })
        );
        sendTransactions({
            transactions: txs,
        });
    }, [lkASHList]);
    const disabled = useMemo(() => {
        return !lkASHList?.length || moment().unix() < UNLOCK_TS;
    }, [lkASHList]);

    useEffect(() => {
        mutateRef.current = mutate;
    }, [mutate])

    useEffect(() => {
        mutateRef.current?.();
    }, [pendingTxKey]);

    return { unlockAllLKASH, disabled, lkASHList };
};

export default useUnlockBtn;
