import Image from "components/Image";
import customTwMerge from "helper/customTwMerge";
import { ImageProps } from "next/image";
import { useMemo } from "react";
type Props = JSX.IntrinsicElements["span"] &
    Partial<Pick<ImageProps, "src" | "alt">>;
function Avatar({ src, alt, ...props }: Props) {
    const className = useMemo(() => {
        return customTwMerge(
            "relative w-full h-full rounded-full overflow-hidden bg-stake-dark-300",
            props.className
        );
    }, [props.className]);
    return (
        <span {...props} className={className}>
            {src && (
                <Image src={src} alt={alt || ""} fill style={{objectFit: "cover"}} />
            )}
        </span>
    );
}

export default Avatar;
