import TokenAvatar from "components/Avatar/TokenAvatar";
import Scrollable from "components/Scrollable";
import TextAmt from "components/TextAmt";
import { SorSwapResponse } from "../../interfaces/swapInfo";
import BatchSwapRoute from "./BatchSwapRoute";

interface Props {
    swapInfo: SorSwapResponse;
    minimalWidth?: boolean;
}
function BatchSwapSorRoute({ swapInfo, minimalWidth }: Props) {
    return (
        <div>
            <div className="relative z-10 -mb-2 flex items-center justify-between">
                <div className="shrink-0 flex items-center gap-3">
                    <TokenAvatar identifier={swapInfo.tokenIn} className="w-8 h-8" />
                    <TextAmt
                        number={swapInfo.swapAmount}
                        className="font-bold text-lg text-ash-gray-600"
                    />
                </div>
                <div className="shrink-0 flex items-center gap-3">
                    <TextAmt
                        number={swapInfo.returnAmount}
                        className="font-bold text-lg text-ash-gray-600"
                    />
                    <TokenAvatar identifier={swapInfo.tokenOut} className="w-8 h-8" />
                </div>
            </div>
            <div className="flex relative px-4 ">
                <div className="w-1 mb-12 border-l border-dashed rounded-lg border-ash-gray-600"></div>
                <Scrollable
                    className="-mx-0.5 grow block overflow-x-auto overflow-y-hidden pt-2 scrollbar-hide"
                    direction="horizontal"
                >
                    <div className="flex flex-col min-w-fit">
                        {swapInfo.routes?.map((r, i) => (
                            <div key={i}>
                                <BatchSwapRoute route={r} />
                            </div>
                        ))}
                    </div>
                </Scrollable>
                <div className="w-1 mb-12 border-r border-dashed rounded-lg border-ash-gray-600"></div>
            </div>
        </div>
    );
}

export default BatchSwapSorRoute;
