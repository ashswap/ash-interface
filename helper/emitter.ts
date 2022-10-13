import { GetTransactionsByHashesReturnType } from "@elrondnetwork/dapp-core/types";
import { TokenPayment, Transaction } from "@elrondnetwork/erdjs/out";
import mitt from "mitt";

type Events = {
    onTokenPaymentsSent: TokenPayment[],
    onCheckBatchResult: GetTransactionsByHashesReturnType 
};

const emitter = mitt<Events>();
export default emitter;
