
export function percentage(currentPrice, originalPrice) {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100) + "%";
}   