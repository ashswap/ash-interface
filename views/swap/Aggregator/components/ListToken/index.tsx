import Avatar from "components/Avatar";
import { formatAmount } from "helper/number";
import { TokenAmount } from "helper/token/tokenAmount";

interface Props {
    items: TokenAmount[];
    className?: string | undefined;
    onSelect?: (t: TokenAmount) => void;
}

const ListToken = (props: Props) => {
    return (
        <div className={`space-y-4 ${props.className}`}>
            {props.items.map((token) => (
                <div
                    key={token.token.identifier}
                    className="flex items-center justify-between gap-4 cursor-pointer rounded-lg bg-ash-dark-400 hover:bg-ash-dark-350 hover:colored-drop-shadow-sm hover:colored-drop-shadow-ash-dark-350/75 transition-all h-14 px-4"
                    onClick={() => props.onSelect && props.onSelect(token)}
                >
                    <div className="flex items-center space-x-4 overflow-hidden">
                        <Avatar
                            src={token.token.logoURI}
                            alt={token.token.symbol}
                            className="w-7 h-7 shrink-0"
                        />
                        <div className="grow overflow-hidden">
                            <div className="text-sm font-bold text-white truncate">
                                {token.token.symbol}
                            </div>
                            <div className="text-2xs text-ash-gray-600 truncate">
                                {token.token.name}
                            </div>
                        </div>
                    </div>
                    <div className="shrink-0 flex items-center text-ash-gray-600 font-normal text-xs">
                        {formatAmount(token.egld, {notation: "standard", displayThreshold: 0.000001})}
                        &nbsp;<span className="inline-block max-w-[4rem] truncate">{token.token.symbol}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ListToken;
