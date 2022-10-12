import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef } from "react";

type ModalType = {
    calc_boost: { farmAddress?: string };
};
function useRouteModal<T extends keyof ModalType>(key: keyof ModalType) {
    const router = useRouter();
    const routerRef = useRef(router);

    const p = useMemo(() => {
        return router.query.p;
    }, [router.query]);

    const showModal = useMemo(() => {
        return typeof p === "string" && p.startsWith(key);
    }, [p, key]);

    const encode = useCallback(
        (params?: ModalType[T]) => {
            if (!params) return key;
            const _params = Object.fromEntries(
                Object.entries(params).filter(
                    ([k, v]) => v !== undefined && v !== null
                )
            );
            if (Object.entries(_params).length === 0) return key;
            return (
                key +
                "_" +
                Object.entries(_params)
                    .map(([k, v]) => `${k}=${v}`)
                    .join("_")
            );
        },
        [key]
    );
    const decode = useCallback(
        (p: string) => {
            if (!p.startsWith(key) || p.length === key.length) return null;
            const str = p.slice(key.length + 1);
            if (!str) return null;
            return Object.fromEntries(
                str.split("_").map((s) => {
                    const [k, ...v] = s.split("=");
                    return [k, v.join("")];
                })
            ) as ModalType[T];
        },
        [key]
    );
    const modalParams = useMemo(() => {
        if (p && typeof p === "string" && p.startsWith(key)) return decode(p);
        return null;
    }, [p, decode, key]);

    const onCloseModal = useCallback(() => {
        const router = routerRef.current;
        console.log(router.pathname, router);
        router.replace(
            {
                pathname: router.pathname,
                query: (delete router.query.p, router.query),
            },
            undefined,
            { shallow: true }
        );
    }, []);

    useEffect(() => {
        routerRef.current = router;
    }, [router]);

    return {
        showModal,
        encode,
        decode,
        modalParams,
        onCloseModal,
    };
}

export default useRouteModal;
