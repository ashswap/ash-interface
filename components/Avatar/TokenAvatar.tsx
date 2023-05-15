import { memo } from "react";
import useGetESDTInfo from "hooks/useGetESDTInfo";
import Avatar from ".";

type Props = Omit<Parameters<typeof Avatar>[0], "src" | "alt"> & {
    identifier: string;
};
function TokenAvatar({ identifier, ...props }: Props) {
    const token = useGetESDTInfo(identifier);
    return <Avatar src={token?.logoURI} alt={token?.name} {...props} />;
}

export default memo(TokenAvatar);
