export const shortenString = (str: string, head = 6, tail?: number) => {
    const _tail = tail ?? head;
    if (head + _tail >= str.length) {
        return str;
    }
    return `${str.slice(0, head)}...${str.slice(-1 * _tail)}`;
};
