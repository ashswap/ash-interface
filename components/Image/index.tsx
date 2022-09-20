import NextImage, { ImageLoader, ImageProps } from "next/image";

// opt-out of image optimization, no-op
const customLoader: ImageLoader = ({ src }) => {
  return src
}

export default function Image(props: ImageProps) {
  return (
    <NextImage
      {...props}
      loader={customLoader}
    />
  );
}