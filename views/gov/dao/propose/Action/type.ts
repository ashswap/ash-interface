import { Interaction } from "@multiversx/sdk-core/out";
import React from "react";

export type WithDynamicRef<U = unknown, T = {}> = T & {dynamicRef: React.Ref<U>}
export type DAOFormRefMethods = {
    generateInteraction: () => Interaction | undefined;
}
export type DAOMeta = {
    title: string;
    description: string;
    discussionLink: string;
}