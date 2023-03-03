import { TokenPayment } from "@multiversx/sdk-core/out";
import { GetTransactionsByHashesReturnType } from "components/DappCoreCustom/getTransactionsByHashes";
import mitt from "mitt";

type Events = {
    onTokenPaymentsSent: TokenPayment[];
    onCheckBatchResult: GetTransactionsByHashesReturnType;
};

const emitter = mitt<Events>();
export default emitter;
