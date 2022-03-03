import {
    Address,
    ArgSerializer,
    BigUIntValue,
    ContractFunction,
    EndpointParameterDefinition,
    Query,
    TypeExpressionParser,
    TypeMapper
} from "@elrondnetwork/erdjs/out";
import BigNumber from "bignumber.js";
import ListPoolItemDeposit from "components/ListPoolItemDeposit";
import ListPoolItemWithdraw from "components/ListPoolItemWithdraw";
import PoolCard from "components/PoolCard";
import { ViewType } from "components/PoolFilter";
import { useDappContext } from "context/dapp";
import { useWallet } from "context/wallet";
import { toEGLD } from "helper/balance";
import IPool from "interface/pool";
import { TokenBalancesMap } from "interface/tokenBalance";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface Props {
    pool: IPool;
    view?: ViewType;
    dark?: boolean;
}

export interface State {
    ownLiquidity: BigNumber;
    value0: BigNumber;
    value1: BigNumber;
    capacityPercent: BigNumber;
    tokenBalances: TokenBalancesMap;
    valueUsd: BigNumber;
}

export const initState: State = {
    ownLiquidity: new BigNumber(0),
    value0: new BigNumber(0),
    value1: new BigNumber(0),
    capacityPercent: new BigNumber(0),
    tokenBalances: {},
    valueUsd: new BigNumber(0)
};

export const PoolContext = createContext<State>(initState);
export function usePool() {
    return useContext(PoolContext);
}

const ListPoolItem = (props: Props) => {
    const router = useRouter();
    const poolType = router.query["type"];
    const { tokenPrices, balances, lpTokens, tokens } = useWallet();
    const dapp = useDappContext();
    const [value0, setValue0] = useState<BigNumber>(initState.value0);
    const [value1, setValue1] = useState<BigNumber>(initState.value1);
    const [tokenBalances, setTokenBalances] = useState<TokenBalancesMap>({});

    const ownLiquidity = useMemo(() => {
        return balances?.[props.pool.lpToken.id]
            ? balances?.[props.pool.lpToken.id].balance
            : new BigNumber(0);
    }, [balances, props.pool]);

    useEffect(() => {
        dapp.dapp.proxy
            .queryContract(
                new Query({
                    address: new Address(props.pool.address),
                    func: new ContractFunction("getRemoveLiquidityTokens"),
                    args: [
                        new BigUIntValue(ownLiquidity),
                        new BigUIntValue(new BigNumber(0)),
                        new BigUIntValue(new BigNumber(0))
                    ]
                })
            )
            .then(({ returnData }) => {
                let resultHex = Buffer.from(
                    returnData[0],
                    "base64"
                ).toString("hex");
                let parser = new TypeExpressionParser();
                let mapper = new TypeMapper();
                let serializer = new ArgSerializer();

                let type = parser.parse("tuple2<BigUint,BigUint>");
                let mappedType = mapper.mapType(type);

                let endpointDefinitions = [
                    new EndpointParameterDefinition("foo", "bar", mappedType)
                ];
                let values = serializer.stringToValues(
                    resultHex,
                    endpointDefinitions
                );

                setValue0(new BigNumber(values[0].valueOf().field0.toString()));
                setValue1(new BigNumber(values[0].valueOf().field1.toString()));
            });
    }, [ownLiquidity, props.pool.address, props.pool.tokens, dapp.dapp.proxy]);

    const capacityPercent = useMemo(() => {
        const lpToken = lpTokens[props.pool.lpToken.id];
        if (!lpToken) return new BigNumber(0);
        return toEGLD(props.pool.lpToken, ownLiquidity.toString())
            .multipliedBy(100)
            .div(lpToken.totalSupply!);
    }, [props.pool, ownLiquidity, lpTokens]);

    // get token amount in pool
    useEffect(() => {
        let tokenBalances: TokenBalancesMap = {};

        if (!dapp.dapp.proxy) {
            return;
        }

        dapp.dapp.proxy
            .getAddressEsdtList(new Address(props.pool.address))
            .then(resp => {
                for (const tokenId in resp) {
                    if (
                        Object.prototype.hasOwnProperty.call(resp, tokenId) &&
                        tokens[tokenId]
                    ) {
                        tokenBalances[tokenId] = {
                            balance: new BigNumber(resp[tokenId].balance),
                            token: tokens[tokenId]
                        };
                    }
                }

                setTokenBalances(tokenBalances);
            });
    }, [dapp.dapp.proxy, tokens, props.pool]);

    const valueUsd = useMemo(() => {
        let token0 = props.pool.tokens[0];
        let token1 = props.pool.tokens[1];
        let balance0 = tokenBalances[token0.id];
        let balance1 = tokenBalances[token1.id];

        if (!balance0 || !balance1) {
            return new BigNumber(0);
        }
        
        const valueUsd0 = toEGLD(
            token0,
            balance0.balance.toString()
        ).multipliedBy(tokenPrices[token0.id]);
        const valueUsd1 = toEGLD(
            token1,
            balance1.balance.toString()
        ).multipliedBy(tokenPrices[token1.id]);

        return valueUsd0.plus(valueUsd1);
    }, [props.pool, tokenPrices, tokenBalances]);

    const value: State = {
        ...initState,
        ownLiquidity,
        value0,
        value1,
        capacityPercent,
        tokenBalances,
        valueUsd
    };
    return (
        <PoolContext.Provider value={value}>
            {props.view == ViewType.Card ? (
                <PoolCard
                    pool={props.pool}
                    type={poolType === "my-pool" ? "withdraw" : "deposit"}
                />
            ) : poolType === "my-pool" ? (
                <ListPoolItemWithdraw pool={props.pool} dark={props.dark} />
            ) : (
                <ListPoolItemDeposit pool={props.pool} dark={props.dark} />
            )}
        </PoolContext.Provider>
    );
};

export default ListPoolItem;
