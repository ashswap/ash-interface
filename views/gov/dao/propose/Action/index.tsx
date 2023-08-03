import { Interaction } from "@multiversx/sdk-core/out";
import { ProposalType } from "const/proposal";
import dynamic from "next/dynamic";
import {
    forwardRef, memo, useImperativeHandle,
    useRef
} from "react";
import { DAOFormRefMethods } from "./type";
type Props = {
    type: ProposalType;
};
const DAOFCAddFarmForm = dynamic(
    import("./DAOFCAddFarmForm").then((m) => m.default),
    { ssr: false }
);
const DAOFREndProduceRewardsForm = dynamic(
    import("./DAOFRProduceRewardForm").then((m) => m.default),
    { ssr: false }
);
const DAOFRCreateFarmForm = dynamic(
    import("./DAOFRCreateFarmForm").then((m) => m.default),
    { ssr: false }
);
const DAORouterCreatePoolForm = dynamic(
    import("./DAORouterCreatePoolForm").then((m) => m.default),
    { ssr: false }
);
const DAOActionGenerator = forwardRef<DAOFormRefMethods, Props>(function DAOActionGenerator(
    { type }: Props,
    ref
) {
    const formRef = useRef<{ generateInteractions: () => Interaction[] }>(null);
    useImperativeHandle(
        ref,
        () => ({
            generateInteractions() {
                return formRef.current?.generateInteractions() || [];
            },
        }),
        []
    );
    return (
        <div>
            {type === "fc:addFarm" && (
                <DAOFCAddFarmForm dynamicRef={formRef} />
            )}
            {type === "fr:endProduceRewards" && (
                <DAOFREndProduceRewardsForm dynamicRef={formRef} type="stop" />
            )}
            {type === "fr:startProduceRewards" && (
                <DAOFREndProduceRewardsForm dynamicRef={formRef} type="start" />
            )}
            {type === "fr:createFarm" && (
                <DAOFRCreateFarmForm dynamicRef={formRef}/>
            )}
            {type === "pr:createPool" && (
                <DAORouterCreatePoolForm dynamicRef={formRef}/>
            )}
        </div>
    );
});

export default memo(DAOActionGenerator);
