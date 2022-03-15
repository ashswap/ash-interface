const ABBR_SYMBOL = ['', 'k', 'M', 'B', 'T'] as const;
export const currencyFormater = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
});
export const fractionFormat = (val: number, maximumFractionDigits = 2) => {
    if(typeof val !== "number") return "";
    return val.toLocaleString("en-US", {maximumFractionDigits: val > 1 ? maximumFractionDigits : undefined});
}
export function abbreviateCurrency(n: number, minPlus?: number): number | string {
    if(n === 0) return n;
    if (minPlus !== undefined) {
        return n > minPlus ? `${minPlus}+` : n;
    }
    // what tier? (determines SI symbol)
    const tier = Math.floor(Math.floor(Math.log10(Math.abs(n))) / 3);

    // get suffix and determine scale
    const suffix = ABBR_SYMBOL[tier >= ABBR_SYMBOL.length ? ABBR_SYMBOL.length - 1 : tier];
    const scale = Math.pow(10, Math.min(tier, ABBR_SYMBOL.length - 1) * 3);

    // scale the number
    const scaled = n / scale;

    // format number and add suffix
    // const fixed = scaled.toFixed(1);

    // return (fixed.endsWith('.0') ? fixed.substring(0, fixed.length - 2) : fixed) + suffix;
    return currencyFormater.format(scaled) + suffix;
}