import { DAOStatus } from "interface/dao";

export const DAOThemeTextClassName: Record<DAOStatus, string> = {
    pending: "text-ash-gray-600",
    active: "text-pink-600",
    rejected: "text-ash-purple-500",
    executed: "text-stake-green-500",
    approved: "text-stake-green-500",
    expired: "text-ash-purple-500",
};