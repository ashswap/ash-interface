import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useMemo } from "react";
import Error from "views/_error";
const DAODetailDyn = dynamic(
    import("views/dynamic/DAODetailDyn").then((m) => m.default),
    { ssr: false }
);
export default function NotFound() {
    // Opinionated: do not record an exception in Sentry for 404
    const router = useRouter();
    // useEffect(() => {
    //     console.log(router);
    //     if(/^\/*stake\/gov\/dao\/\d+\/*/.test(router.asPath)){
    //         console.log("match");
    //         router.replace('/stake/gov/dao/0', '/stake/gov/dao/10', {shallow: true})

    //     }
    // }, [router]);
    const path = useMemo(() => router.asPath.split("?")[0], [router.asPath]);
    if (/^\/*stake\/gov\/dao\/\d+\/*/.test(path)) {
        const id = path.replace(/[^\d]/gm, "");
        if (id) {
            return <DAODetailDyn proposalID={+id} />;
        }
    }
    return <Error statusCode={404} />;
}
