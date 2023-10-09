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
export const fetcher = (
    params: [input: RequestInfo, init?: RequestInit] | string
) => {
    if (typeof params === "string")
        return fetch(params).then((res) => res.json());
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

export const copyText = (text: string) => {
    if (typeof document !== "undefined") {
        // Create a temporary textarea to hold the text
        const tempTextArea = document.createElement("textarea");
        tempTextArea.value = text;
        document.body.appendChild(tempTextArea);

        // Select the text in the textarea
        tempTextArea.select();
        tempTextArea.setSelectionRange(0, 99999); // For mobile devices

        // Copy the selected text to the clipboard
        document.execCommand("copy");

        // Remove the temporary textarea
        document.body.removeChild(tempTextArea);
    }
};
