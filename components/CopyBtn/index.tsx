import BaseTooltip from "components/BaseTooltip";
import React, { useCallback, useState } from "react";
type Props = {
    text: string;
    copiedMsg?: string;
    children?: any;
};
function CopyBtn({ text, copiedMsg = "Copied!", children }: Props) {
    const [visibleTooltip, setVisibleTooltip] = useState(false);
    const copy = useCallback(() => {
        if (typeof window !== "undefined") {
            window.navigator.clipboard.writeText(text).then(() => {
                setVisibleTooltip(true);
                setTimeout(() => setVisibleTooltip(false), 2000);
            });
        }
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
