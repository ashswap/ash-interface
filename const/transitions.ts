import { TransitionClasses } from "@headlessui/react";
const fadeIn: TransitionClasses = {
    enter: "transition duration-200 ease",
    enterFrom: "opacity-0",
    enterTo: "opacity-100",
};
const fadeOut: TransitionClasses = {
    leave: "transition duration-100 ease",
    leaveFrom: "opacity-100",
    leaveTo: "opacity-0",
};
export const TRANSITIONS = {
    fadeIn,
    fadeOut
} as const;