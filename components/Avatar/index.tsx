import Image, { ImageProps } from "next/image";
import React, { useMemo } from "react";
import { twMerge } from "tailwind-merge";
type Props = JSX.IntrinsicElements["span"] & Pick<ImageProps, "src" | "alt">;
function Avatar({ src, alt, ...props }: Props) {
    const className = useMemo(() => {
        return twMerge(
            "relative w-full h-full rounded-full overflow-hidden bg-stake-dark-300",
            props.className
        );
    }, [props.className]);
    return (
        <span {...props} className={className}>
            {src && <Image src={src} alt={alt} layout="fill" objectFit="cover" />}
        </span>
    );
}

export default Avatar;
