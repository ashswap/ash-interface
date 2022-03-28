export const emptyFunc = () => {}
export const fetcher = (input: RequestInfo, init?: RequestInit) => fetch(input, init).then(res => res.json());
export const arrayFetcher = (...urlArr: RequestInfo[]) => {
    const f = (u: RequestInfo) => fetch(u).then((r) => r.json());
    return Promise.all(urlArr.filter(val => !!val).map(f));
  }