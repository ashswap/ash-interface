import { useRouter } from "next/router";
import { useMemo } from "react";

const useRouteHash = () => {
    const router = useRouter();
    const hash = useMemo(() => router.asPath.split("#")[1], [router.asPath]);
    return hash;
}

export default useRouteHash;