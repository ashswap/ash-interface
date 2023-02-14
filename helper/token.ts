import { TOKENS_MAP } from "const/tokens";
import { WRAPPED_EGLD } from "const/wrappedEGLD";

export const getTokenIdFromCoin = (coin?: string) => {
    return coin === "EGLD" ? WRAPPED_EGLD.wegld : coin;
};

export const getTokenFromId = (id: string) => {
    return TOKENS_MAP[id === WRAPPED_EGLD.wegld ? "EGLD" : id];
}