export type QuestItemModel = {
    id: number;
    name: string;
    target: number;
    current: number;
    ashpoint: number;
    status: number;
};

export type QuestActionType =
    | "addLiquidity"
    | "exchange"
    | "removeLiquidity"
    | "enterFarm"
    | "exitFarm"
    | "claimRewards"
    | "claim"
    | "create_lock"
    | "increase_amount"
    | "increase_unlock_time"
    | "withdraw"
    | "prize"
    | "aggregate";

export type QuestAction = {
    duration: number;
    // if user claimed or not
    is_claimed: boolean;
    // number of point to be receive
    point: number;
    // redirect to the link to do the task
    redirect: string;
    // current number of actions is recorded
    progress: number;
    // number of actions to be eligible to claim ashpoint
    require: number;
};

export type QuestWallet = {
    ash_point_action: number;
    ash_point_affiliate: number;
    ash_point_community: number;
    ash_point_prize: number;
    ash_point_total: number;
    continuous_day: number;
    created_at: number;
    discord_created_at: number;
    discord_id: string;
    discord_metadata: {
        user: DiscordMetadata;
    };
    last_claimed_prize: number;
    last_continuous_run: number;
    rank: number;
    referral_address: string;
    twitter_created_at: number;
    twitter_metadata: {
        user: TwitterMetadata;
    };
    twitter_username: string;
    wallet_address: string;
    invitation_code: string;
    // launch race
    race_point: number;
    user_invited: number;
    user_staked: number;
};

export interface ICustomQuest {
    __typename?: string;
    // start with https:// -> absolute url otherwise use relative url
    redirect: string;
    // client filled
    quest_name: string;
}

export type BopQuest = ICustomQuest & {
    point: number;
    tx_hash: string;
};

export function isBopQuest(quest: ICustomQuest): quest is BopQuest {
    return quest.__typename === "bop_quest";
}

export type DiscordMetadata = {
    id: string;
    email: string;
    username: string;
    discriminator: string;
};

export type TwitterMetadata = {
    id: string;
    name: string;
    username: string;
    created_at: string;
};

export type QuestUserStatsModel = {
    action: { [key in QuestActionType]: QuestAction };
    wallet: QuestWallet;
};

export type CustomQuestMapModel = {
    bop_quest: Record<string, BopQuest>;
};

export const CUSTOM_QUEST_TYPES: Array<keyof CustomQuestMapModel> = [
    "bop_quest",
];
