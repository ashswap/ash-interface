import { WebComponent } from 'interface/webComponent'
import Image, { ImageProps } from 'next/image';
import React, { useMemo } from 'react'
import { twMerge } from 'tailwind-merge';
type Props = WebComponent<HTMLDivElement> & Pick<ImageProps, "src" | "alt">;
function Avatar({src, alt, ...props}: Props) {
    const className = useMemo(() => {
        return twMerge("relative w-full h-full rounded-full", props.className);
    }, [props.className]);
  return (
    <div {...props} className={className}>
        <Image src={src} alt={alt} layout="fill" objectFit="cover"/>
    </div>
  )
}

export default Avatar