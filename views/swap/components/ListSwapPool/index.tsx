// import Token from "components/Token";
import IPool from "interface/pool";
import { IToken } from "interface/token";
import Image from "next/image";
import { createContext, useContext } from "react";
import styles from "./ListSwapPool.module.css";
import ICArrowRightRounded from "assets/svg/arrow-right-rounded.svg";
interface Props {
    items: IPool[];
    className?: string | undefined;
    onSelect?: (t: IPool) => void;
    pivotToken: IToken;
    isPivotFirst?: boolean;
}

const Token = ({ token }: { token: IToken }) => {
    return (
        <div className="flex items-center space-x-4">
            <div className="w-7 h-7 relative shrink-0">
                <Image
                    src={token.icon}
                    alt={token.name}
                    layout="fill"
                    objectFit="contain"
                />
            </div>
            <div className="overflow-hidden">
                <div className="text-sm font-bold text-white truncate">
                    {token.name}
                </div>
                <div className="text-2xs text-ash-gray-600 truncate">
                    {token.name}
                </div>
            </div>
        </div>
    );
};

const ListSwapPool = (props: Props) => {
    return (
        <div className="space-y-4">
            {props.items.map((pool) => (
                <div
                    key={pool.address}
                    className={`bg-ash-dark-400 hover:bg-ash-dark-350 hover:colored-drop-shadow-sm hover:colored-drop-shadow-ash-dark-350/75 transition-all rounded-lg h-14 px-5 flex items-center cursor-pointer ${
                        props.isPivotFirst ? "" : "flex-row-reverse"
                    }`}
                    onClick={() => props.onSelect && props.onSelect(pool)}
                >
                    <div className="flex-1 overflow-hidden">
                        <Token token={props.pivotToken} />
                    </div>
                    <div className="mx-7 rounded-lg bg-ash-dark-600 w-7 h-7 flex items-center justify-center shrink-0">
                        <ICArrowRightRounded className="w-2 h-auto text-white" />
                    </div>
                    {pool.tokens
                        .filter((t) => t.id !== props.pivotToken.id)
                        .slice(0, 1)
                        .map((t, index) => (
                            <div key={t.id} className="flex-1 overflow-hidden">
                                <Token token={t} />
                            </div>
                        ))}
                </div>
            ))}
        </div>
    );
};

export default ListSwapPool;
