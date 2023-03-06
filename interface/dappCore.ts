import { SendTransactionsPropsType } from "@multiversx/sdk-dapp/types";
import { Transaction } from "@multiversx/sdk-core/out";
import { Modify } from "./utilities";

export type DappSendTransactionsPropsType = Modify<
    Modify<
        SendTransactionsPropsType,
        { transactions: Transaction | Transaction[] }
    >,
    Pick<
        Partial<SendTransactionsPropsType>,
        "signWithoutSending" | "transactionsDisplayInfo"
    >
>;
