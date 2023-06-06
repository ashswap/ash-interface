import Avatar from "components/Avatar";
import TokenAvatar from "components/Avatar/TokenAvatar";
import BaseTooltip from "components/BaseTooltip";
import useGetDexInfo from "hooks/useGetDexInfo";
import useGetESDTInfo from "hooks/useGetESDTInfo";
import { memo } from "react";
import { SorHop } from "../../interfaces/swapInfo";

const TokenInPoolRecord = memo(function TokenInPoolRecord({
    identifier,
}: {
    identifier: string;
}) {
    const token = useGetESDTInfo(identifier);
    return (
        <div className="border border-black px-4 py-2 flex items-center justify-between">
            <div className="flex items-center mr-4">
                <Avatar className="w-4 h-4 mr-2" src={token?.logoURI} />
                <span className="font-bold text-xs text-ash-gray-600">
                    {token?.symbol}
                </span>
            </div>
            {/* <div className='font-bold text-xs text-ash-gray-600'>{(+(t.weight || 0) * 100).toFixed(0)}%</div> */}
        </div>
    );
});

interface Props {
    hop: SorHop;
}
function BatchSwapHop({ hop }: Props) {
    const dex = useGetDexInfo(hop.pool.type);
    return (
        <BaseTooltip
            content={
                <div className="min-w-[15rem] px-6 py-4 bg-ash-dark-400">
                    <div className="mb-2 flex items-center">
                        <Avatar className="w-6 h-6 mr-2" src={dex.logoUrl} alt={dex.name} />
                        <span className="font-bold text-sm text-white">
                            {dex.name}
                        </span>
                    </div>
                    <div className="flex flex-col gap-2">
                        {hop.pool.allTokens.map((t) => (
                            <TokenInPoolRecord
                                key={t.address}
                                identifier={t.address}
                            />
                        ))}
                    </div>
                </div>
            }
        >
            <div className="px-4 py-2 border border-black bg-ash-dark-600 flex items-center">
                {hop.pool.allTokens.map((t) => (
                    <TokenAvatar
                        key={t.address}
                        identifier={t.address}
                        className="w-4 h-4 first:ml-0 -ml-1"
                    />
                ))}
            </div>
        </BaseTooltip>
    );
}

export default BatchSwapHop;
