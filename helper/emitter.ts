import { TokenTransfer } from "@multiversx/sdk-core/out";
import { GetTransactionsByHashesReturnType } from "components/DappCoreCustom/getTransactionsByHashes";
import mitt from "mitt";

type Events = {
    onTokenPaymentsSent: TokenTransfer[];
    onCheckBatchResult: GetTransactionsByHashesReturnType;
};

const emitter = mitt<Events>();
export default emitter;
