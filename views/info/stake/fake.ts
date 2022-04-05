import moment from "moment"

export const FAKE_TVL = new Array(200).fill("").map((val, i) => {
    return ({
        timestamp: moment().subtract(i, "days").endOf("days").unix(),
        value: Math.floor(Math.random() * 10000) + 2000
    });
}).reverse();