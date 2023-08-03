import { Interaction } from "@multiversx/sdk-core/out";
import { SendTransactionsPropsType } from "@multiversx/sdk-dapp/types";

export type DappSendTransactionsPropsType = Pick<
    Partial<SendTransactionsPropsType>,
    "signWithoutSending" | "transactionsDisplayInfo"
> & {
    interactions: Interaction[];
};
