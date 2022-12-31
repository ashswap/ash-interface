const cacheColors: Record<string, string> = {};
export function randomHexColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}

export function getHexColor(key: string) {
    return cacheColors[key] ?? (cacheColors[key] = randomHexColor());
}
