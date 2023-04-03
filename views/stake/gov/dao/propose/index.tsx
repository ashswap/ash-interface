import { Interaction } from "@multiversx/sdk-core/out";
import ImgVeASH from "assets/images/ve-ash.png";
import { govVeASHAmtSelector } from "atoms/govState";
import BigNumber from "bignumber.js";
import Avatar from "components/Avatar";
import GlowingButton from "components/GlowingButton";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { VE_ASH_DECIMALS } from "const/tokens";
import { gql } from "graphql-request";
import { DAOProposalConfig } from "graphql/type.graphql";
import { graphqlFetcher } from "helper/common";
import { ipfsCluster } from "helper/ipfs";
import { formatAmount } from "helper/number";
import useDAOPropose from "hooks/useDAOContract/useDAOPropose";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useRecoilValue } from "recoil";
import useSWR from "swr";
import DAOCardBg from "../components/DAOCardBg";
import DAOActionGenerator from "./Action";
import ProposalDropdown, { ProposalType } from "./ProposalDropdown";

function DAOPropose() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [discussionLink, setDiscussionLink] = useState("");
    const [isClickedSubmit, setIsClickedSubmit] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const veASHAmt = useRecoilValue(govVeASHAmtSelector);
    const [proposalType, setProposalType] =
        useState<ProposalType>("fc:add_farm");
    const address = useMemo(() => {
        const type = proposalType.split(":")[0];
        switch (type) {
            case "fc":
                return ASHSWAP_CONFIG.dappContract.farmController;
            case "fr":
                return ASHSWAP_CONFIG.dappContract.farmRouter;
            case "fb":
                return ASHSWAP_CONFIG.dappContract.farmBribe;
            case "pr":
                return ASHSWAP_CONFIG.dappContract.router;
            default:
                return "";
        }
    }, [proposalType]);
    const functionName = useMemo(
        () => proposalType.split(":")[1],
        [proposalType]
    );
    const { data } = useSWR<{ proposalConfig: DAOProposalConfig }>(
        [
            gql`
                query proposalConfig(
                    $address: String!
                    $functionName: String!
                ) {
                    proposalConfig(
                        address: $address
                        functionName: $functionName
                    ) {
                        min_power_for_propose
                        min_time_for_propose
                        min_support_pct
                        min_quorum_pct
                        voting_time_limit
                        queue_time_limit
                        execute_time_limit
                    }
                }
            `,
            { address, functionName },
        ],
        graphqlFetcher,
        { revalidateOnFocus: false }
    );
    const proposalConfig = useMemo(
        () =>
            data?.proposalConfig || {
                min_power_for_propose: "0",
                min_time_for_propose: 0,
                min_support_pct: "0",
                min_quorum_pct: "0",
                voting_time_limit: 0,
                queue_time_limit: 0,
                execute_time_limit: 0,
            },
        [data]
    );
    const isInvalidTitle = useMemo(() => {
        return !title || title.length > 120;
    }, [title]);
    const isInvalidDesc = useMemo(() => {
        return !description || description.length > 520;
    }, [description]);
    const isInvalidDiscussionLink = useMemo(() => {
        return !discussionLink;
    }, [discussionLink]);
    const onProposalChange = useCallback((proposal: ProposalType) => {
        setProposalType(proposal);
    }, []);
    const actionGeneratorRef =
        useRef<{ generateInteraction: () => Interaction }>(null);
    const {
        propose,
        trackingData: { isPending, isSigned },
    } = useDAOPropose(true);

    const onCreateProposal = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setIsClickedSubmit(true);

            const interaction =
                actionGeneratorRef.current?.generateInteraction();
            if (
                isInvalidTitle ||
                isInvalidDesc ||
                isInvalidDiscussionLink ||
                !interaction
            )
                return;
            setIsUploading(true);
            try {
                const bytes = new TextEncoder().encode(
                    JSON.stringify({ title, description, discussionLink })
                );
                const file = new Blob([bytes], {
                    type: "application/json;charset=utf-8",
                });
                const res = await ipfsCluster.add(file, {name: "Proposal"});
                await propose(res.cid, interaction);
            } catch (error) {
                setIsUploading(false);
            }
        },
        [
            description,
            discussionLink,
            isInvalidDesc,
            isInvalidDiscussionLink,
            isInvalidTitle,
            propose,
            title,
        ]
    );

    useEffect(() => {
        if (isSigned) {
            setTimeout(() => {
                setIsUploading(false);
            }, 3000);
        }
    }, [isSigned]);

    return (
        <form
            className="flex flex-col lg:flex-row gap-7.5"
            onSubmit={onCreateProposal}
        >
            <div className="lg:w-1/3">
                <div className="px-9 py-14 bg-stake-dark-300">
                    <div className="mb-7 font-bold text-2xl text-white">
                        Proposal Info
                    </div>
                    <div className="space-y-6">
                        <div className="p-6 bg-[#2A2A42]">
                            <div className="mb-4 inline-flex font-bold text-xs">
                                <div className="mr-2 font-medium text-stake-gray-500">
                                    Your veASH:&nbsp;
                                </div>
                                <div className="inline-flex items-center">
                                    <Avatar
                                        src={ImgVeASH}
                                        alt="veASH"
                                        className="w-4 h-4 mr-1.5"
                                    />
                                    <div className="text-white">
                                        {formatAmount(
                                            veASHAmt.div(10 ** VE_ASH_DECIMALS)
                                        )}{" "}
                                        veASH
                                    </div>
                                </div>
                            </div>
                            <div className="font-medium text-xs text-stake-gray-500">
                                You need at least{" "}
                                {formatAmount(
                                    new BigNumber(
                                        proposalConfig.min_power_for_propose
                                    ).div(10 ** VE_ASH_DECIMALS)
                                )}{" "}
                                veASH to create a proposal.
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="propose-title"
                                className="mb-2 text-sm"
                            >
                                <span className="font-medium text-stake-gray-500">
                                    Title{" "}
                                </span>{" "}
                                <span className="font-bold text-ash-gray-600">
                                    (max 120 characters)
                                </span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                id="propose-title"
                                placeholder="A short summary of your proposal"
                                className={`px-6 py-4 w-full bg-ash-dark-400 font-bold text-xs leading-normal outline-none placeholder:text-ash-gray-600 border ${
                                    isClickedSubmit && isInvalidTitle
                                        ? "border-ash-purple-500"
                                        : "border-transparent"
                                }`}
                                maxLength={120}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="propose-description"
                                className="mb-2 text-sm"
                            >
                                <span className="font-medium text-stake-gray-500">
                                    Description{" "}
                                </span>{" "}
                                <span className="font-bold text-ash-gray-600">
                                    (max 520 characters)
                                </span>
                            </label>
                            <textarea
                                name="description"
                                id="propose-description"
                                rows={5}
                                placeholder={`## Summary\n\nYour proposal will be formatted using Markdown.`}
                                className={`px-6 py-4 w-full bg-ash-dark-400 font-bold text-xs leading-normal outline-none placeholder:text-ash-gray-600 resize-none overflow-auto border ${
                                    isClickedSubmit && isInvalidDesc
                                        ? "border-ash-purple-500"
                                        : "border-transparent"
                                }`}
                                maxLength={520}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="propose-discussion-link"
                                className="mb-2 text-sm"
                            >
                                <span className="font-bold text-ash-gray-600">
                                    Link to&nbsp;
                                </span>
                                <span className="font-medium text-stake-gray-500 underline">
                                    discussion
                                </span>
                            </label>
                            <textarea
                                name="discussionLink"
                                id="propose-discussion-link"
                                placeholder="To create a proposal on Dapp, you must first initiate a discussion on our forum."
                                rows={3}
                                className={`px-6 py-4 w-full bg-ash-dark-400 font-bold text-xs leading-normal outline-none placeholder:text-ash-gray-600 resize-none overflow-auto border ${
                                    isClickedSubmit && isInvalidDiscussionLink
                                        ? "border-ash-purple-500"
                                        : "border-transparent"
                                }`}
                                value={discussionLink}
                                onChange={(e) =>
                                    setDiscussionLink(e.target.value)
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="lg:w-2/3">
                <div className="relative">
                    <DAOCardBg
                        clipClassName="bg-stake-dark-300"
                        status="active"
                    />
                    <div className="relative px-12 py-14">
                        <div className="mb-5 font-bold text-2xl text-white">
                            Proposal Action
                        </div>
                        <div className="mb-14">
                            <div className="font-bold text-sm text-stake-gray-500">
                                Proposal Type
                            </div>
                            <ProposalDropdown
                                value={proposalType}
                                onSelect={onProposalChange}
                            />
                        </div>
                        <DAOActionGenerator
                            ref={actionGeneratorRef}
                            type={proposalType}
                        />
                    </div>
                </div>
                <GlowingButton
                    theme="pink"
                    type="submit"
                    disabled={isPending || isUploading}
                    onClick={onCreateProposal}
                    className="mt-4 w-full h-18 font-bold text-sm text-white disabled:bg-stake-dark-300"
                >
                    Done & Create
                </GlowingButton>
            </div>
        </form>
    );
}

export default DAOPropose;
