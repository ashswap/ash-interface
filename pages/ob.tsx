import { useGetAccountProvider } from "@elrondnetwork/dapp-core/hooks";
import {
    Address, SignableMessage
} from "@elrondnetwork/erdjs/out";
import { accAddressState } from "atoms/dappState";
import axios from "axios";
import BigNumber from "bignumber.js";
import BasicLayout from "components/Layout/Basic";
import ExchangeContract, { Order } from "helper/contracts/exchange";
import { sendTransactions } from "helper/transactionMethods";
import createKeccakHash from "keccak";
import moment from "moment";
import { useCallback, useState } from "react";
import { useRecoilValue } from "recoil";

function bitLength(number: number) {
    return Math.floor(Math.log2(number)) + 1;
}

function byteLength(number: number) {
    return Math.ceil(bitLength(number) / 8);
}

function toBytes(number: number, length?: number) {
    if (!Number.isSafeInteger(number)) {
        throw new Error("Number is out of range");
    }

    const size = number === 0 ? 0 : byteLength(number);
    const bytes = new Uint8ClampedArray(size);
    let x = number;
    for (let i = size - 1; i >= 0; i--) {
        const rightByte = x & 0xff;
        bytes[i] = rightByte;
        x = Math.floor(x / 0x100);
    }
    if(typeof length === "number" && length > bytes.buffer.byteLength){
        return Buffer.concat([Buffer.from(new Array(length - bytes.buffer.byteLength).fill(0)), Buffer.from(bytes.buffer)]).buffer;
    }

    return bytes.buffer;
}

function fromBytes(buffer: ArrayBufferLike) {
    const bytes = new Uint8ClampedArray(buffer);
    const size = bytes.byteLength;
    let x = 0;
    for (let i = 0; i < size; i++) {
        const byte = bytes[i];
        x *= 0x100;
        x += byte;
    }
    return x;
}
function TestOB() {
    const accProvider = useGetAccountProvider();
    const userAddress = useRecoilValue(accAddressState);
    const [kind, setKind] = useState("");

    const [buyToken, setBuyToken] = useState("");
    const [buyAmount, setBuyAmount] = useState("");
    const [sellToken, setSellToken] = useState("");
    const [sellAmount, setSellAmount] = useState("");

    const signMsg = useCallback(async () => {
        const createAt = moment().unix();
        const expireAt = createAt + 24 * 3600;
        const salt = createAt + Math.floor(Math.random() * 10000);

        const bytes = Buffer.concat([
            Buffer.from(toBytes(+kind, 4)),
            Buffer.from(toBytes(createAt, 8)),
            Buffer.from(toBytes(expireAt, 8)),
            new Address(userAddress).pubkey(),
            Buffer.from(buyToken),
            Buffer.from(toBytes(+buyAmount)),
            Buffer.from(sellToken),
            Buffer.from(toBytes(+sellAmount)),
            Buffer.from(toBytes(salt)),
        ]);
        console.log(bytes);

        const hash_mess = createKeccakHash("keccak256").update(bytes).digest().toString("hex");
        const messageSize = Buffer.from(hash_mess.length.toString());
        const data = await accProvider?.provider?.signMessage(new SignableMessage({message: Buffer.from(hash_mess)}), {});
        // const data = await accProvider.provider.signMessage(new SignableMessage({message: Buffer.from("hello")}), {});
        console.log("sign", data);
        const order: Order = {
            id: hash_mess,
            salt: new BigNumber(salt),
            kind: +kind, //EnumValue.fromDiscriminant(OrderKindEnum, +kind),// +kind === 0 ?  "Market" : "Limit",
            created_at: createAt,
            expire_time: expireAt,
            owner_address: new Address(userAddress),
            owner_signature: data.signature.hex(),
            buy_token: buyToken,
            buy_amount: new BigNumber(buyAmount),
            sell_token: sellToken,
            sell_amount: new BigNumber(sellAmount),
        }
        console.log(order);
        const tx = await new ExchangeContract("erd1qqqqqqqqqqqqqpgqgg5wshagx8e539rk485ym06790f3hhakrmcqjw9zxm").executeExchange(order, [order, order]);
        console.log("transaction", tx);
        await sendTransactions({
            transactions: [tx],
        })
        axios.post(`${process.env.NEXT_PUBLIC_OB_API}/api/v1/order/create`, {
            id: hash_mess,
            salt: ''+salt,
            kind: +kind === 1 ? "Market" : "Limit",
            created_at: createAt,
            expire_time: expireAt,
            owner_address: userAddress,
            owner_signature: data.signature.hex(),
            buy_token: buyToken,
            buy_amount: buyAmount,
            sell_token: sellToken,
            sell_amount: sellAmount,

        }, {headers: {"ngrok-skip-browser-warning": "FU_NGROK"}})
        console.log("SIGNATURE " ,data);
    }, [accProvider.provider, buyAmount, buyToken, kind, sellAmount, sellToken, userAddress]);

    return (
        <BasicLayout>
            <div className="ash-container pb-40 pt-8 space-y-4">
                <div>
                    <div>Kind</div>
                    <input
                        type="text"
                        className="px-4 py-2 text-ash-dark-400"
                        value={kind}
                        onChange={(e) => setKind(e.target.value)}
                    />
                </div>
                <div>
                    <div>buyToken</div>
                    <input
                        type="text"
                        className="px-4 py-2 text-ash-dark-400"
                        value={buyToken}
                        onChange={(e) => setBuyToken(e.target.value)}
                    />
                </div>
                <div>
                    <div>buyAmount</div>
                    <input
                        type="text"
                        className="px-4 py-2 text-ash-dark-400"
                        value={buyAmount}
                        onChange={(e) => setBuyAmount(e.target.value)}
                    />
                </div>
                <div>
                    <div>sellToken</div>
                    <input
                        type="text"
                        className="px-4 py-2 text-ash-dark-400"
                        value={sellToken}
                        onChange={(e) => setSellToken(e.target.value)}
                    />
                </div>
                <div>
                    <div>sellAmount</div>
                    <input
                        type="text"
                        className="px-4 py-2 text-ash-dark-400"
                        value={sellAmount}
                        onChange={(e) => setSellAmount(e.target.value)}
                    />
                </div>
                <button className="px-4 py-2 bg-pink-600 font-bold text-white" onClick={() => signMsg()}>create</button>
            </div>
        </BasicLayout>
    );
}
export default TestOB;
