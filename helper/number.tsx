const ABBR_SYMBOL = ['', 'k', 'M', 'B', 'T'] as const;
export function abbreviateNumber(n: number, minPlus?: number): number | string {
    if(n === 0) return n;
    if (minPlus !== undefined) {
        return n > minPlus ? `${minPlus}+` : n;
    }
    // what tier? (determines SI symbol)
    const tier = Math.floor(Math.floor(Math.log10(Math.abs(n))) / 3);

    // if zero, we don't need a suffix
    if (tier === 0) return n;

    // get suffix and determine scale
    const suffix = ABBR_SYMBOL[tier];
    const scale = Math.pow(10, tier * 3);

    // scale the number
    const scaled = n / scale;

    // format number and add suffix
    const fixed = scaled.toFixed(1);
    return (fixed.endsWith('.0') ? fixed.substring(0, fixed.length - 2) : fixed) + suffix;
}