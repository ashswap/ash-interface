import { useRouter } from "next/router";
import React, { useEffect } from "react";

function RedirectPage() {
    const router = useRouter();
    useEffect(() => {
        const pathname = window?.location.pathname;
        if (
            ["/reward-pool", "/launch-race"].some((path) =>
                pathname.includes(path)
            )
        ) {
            window.location.href = `https://event.ashswap.io${pathname}`;
        }
    }, [router.pathname]);
    return <div></div>;
}

export default RedirectPage;
