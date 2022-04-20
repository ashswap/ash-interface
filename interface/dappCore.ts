import { SendTransactionsPropsType } from "@elrondnetwork/dapp-core";
import { Modify } from "./utilities";

export type DappSendTransactionsPropsType = Modify<
    SendTransactionsPropsType,
    Pick<
        Partial<SendTransactionsPropsType>,
        "signWithoutSending" | "transactionsDisplayInfo"
    >
>;
