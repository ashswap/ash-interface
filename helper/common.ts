import { ENVIRONMENT } from "const/env";
import request, { Variables } from "graphql-request";

export const emptyFunc = () => {};
export const delay = async (miliseconds: number) => {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, miliseconds);
    });
};
export const fetcher = (params: [
    input: RequestInfo,
    init?: RequestInit
] | string) => {
    if (typeof params === 'string') return fetch(params).then(res => res.json());
    const [input, init] = params;
    return fetch(input, init).then((res) => res.json());
};
export const arrayFetcher = (urlArr: RequestInfo[]) => {
    const f = (u: RequestInfo) => fetch(u).then((r) => r.json());
    return Promise.all(urlArr.filter((val) => !!val).map(f));
};

export const graphqlFetcher = ([query, variables]: [
    query: string,
    variables?: Variables
]) => request(`${ENVIRONMENT.ASH_GRAPHQL}/graphql`, query, variables);
