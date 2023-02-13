import ImgEgldIcon from "assets/images/egld-icon.png";
import { accBalanceState } from "atoms/dappState";
import { lpTokenMapState, tokenMapState } from "atoms/tokensState";
import BigNumber from "bignumber.js";
import Avatar from "components/Avatar";
import TextAmt from "components/TextAmt";
import { CHAIN_ID } from "const/dappConfig";
import { ENVIRONMENT } from "const/env";
import pools from "const/pool";
import { TOKENS } from "const/tokens";
import { toEGLDD } from "helper/balance";
import { IESDTInfo } from "helper/token/token";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import Link from "next/link";
import { WRAPPED_EGLD } from "const/wrappedEGLD";
type TokenWithBalance = IESDTInfo & {
    balance: BigNumber;
};
const TokenBalance = ({ data }: { data: TokenWithBalance }) => {
    return (
        <div className="flex items-center justify-between px-6">
            <div className="flex items-center mr-2 h-8">
                {data.logoURI ? (
                    <Avatar
                        src={data.logoURI}
                        alt={data.symbol}
                        className="w-3.5 h-3.5"
                    />
                ) : (
                    <div className="w-3.5 h-3.5 rounded-full bg-ash-dark-400"></div>
                )}
                <span className="text-white text-xs font-bold ml-2">
                    {data.symbol}
                </span>
                {data.identifier === "EGLD" && (
                    <Link href={{
                        pathname: "/swap",
                        query: {
                            tokenIn: "EGLD",
                            tokenOut: WRAPPED_EGLD.wegld
                        }
                    }}>
                        <a>
                            <button className="border boder-white font-medium text-2xs text-white p-1 ml-2">Wrap</button>
                        </a>
                    </Link>
                )}
                {data.identifier === WRAPPED_EGLD.wegld && (
                    <Link href={{
                        pathname: "/swap",
                        query: {
                            tokenIn: WRAPPED_EGLD.wegld,
                            tokenOut: "EGLD"
                        }
                    }}>
                        <a>
                            <button className="border boder-white font-medium text-2xs text-white p-1 ml-2">Unwrap</button>
                        </a>
                    </Link>
                )}
            </div>
            <div className="text-stake-gray-500 text-xs">
                <TextAmt
                    number={toEGLDD(data.decimals, data.balance)}
                    options={{ notation: "standard" }}
                />
            </div>
        </div>
    );
};
function WalletBalance() {
    const tokenMap = useRecoilValue(tokenMapState);
    const lpTokenMap = useRecoilValue(lpTokenMapState);
    const ashSupportedBalances = useMemo(() => {
        const supportedTokens: TokenWithBalance[] = TOKENS.map((t) => {
            return {
                ...t,
                balance: new BigNumber(tokenMap[t.identifier]?.balance || 0),
            };
        });

        const lpTokens: TokenWithBalance[] = pools
            .map((p) => {
                const t = p.lpToken;
                return {
                    ...t,
                    balance: new BigNumber(
                        lpTokenMap[t.identifier]?.balance || 0
                    ),
                };
            })
            .filter((t) => t.balance.gt(0));

        return [...supportedTokens, ...lpTokens];
    }, [tokenMap, lpTokenMap]);
    return (
        <div className="bg-stake-dark-500 py-4">
            <div className="px-6 text-stake-gray-500 text-xs font-bold mb-4">
                Wallet
            </div>
            <div className="overflow-auto flex flex-col h-40">
                {ashSupportedBalances.map((t) => {
                    return <TokenBalance key={t.identifier} data={t} />;
                })}
            </div>
        </div>
    );
}

export default WalletBalance;
