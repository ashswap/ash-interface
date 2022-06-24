import Token from "components/Token";
import { toEGLD } from "helper/balance";
import { TokenBalance } from "interface/tokenBalance";
import Image from "next/image";

interface Props {
    items: TokenBalance[];
    className?: string | undefined;
    onSelect?: (t: TokenBalance) => void;
}

const ListToken = (props: Props) => {
    return (
        <div className={`space-y-4 ${props.className}`}>
            {props.items.map(token => (
                <div
                    key={token.token.id}
                    className="flex items-center justify-between cursor-pointer rounded-lg bg-ash-dark-400 h-14 px-4"
                    onClick={() => props.onSelect && props.onSelect(token)}
                >
                    <div className="flex items-center space-x-4">
                        <div className="w-7 h-7 relative">
                            <Image src={token.token.icon} alt={token.token.name} layout="fill" objectFit="contain"/>
                        </div>
                        <div>
                            <div className="text-sm font-bold text-white">{token.token.name}</div>
                            <div className="text-2xs text-ash-gray-600">{token.token.name}</div>
        
                        </div>
                    </div>
                    <div className="text-ash-gray-600 font-normal text-xs">
                        {toEGLD(token.token, token.balance.toString()).toFixed(5)}&nbsp;{token.token.name}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ListToken;
