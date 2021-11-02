import IToken from "./token";

export default interface IPool {
    id: string
    tokens: IToken[]
}