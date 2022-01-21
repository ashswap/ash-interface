import moment from "moment";

export type SessionKeyType =
    | "walletLogin"
    | "walletConnectLogin"
    | "ledgerAccountIndex"
    | "extensionLogin"
    | "tokenLogin";
type ExpiresType = number | false;

export const setItem = ({
    key,
    data,
    expires
}: {
    key: SessionKeyType;
    data: any;
    expires: ExpiresType;
}) => {
    if (typeof window !== "undefined") {
        sessionStorage.setItem(
            String(key),
            JSON.stringify({
                expires,
                data
            })
        );
    }
};

export const getItem = (key: SessionKeyType): any => {
    if (typeof window !== "undefined") {
        const item = sessionStorage.getItem(String(key));
        if (!item) {
            return null;
        }

        const deserializedItem = JSON.parse(item);
        if (!deserializedItem) {
            return null;
        }

        if (
            !deserializedItem.hasOwnProperty("expires") ||
            !deserializedItem.hasOwnProperty("data")
        ) {
            return null;
        }

        const expired = moment().unix() >= deserializedItem.expires;
        if (expired) {
            sessionStorage.removeItem(String(key));
            return null;
        }

        return deserializedItem.data;
    }
    return null;
};

export const removeItem = (key: SessionKeyType) =>
    typeof window !== "undefined" && sessionStorage.removeItem(String(key));

export const clear = () => typeof window !== "undefined" && sessionStorage.clear();
