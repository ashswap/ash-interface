import { fetcher } from "helper/common";
import { useMemo } from "react";
import useSWR from "swr";
import { DAOMeta } from "../propose/Action/type";

const useDAOProposalMeta = (ipfsHash: string) => {
    const url = useMemo(() => {
        return ipfsHash ? `https://ipfs-gateway-internal.bicarus.io/ipfs/${ipfsHash}` : null;
    }, [ipfsHash]);
    const { data, error } = useSWR<DAOMeta>(url, fetcher, {
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
            // Only retry up to 10 times.
            if (retryCount >= 5) return;

            // Retry after 5 seconds.
            setTimeout(() => revalidate({ retryCount }), 5000);
        },
    });
    const meta: DAOMeta = useMemo(() => {
        if (!data || error) {
            return {
                title: `Proposal`,
                description: "",
                discussionLink: "",
            };
        }
        return data;
    }, [data, error]);
    return meta;
};
export default useDAOProposalMeta;
