import moment from "moment";

type ExpiresType = number | false;

export const setItem = ({
    key,
    data,
    expires
}: {
    key: "nonce" | "walletconnect" | "loginMethod" | "address" | "ledgerLogin";
    data: any;
    expires: ExpiresType;
}) => {
    if (typeof window !== "undefined") {
        localStorage.setItem(
            String(key),
            JSON.stringify({
                expires,
                data
            })
        );
    }
};

export const getItem = (
    key: "nonce" | "walletconnect" | "loginMethod" | "address" | "ledgerLogin"
): any => {
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

        const expired = moment().unix() >= deserializedItem.expires;
        if (expired) {
            localStorage.removeItem(String(key));
            return null;
        }

        return deserializedItem.data;
    }
    return null;
};

export const removeItem = (
    key: "nonce" | "walletconnect" | "loginMethod" | "address" | "ledgerLogin"
) => typeof window !== "undefined" && localStorage.removeItem(String(key));

export const successDescription = "successDescription";
