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
const zoomIn: TransitionClasses = {
    enter: "transition duration-200 ease",
    enterFrom: "scale-30",
    enterTo: "scale-100",
};
const fadeZoomIn: TransitionClasses = {
    enter: "duration-500 ease",
    enterFrom: "scale-50 opacity-0",
    enterTo: "scale-100 opacity-100",
};
const fadeZoomOut: TransitionClasses = {
    leave: "duration-300 ease-out",
    leaveFrom: "scale-100 opacity-100",
    leaveTo: "scale-50 opacity-0",
};
export const TRANSITIONS = {
    fadeIn,
    fadeOut,
    zoomIn,
    fadeZoomIn,
    fadeZoomOut,
} as const;
