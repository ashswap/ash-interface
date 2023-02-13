import { WRAPPED_EGLD } from "const/wrappedEGLD";

export const getTokenIdFromCoin = (coin?: string) => {
    return coin === "EGLD" ? WRAPPED_EGLD.wegld : coin;
};
