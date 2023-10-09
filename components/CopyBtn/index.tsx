import BaseTooltip from "components/BaseTooltip";
import { copyText } from "helper/common";
import { useCallback, useState } from "react";
type Props = {
    text: string;
    copiedMsg?: string;
    children?: any;
};
function CopyBtn({ text, copiedMsg = "Copied!", children }: Props) {
    const [visibleTooltip, setVisibleTooltip] = useState(false);
    const copy = useCallback(() => {
        copyText(text);
        setVisibleTooltip(true);
        setTimeout(() => setVisibleTooltip(false), 2000);
    }, [text]);
    return (
        <BaseTooltip
            open={visibleTooltip}
            content={
                <div className="px-3 py-2 text-white bg-stake-dark-400/80 text-xs">
                    {copiedMsg}
                </div>
            }
        >
            <button onClick={() => copy()}>{children}</button>
        </BaseTooltip>
    );
}

export default CopyBtn;
