import moment from "moment";

type ExpiresType = number | false;
type LocalStorageKey =
    | "nonce"
    | "walletconnect"
    | "loginMethod"
    | "address"
    | "ledgerLogin"
    | "userOnboarding"
    | "acceptedLegal"
export const setItem = ({
    key,
    data,
    expires,
}: {
    key: LocalStorageKey;
    data: any;
    expires?: ExpiresType;
}) => {
    if (typeof window !== "undefined") {
        localStorage.setItem(
            String(key),
            JSON.stringify({
                expires: expires ?? false,
                data,
            })
        );
    }
};
export const getItem = (key: LocalStorageKey): any => {
    if (typeof window !== "undefined") {
        const item = localStorage.getItem(String(key));
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
        if (deserializedItem.expires === false) return deserializedItem.data;

        const expired = moment().unix() >= deserializedItem.expires;
        if (expired) {
            localStorage.removeItem(String(key));
            return null;
        }

        return deserializedItem.data;
    }
    return null;
};

export const removeItem = (key: LocalStorageKey) =>
    typeof window !== "undefined" && localStorage.removeItem(String(key));

export const successDescription = "successDescription";
