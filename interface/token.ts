export interface IToken {
    id: string;
    icon: string;
    name: string;
    decimals: number;
}

export interface ITokenMap {
    [key: string]: IToken;
}
