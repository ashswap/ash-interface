import Token from "components/Token";
import IPool from "interface/pool";
import { IToken } from "interface/token";
import styles from "./ListSwapPool.module.css";

interface Props {
    items: IPool[];
    className?: string | undefined;
    onSelect?: (t: IPool) => void;
    pivotToken: IToken;
    isPivotFirst?: boolean;
}

const ListSwapPool = (props: Props) => {
    return (
        <div className={props.className}>
            {props.items.map(pool => (
                <div
                    key={pool.address}
                    className={styles.pool}
                    onClick={() => props.onSelect && props.onSelect(pool)}
                >
                    {props.isPivotFirst && (
                        <>
                            <Token token={props.pivotToken} />
                            <div className="mx-7">-</div>
                        </>
                    )}
                    {pool.tokens
                        .filter(t => t.id !== props.pivotToken.id)
                        .map((t, index) => (
                            <div key={t.id}>
                                <Token token={t} />
                                {index !== pool.tokens.length - 2 && (
                                    <div className="mx-7">-</div>
                                )}
                            </div>
                        ))}
                    {!props.isPivotFirst && (
                        <>
                            <div className="mx-7">-</div>
                            <Token token={props.pivotToken} />
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ListSwapPool;
