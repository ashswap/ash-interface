import { FARMS } from "const/farms";
import { TOKENS, TOKENS_MAP } from "const/tokens";
import { IESDTInfo } from "helper/token/token";
import { TokenAmount } from "helper/token/tokenAmount";
import { IMetaESDT } from "interface/tokens";
import { atom, atomFamily, selectorFamily } from "recoil";
import { KeyedMutator } from "swr";
type Token = IESDTInfo & {
    balance: string;
    valueUsd: number;
    price: number;
};
const defaultTokenMapState: Record<string, Token> = Object.fromEntries(
    TOKENS.map((t) => {
        const token: Token = {
            ...t,
            balance: "0",
            valueUsd: 0,
            price: 0,
        };
        return [t.identifier, token];
    })
);
export const tokenMapState = atom<Record<string, Token>>({
    key: "token_map_state",
    default: defaultTokenMapState,
});

const defaultFarmTokenMapState = Object.fromEntries(
    FARMS.map((f) => {
        return [f.farm_token_id, []];
    })
);
export const farmTokenMapState = atom<Record<string, IMetaESDT[]>>({
    key: "farm_token_map_state",
    default: defaultFarmTokenMapState,
});

export const tokensRefresherAtom = atom<
    KeyedMutator<
        {
            balance: string;
            identifier: string;
        }[]
    >
>({
    key: "refresh_tokens_balance",
    default: () => Promise.resolve(undefined),
});

export const tokenBalanceSelector = selectorFamily<TokenAmount | undefined, string>({
    key: "token_balance_selector",
    get: (tokenId: string) => ({get}) => {
        const tokenMap = get(tokenMapState);
        if (!TOKENS_MAP[tokenId] || !tokenMap[tokenId]) return undefined;
        return new TokenAmount(TOKENS_MAP[tokenId], tokenMap[tokenId].balance);
    }
});

export const tokenInfoOnNetworkAtom = atomFamily<IESDTInfo, string>({
    key: "token_info_on_network_atom_family",
    default: undefined,
});