// import Token from "components/Token";
import ICArrowRightRounded from "assets/svg/arrow-right-rounded.svg";
import Avatar from "components/Avatar";
import { IESDTInfo } from "helper/token/token";
import IPool from "interface/pool";
import { useMemo } from "react";
interface Props {
    items: IPool[];
    className?: string | undefined;
    onSelect?: (p: IPool, t: IESDTInfo) => void;
    pivotToken: IESDTInfo;
    isPivotFirst?: boolean;
}

const Token = ({ token }: { token: IESDTInfo }) => {
    return (
        <div className="flex items-center space-x-4">
            <Avatar
                src={token.logoURI}
                alt={token.symbol}
                className="w-7 h-7 shrink-0"
            />
            <div className="overflow-hidden">
                <div className="text-sm font-bold text-white truncate">
                    {token.symbol}
                </div>
                <div className="text-2xs text-ash-gray-600 truncate">
                    {token.symbol}
                </div>
            </div>
        </div>
    );
};

const Pair = ({
    pool,
    ...props
}: { pool: IPool } & Pick<
    Props,
    "onSelect" | "isPivotFirst" | "pivotToken"
>) => {
    const pairTokens = useMemo(() => {
        return pool.tokens.filter(
            (t) => t.identifier !== props.pivotToken.identifier
        );
    }, [pool, props.pivotToken]);
    return (
        <>
            {pairTokens.map((t) => (
                <div
                    key={t.identifier}
                    className={`bg-ash-dark-400 hover:bg-ash-dark-350 hover:colored-drop-shadow-sm hover:colored-drop-shadow-ash-dark-350/75 transition-all rounded-lg h-14 px-5 flex items-center cursor-pointer ${
                        props.isPivotFirst ? "" : "flex-row-reverse"
                    }`}
                    onClick={() => props.onSelect?.(pool, t)}
                >
                    <div className="flex-1 overflow-hidden">
                        <Token token={props.pivotToken} />
                    </div>
                    <div className="mx-7 rounded-lg bg-ash-dark-600 w-7 h-7 flex items-center justify-center shrink-0">
                        <ICArrowRightRounded className="w-2 h-auto text-white" />
                    </div>
                    <div key={t.identifier} className="flex-1 overflow-hidden">
                        <Token token={t} />
                    </div>
                </div>
            ))}
        </>
    );
};

const ListSwapPool = (props: Props) => {
    return (
        <div className="space-y-4">
            {props.items.map((pool) => (
                <Pair key={pool.address} pool={pool} {...props} />
            ))}
        </div>
    );
};

export default ListSwapPool;
