import Image from "components/Image";
import customTwMerge from "helper/customTwMerge";
import { ImageProps } from "next/image";
import { memo, useEffect, useMemo, useState } from "react";
type Props = JSX.IntrinsicElements["span"] &
    Partial<Pick<ImageProps, "src" | "alt">>;
function Avatar({ src, alt, ...props }: Props) {
    const [error, setError] = useState(false);
    const className = useMemo(() => {
        return customTwMerge(
            "relative w-full h-full rounded-full overflow-hidden bg-stake-dark-300",
            props.className
        );
    }, [props.className]);
    useEffect(() => {
        setError(false);
    }, [src]);
    return (
        <span {...props} className={className}>
            {src && !error && (
                <Image src={src} alt={alt || ""} fill style={{objectFit: "cover"}} onError={() => setError(true)} />
            )}
        </span>
    );
}

export default memo(Avatar);
