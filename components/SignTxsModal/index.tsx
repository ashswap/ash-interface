import { useSignTransactions } from "@elrondnetwork/dapp-core";
import React from "react";
// listen for the txs to be signed in queue, if the queue is not empty prompt the modal for user
function SignTxsModal() {
    // ! useSignTransactions auto invoke provider for signing hence just use the hook only in once place globlally
    const {} = useSignTransactions();
    return <div></div>;
}

export default SignTxsModal;
