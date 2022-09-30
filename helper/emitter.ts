import { TokenPayment, Transaction } from "@elrondnetwork/erdjs/out";
import mitt from "mitt";

type Events = {
    onTokenPaymentsSent: TokenPayment[]
};

const emitter = mitt<Events>();
export default emitter;
