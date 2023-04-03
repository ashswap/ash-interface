import { Cluster } from "@nftstorage/ipfs-cluster";
export const ipfsCluster = new Cluster(
    process.env.NEXT_PUBLIC_IPFS_API as string,
    {
        headers: {
            Authorization: `Basic ${Buffer.from(
                `${process.env.NEXT_PUBLIC_IPFS_USER}:${process.env.NEXT_PUBLIC_IPFS_PASS}`
            ).toString("base64")}`,
        },
    }
);
