import { fetcher } from "helper/common";
import { useMemo } from "react";
import useSWR from "swr";
import { DAOMeta } from "../propose/Action/type";
import { PROPOSAL_STATIC } from "const/proposalStatic";

const useDAOProposalMeta = (ipfsHash: string) => {
    const url = useMemo(() => {
        return ipfsHash
            ? `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${ipfsHash}`
            : null;
    }, [ipfsHash]);
    const { data, error } = useSWR<DAOMeta>(
        PROPOSAL_STATIC[ipfsHash] ? null : url,
        fetcher,
        {
            onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
                // Only retry up to 10 times.
                if (retryCount >= 5) return;

                // Retry after 5 seconds.
                setTimeout(() => revalidate({ retryCount }), 5000);
            },
        }
    );
    const meta: DAOMeta = useMemo(() => {
        if (PROPOSAL_STATIC[ipfsHash]) return PROPOSAL_STATIC[ipfsHash];
        if (!data || error) {
            return {
                title: `Proposal`,
                description: "",
                discussionLink: "",
            };
        }
        return data;
    }, [data, error, ipfsHash]);
    return meta;
};
export default useDAOProposalMeta;
