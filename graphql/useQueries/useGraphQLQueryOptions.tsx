import { gqlQueryOptionsAtom } from "atoms/ashswap";
import { GraphOptions } from "graphql/type";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";

function updateOptions(
    state: Record<keyof GraphOptions, number>,
    opt: GraphOptions
): Record<keyof GraphOptions, number> {
    const entries = Object.entries(state).map(([k, v]) => {
        const sub = opt[k as keyof GraphOptions];
        return [k, typeof sub === "undefined" ? v : v + (sub ? 1 : -1)];
    });
    return Object.fromEntries(entries);
}
const useGraphQLQueryOptions = (opt: GraphOptions) => {
    const setOptions = useSetRecoilState(gqlQueryOptionsAtom);
    useEffect(() => {
        console.log("set options", opt)
    }, [opt]);
    useEffect(() => {
        setOptions((state) => {
            return updateOptions(state, opt);
        });

        return () => {
            setOptions((state) => {
                const invertOpt = Object.fromEntries(
                    Object.entries(opt).map(([k, v]) => {
                        return [k, !v];
                    })
                );
                return updateOptions(state, invertOpt);
            });
        };
    }, [opt, setOptions]);
};
export default useGraphQLQueryOptions;
