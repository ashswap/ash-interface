import { Address } from "@multiversx/sdk-core/out";
import { TOKENS_MAP } from "const/tokens";
import { WRAPPED_EGLD } from "const/wrappedEGLD";
import numeral from "numeral";
type AmountHumanReadable = string;
export const getTokenIdFromCoin = (coin?: string) => {
    return coin === "EGLD" ? WRAPPED_EGLD.wegld : coin;
};

export const getTokenFromId = (id: string) => {
    return TOKENS_MAP[id === WRAPPED_EGLD.wegld ? "EGLD" : id];
}

export function tokenFormatAmount(amount: AmountHumanReadable | number, isDust = true) {
    const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (typeof amount === 'string' && amount.includes('e') && !isDust) {
        const fixedNum = parseFloat(amount.split('-')[1]);
        return amountNum.toFixed(fixedNum);
    } else if (amountNum < 0.000001 && amountNum >= 0) {
        return '0.00';
    } else if (amountNum < 1) {
        return numeral(amount).format('0.[000000]');
    } else if (amountNum < 10) {
        return numeral(amount).format('0.0[000]');
    } else if (amountNum < 100) {
        return numeral(amount).format('0.[0000]');
    } else if (amountNum < 5000) {
        return numeral(amount).format('0,0.[00]');
    } else {
        return numeral(amount).format('0,0');
    }
}

export function tokenFormatAmountPrecise(amount: AmountHumanReadable | number, precision: number = 12) {
    const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (amountNum === 0) {
        return '0.0';
    }

    if (precision <= 4) {
        if (amountNum < 0.0001) {
            return '< 0.0001';
        }

        return numeral(amount).format('0,0.[0000]');
    } else if (precision <= 6) {
        if (amountNum < 0.000001) {
            return '< 0.000001';
        }

        return numeral(amount).format('0,0.[000000]');
    } else if (precision <= 8) {
        if (amountNum < 0.000001) {
            return amount;
        }

        return numeral(amount).format('0,0.[0000000000]');
    }

    return numeral(amount).format('0,0.[000000000000]');
}

export function isEGLD(tokenId: string) {
    return tokenId.toUpperCase() === "EGLD";
}

export function isWEGLD(tokenId: string) {
    return tokenId.toLowerCase() === WRAPPED_EGLD.wegld.toLowerCase();
}

export function replaceEGLDWithWEGLD(tokenId: string) {
    if (isEGLD(tokenId)) {
        return WRAPPED_EGLD.wegld;
    }

    return tokenId;
}

export function replaceWEGLDWithEGLD(tokenId: string) {
    if (isWEGLD(tokenId)) {
        return "EGLD";
    }
    return tokenId;
}

export function replaceWEGLDWithZeroAddress(tokenIds: string[]): string[] {
    return tokenIds.map((tokenId) => (isWEGLD(tokenId) ? Address.Zero().bech32() : tokenId));
}

export function replaceEGLDWithZeroAddress(tokenIds: string[]): string[] {
    return tokenIds.map((tokenId) => (isEGLD(tokenId) ? Address.Zero().bech32() : tokenId));
}
