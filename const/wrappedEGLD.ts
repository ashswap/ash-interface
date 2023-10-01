import BigNumber from "bignumber.js";
import { ENVIRONMENT } from "./env"

const tokens = {
    devnet: {
        wegld: "WEGLD-d7c6bb",
        wegldContracts: [
            "erd1qqqqqqqqqqqqqpgqd77fnev2sthnczp2lnfx0y5jdycynjfhzzgq6p3rax",//shard0
            "erd1qqqqqqqqqqqqqpgq7ykazrzd905zvnlr88dpfw06677lxe9w0n4suz00uh",//shard1
            "erd1qqqqqqqqqqqqqpgqfj3z3k4vlq7dc2928rxez0uhhlq46s6p4mtqerlxhc",//shard2
        ]
    },
    devnet2: {
        wegld: "WEGLD-a28c59",
        wegldContracts: [
            "erd1qqqqqqqqqqqqqpgqqkwzsxkjc83vlfex9dmznwm7tjvxlqqkpauqx0n782",
            "erd1qqqqqqqqqqqqqpgqpv09kfzry5y4sj05udcngesat07umyj70n4sa2c0rp",
            "erd1qqqqqqqqqqqqqpgqvn9ew0wwn7a3pk053ezex98497hd4exqdg0q8v2e0c",
        ]
    },
    mainnet: {
        wegld: "WEGLD-bd4d79",
        wegldContracts: [
            "erd1qqqqqqqqqqqqqpgqvc7gdl0p4s97guh498wgz75k8sav6sjfjlwqh679jy",
            "erd1qqqqqqqqqqqqqpgqhe8t5jewej70zupmh44jurgn29psua5l2jps3ntjj3",
            "erd1qqqqqqqqqqqqqpgqmuk0q2saj0mgutxm4teywre6dl8wqf58xamqdrukln",
        ]
    }
}
export const WRAPPED_EGLD = tokens[ENVIRONMENT.NETWORK];
export const MINIMUM_EGLD_AMT = new BigNumber(0.05).multipliedBy(10**18);