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
    | "prize";

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
    start: number;
    end: number;
    require: number;
    redirect: string;
    quest_name: string;
    // last claimed = required condition of prev ashpoint task
    last_claimed: number;
}

export type FarmQuest = ICustomQuest & {
    continuous_day: number;
    continuous_run: number;
    // days
    min_time: number;
    point: number;
    // USD value
    stake_amount: number;
}

export type GovQuest = ICustomQuest & {
    prize: Record<number, number>;
    create_lock_at: number;
    locked_end_at: number;
    // days
    min_time: number;
    // ve
    ve_ash_amount: number;
}

export type SwapQuest = ICustomQuest & {
    point: number;
    // USD value
    swap_amount: number;
}

export type ManualQuest = ICustomQuest & {
    title: string;
    note: string;
    point: number;
}

export function isFarmQuest(quest: ICustomQuest): quest is FarmQuest {
    return quest.__typename === "farm_quest";
}
export function isGovQuest(quest: ICustomQuest): quest is GovQuest {
    return quest.__typename === "governance_quest";
}
export function isSwapQuest(quest: ICustomQuest): quest is SwapQuest {
    return quest.__typename === "swap_quest";
}
export function isManualQuest(quest: ICustomQuest): quest is ManualQuest {
    return quest.__typename === "manual_quest";
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
    farm_quest: Record<string, FarmQuest>,
    governance_quest: Record<string, GovQuest>,
    swap_quest: Record<string, SwapQuest>,
}

export const CUSTOM_QUEST_TYPES: Array<keyof CustomQuestMapModel> = ["farm_quest", "governance_quest", "swap_quest"];