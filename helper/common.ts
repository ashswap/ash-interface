import { ENVIRONMENT } from "const/env";
import request, { Variables } from "graphql-request";

export const emptyFunc = () => {}
export const fetcher = (input: RequestInfo, init?: RequestInit) => fetch(input, init).then(res => res.json()).then(res => res.error ? undefined : res);
export const arrayFetcher = (...urlArr: RequestInfo[]) => {
    const f = (u: RequestInfo) => fetch(u).then((r) => r.json());
    return Promise.all(urlArr.filter(val => !!val).map(f));
  }

export const graphqlFetcher = (query: string, variables?: Variables) => request(`${ENVIRONMENT.ASH_GRAPHQL}/graphql`, query, variables)