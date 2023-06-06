import Avatar from "components/Avatar";
import { IESDTInfo } from "helper/token/token";
import styles from "./QuickSelect.module.css";

interface Props {
    className?: string | undefined;
    tokens: IESDTInfo[];
    onChange?: (t: IESDTInfo) => void;
}

const QuickSelect = (props: Props) => {
    const onSelectToken = (t: IESDTInfo) => {
        if (props.onChange) {
            props.onChange(t);
        }
    };

    return (
        <div className={`${styles.container} ${props.className || ""}`}>
            <div>
                <div className="flex flex-wrap gap-2">
                    {props.tokens.slice(0, 5).map((t) => (
                        // <Token
                        //     key={t.id}
                        //     token={t}
                        //     small
                        //     className="flex-1 select-none cursor-pointer"
                        //     onClick={() => onSelectToken(t)}
                        // />
                        <div
                            key={t.identifier}
                            className="rounded-lg bg-ash-dark-600 hover:bg-ash-dark-700 transition-all flex items-center space-x-2 w-20 text-2xs font-bold cursor-pointer p-2.5"
                            onClick={() => onSelectToken(t)}
                        >
                            <Avatar
                                src={t.logoURI}
                                alt={t.symbol}
                                className="w-4 h-4"
                            />
                            <div>{t.symbol}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuickSelect;
