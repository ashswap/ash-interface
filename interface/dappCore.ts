import { SendTransactionsPropsType } from "@elrondnetwork/dapp-core/types";
import { Transaction } from "@elrondnetwork/erdjs/out";
import { Modify } from "./utilities";

export type DappSendTransactionsPropsType = Modify<
    Modify<SendTransactionsPropsType, {transactions: Transaction | Transaction[]}>,
    Pick<
        Partial<SendTransactionsPropsType>,
        "signWithoutSending" | "transactionsDisplayInfo"
    >
>;
