import Avatar from "components/Avatar";
import { formatAmount } from "helper/number";
import { TokenAmount } from "helper/token/tokenAmount";
import { useScreenSize } from "hooks/useScreenSize";
import { CSSProperties, memo, useMemo } from "react";
import { FixedSizeList, areEqual } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
const TokenItem = memo(function TokenItem({
    index,
    style,
    data,
}: {
    index: number;
    style: CSSProperties;
    data: {
        list: TokenAmount[];
        onSelect?: (t: TokenAmount) => void;
    };
}) {
    const token = useMemo(() => data.list[index], [data.list, index]);
    return (
        <div style={style}>
            <div
                className="mb-auto flex items-center justify-between gap-4 cursor-pointer rounded-lg bg-ash-dark-400 hover:bg-ash-dark-350 hover:colored-drop-shadow-sm hover:colored-drop-shadow-ash-dark-350/75 transition-all h-14 px-4"
                onClick={() => data.onSelect?.(token)}
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
                    {formatAmount(token.egld, {
                        notation: "standard",
                        displayThreshold: 0.000001,
                    })}
                    &nbsp;
                    <span className="inline-block max-w-[4rem] truncate">
                        {token.token.symbol}
                    </span>
                </div>
            </div>
        </div>
    );
}, areEqual);
interface Props {
    items: TokenAmount[];
    className?: string | undefined;
    onSelect?: (t: TokenAmount) => void;
}

const ListToken = (props: Props) => {
    const { isMobile } = useScreenSize();
    const itemData = useMemo(
        () => ({ list: props.items, onSelect: props.onSelect }),
        [props.items, props.onSelect]
    );
    return (
        <div className={`${props.className}`}>
            <AutoSizer>
                {({ width, height }: any) => (
                    <FixedSizeList
                        itemCount={props.items.length}
                        itemSize={56 + 16}
                        width={width}
                        height={height}
                        itemData={itemData}
                        overscanCount={5}
                    >
                        {TokenItem}
                    </FixedSizeList>
                )}
            </AutoSizer>
        </div>
    );
};

export default ListToken;
