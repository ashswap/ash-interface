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
const DAOActionGenerator = forwardRef<DAOFormRefMethods, Props>(function DAOActionGenerator(
    { type }: Props,
    ref
) {
    const formRef = useRef<{ generateInteraction: () => Interaction }>(null);
    useImperativeHandle(
        ref,
        () => ({
            generateInteraction() {
                return formRef.current?.generateInteraction();
            },
        }),
        []
    );
    return (
        <div>
            {type === "fc:add_farm" && (
                <DAOFCAddFarmForm dynamicRef={formRef} />
            )}
            {type === "fr:endProduceRewards" && (
                <DAOFREndProduceRewardsForm dynamicRef={formRef} type="stop" />
            )}
            {type === "fr:startProduceRewards" && (
                <DAOFREndProduceRewardsForm dynamicRef={formRef} type="start" />
            )}
        </div>
    );
});

export default memo(DAOActionGenerator);
