import { ENVIRONMENT } from "./env";

const VE_LOCK_LABEL_BOY = [
    { label: "2 weeks", amt: 1 },
    { label: "1 week", amt: 0.5 },
];
const VE_LOCK_LABEL_MAIN = [
    { label: "4 years", amt: 1 },
    { label: "3 years", amt: 0.75 },
    { label: "2 years", amt: 0.5 },
    { label: "1 year", amt: 0.25 },
];

export const WEEK = ENVIRONMENT.ENV === "alpha" ? 600 : ENVIRONMENT.ENV === "beta" ? 30 * 60 : 7 * 24 * 3600;
export const VE_MAX_TIME = 4 * 365 * 24 * 3600;
export const VE_LOCK_LABEL = VE_LOCK_LABEL_MAIN;
