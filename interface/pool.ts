import { IToken } from "./token";

export default interface IPool {
    address: string;
    tokens: IToken[];
    lpToken: IToken;
}
