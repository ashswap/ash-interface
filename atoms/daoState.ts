import { DAOStatus } from "interface/dao";
import { atom } from "recoil";

export const DAODetailViewAtom = atom({
    key: "dao_detail_view_atom",
    default: false,
});

export const DAOFilterStatusAtom = atom<DAOStatus>({
    key: "dap_filter_status_atom",
    default: undefined,
});

export const DAOFilterOpenProposalAtom = atom<boolean>({
    key: "dao_filter_state_atom",
    default: true,
});

export const DAOFilterStatusOpenOptionsAtom = atom<
    { value: DAOStatus; label: string; checked: boolean }[]
>({
    key: "dao_filter_status_open_options_atom",
    default: [
        { value: "active", label: "Active", checked: true },
        { value: "approved", label: "Passed", checked: true },
        { value: "pending", label: "Pending", checked: true },
    ],
});

export const DAOFilterStatusClosedOptionsAtom = atom<
    { value: DAOStatus; label: string; checked: boolean }[]
>({
    key: "dao_filter_status_closed_options_atom",
    default: [
        { value: "rejected", label: "Rejected", checked: true },
        { value: "executed", label: "Executed", checked: true },
        { value: "expired", label: "Expired", checked: true },
    ],
});
