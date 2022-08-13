export enum ChainId {
    Mainnet = "1",
    Testnet = "T",
    Devnet = "D",
}
export interface IESDTInfo {
    readonly chainId: ChainId;
    readonly identifier: string;
    readonly name: string;
    readonly symbol: string;
    readonly decimals: number;
    readonly logoURI?: string;
    readonly projectLink?: string;
}

export interface IMetaESDTInfo extends IESDTInfo {
    readonly collection: string;
    readonly nonce: number;
    readonly attributes: string;
}

export class ESDT implements IESDTInfo {
    constructor(readonly token: IESDTInfo) {}
    get chainId() {
        return this.token.chainId;
    }
    get identifier() {
        return this.token.identifier;
    }
    get name() {
        return this.token.name;
    }
    get symbol() {
        return this.token.symbol;
    }
    get decimals() {
        return this.token.decimals;
    }
    get logoURI() {
        return this.token.logoURI;
    }

    get projectLink(): string | undefined{
        return this.token.projectLink;
    }
    /**
     * Returns true if the two tokens are equivalent, i.e. have the same chainId and identifier.
     * @param other other token to compare
     */
    equals(other: ESDT): boolean {
        return (
            this.identifier === other.identifier &&
            this.chainId === other.chainId
        );
    }

    toString(): string {
        return `ESDT{id=${this.identifier}, decimals=${this.decimals}, chainId=${this.chainId}}`;
    }
}

export class MetaESDT extends ESDT implements IMetaESDTInfo {
    constructor(readonly token: IMetaESDTInfo) {
        super(token);
    }

    get collection(): string {
        return this.token.collection;
    }
    get nonce(): number {
        return this.token.nonce;
    }
    get attributes(): string {
        return this.token.attributes;
    }

    override toString(): string {
        return `MetaESDT{id=${this.identifier}, decimals=${this.decimals}, chainId=${this.chainId}}`;
    }
}
