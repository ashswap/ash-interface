import Token from "components/Token";
import { IToken } from "interface/token";
import Image from "next/image";
import styles from "./QuickSelect.module.css";

interface Props {
    className?: string | undefined;
    tokens: IToken[];
    onChange?: (t: IToken) => void;
}

const QuickSelect = (props: Props) => {
    const onSelectToken = (t: IToken) => {
        if (props.onChange) {
            props.onChange(t);
        }
    };

    return (
        <div className={`${styles.container} ${props.className || ""}`}>
            <div>
                <div className="flex flex-wrap">
                    {props.tokens.slice(0, 5).map(t => (
                        // <Token
                        //     key={t.id}
                        //     token={t}
                        //     small
                        //     className="flex-1 select-none cursor-pointer"
                        //     onClick={() => onSelectToken(t)}
                        // />
                        <div key={t.id} className="rounded-lg bg-ash-dark-600 hover:bg-ash-dark-700 transition-all flex items-center space-x-2 w-20 text-2xs font-bold cursor-pointer p-2.5 mr-2" onClick={() => onSelectToken(t)}>
                            <div className="w-4 h-4 rounded-full relative overflow-hidden">
                                <Image src={t.icon} alt={t.name} layout="fill" objectFit="contain"/>
                            </div>
                            <div>{t.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuickSelect;
