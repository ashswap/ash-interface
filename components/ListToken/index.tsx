import Token from 'components/Token';
import TokenBalance from 'interface/tokenBalance';

interface Props {
    items: TokenBalance[]
    className?: string | undefined;
    onSelect?: (t: TokenBalance) => void
}

const ListToken = (props: Props) => {
    return (
        <div className={props.className}>
            {
                props.items.map(token => (
                    <div
                        key={token.token.name}
                        className="flex flex-row items-center justify-between my-5 cursor-pointer select-none"
                        onClick={() => props.onSelect && props.onSelect(token)}
                    >
                        <Token token={token.token} />
                        <div className="text-text-input-3 font-normal text-xs">{token.balance.toString()}</div>
                    </div>
                ))
            }
        </div>
    )
}

export default ListToken;