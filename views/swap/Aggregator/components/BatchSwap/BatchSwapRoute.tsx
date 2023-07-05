import ICChevronRight from "assets/svg/chevron-right.svg";
import BigNumber from "bignumber.js";
import Avatar from "components/Avatar";
import TextAmt from "components/TextAmt";
import useGetESDTInfo from "hooks/useGetESDTInfo";
import { Fragment, memo } from "react";
import { SorRoute } from "../../interfaces/swapInfo";
import BatchSwapHop from "./BatchSwapHop";
const TokenSwapAmount = memo(function TokenSwapAmount({identifier, amount}: {identifier: string, amount: BigNumber.Value}) {
    const token = useGetESDTInfo(identifier);
    return <div className="px-4 py-2 border border-black bg-ash-dark-600 flex items-center">
    <Avatar className="w-4 h-4 mr-2" src={token?.logoURI} alt={token?.name} />
    <TextAmt number={amount} className="font-bold text-xs text-ash-gray-600" />
</div>
})
interface Props {
    route: SorRoute;
    minimalWidth?: boolean;
}
function BatchSwapRoute({ route, minimalWidth }: Props) {
    return (
        <div className="relative flex items-center">
            <div className="absolute inset-x-0 h-4 -translate-y-1/2 border-dashed border-ash-gray-600 border-b rounded-lg px-6"></div>
            <div className="relative w-full py-6 px-6 min-w-fit flex items-center justify-between gap-4">
                <TokenSwapAmount identifier={route.tokenIn} amount={route.tokenInAmount}/>
                <div className="w-8 h-8 bg-ash-dark-600 flex items-center justify-center">
                    <ICChevronRight className="w-2 h-auto text-ash-gray-600" />
                </div>
                {route.hops.map((h) => (
                    <Fragment key={h.poolId}>
                        <BatchSwapHop hop={h} />
                        <div className="w-8 h-8 bg-ash-dark-600 flex items-center justify-center">
                            <ICChevronRight className="w-2 h-auto text-ash-gray-600" />
                        </div>
                    </Fragment>
                ))}
                <TokenSwapAmount identifier={route.tokenOut} amount={route.tokenOutAmount}/>
            </div>
        </div>
    );
}

export default BatchSwapRoute;
