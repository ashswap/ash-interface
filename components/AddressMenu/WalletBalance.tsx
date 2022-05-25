import { useGetAccountInfo } from "@elrondnetwork/dapp-core";
import ImgEgldIcon from "assets/images/egld-icon.png";
import { walletBalanceState } from "atoms/walletState";
import BigNumber from "bignumber.js";
import TextAmt from "components/TextAmt";
import { ENVIRONMENT } from "const/env";
import pools from "const/pool";
import { TOKENS } from "const/tokens";
import { toEGLDD } from "helper/balance";
import { IToken } from "interface/token";
import Image from "next/image";
import React, { useMemo } from "react";
import { useRecoilValue } from "recoil";
type TokenWithBalance = IToken & {
    balance: BigNumber;
}
const TokenBalance = ({data}: {data: Omit<TokenWithBalance, "id">}) => {
    return <div className="flex justify-between px-6 py-2">
        <div className="flex items-center mr-2">
            {data.icon ? <Image src={data.icon} alt={data.name} width={14} height={14}/> : <div className="w-3.5 h-3.5 rounded-full bg-ash-dark-400"></div>}
            <span className="text-white text-xs font-bold ml-2">{data.name}</span>
        </div>
        <div className="text-stake-gray-500 text-xs">
        <TextAmt number={toEGLDD(data.decimals, data.balance)} options={{notation: "standard"}}/>
        </div>
    </div>
}
function WalletBalance() {
    const balances = useRecoilValue(walletBalanceState);
    const {account} = useGetAccountInfo();
    const ashSupportedBalances = useMemo(() => {
        const supportedTokens: TokenWithBalance[] = TOKENS.map(t => {
            return ({
                ...t,
                balance: balances[t.id]?.balance || new BigNumber(0)
            })
        });

        const lpTokens: TokenWithBalance[] = pools.map(p => {
            const t = p.lpToken;
            return ({
                ...t,
                balance: balances[t.id]?.balance || new BigNumber(0)
            })
        }).filter(t => t.balance.gt(0));

        return [...supportedTokens, ...lpTokens];
        
    }, [balances]);
    const egld: Omit<TokenWithBalance, "id"> = useMemo(() => {
        return ({
            name: ENVIRONMENT.NETWORK === "devnet" ? "dEGLD" : ENVIRONMENT.NETWORK === "testnet" ? "xEGLD" : "EGLD",
            balance: new BigNumber(account.balance),
            icon: ImgEgldIcon,
            decimals: 18
        }) 
    }, [account]);
    return (
        <div className="bg-stake-dark-500 py-4">
            <div className="px-6 text-stake-gray-500 text-xs font-bold mb-4">Wallet</div>
            <div className="overflow-auto flex flex-col h-40">
            <TokenBalance data={egld}/>
                {ashSupportedBalances.map(t => {
                    return <TokenBalance key={t.id} data={t}/>
                })}
            </div>
        </div>
    );
}

export default WalletBalance;
