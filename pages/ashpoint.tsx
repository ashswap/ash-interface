import BasicLayout from "components/Layout/Basic";
import { ENVIRONMENT } from "const/env";
import { useRouter } from "next/router";
import { useEffect } from "react";
import QuestOverview from "views/quest/QuestOverview";

function AshPoint() {
    const router = useRouter();
    useEffect(() => {
        if (!ENVIRONMENT.ENABLE_ASHPOINT) {
            router.replace("/swap");
        }
    }, [router]);
    if(!ENVIRONMENT.ENABLE_ASHPOINT) return null;
    return (
        <BasicLayout>
            <div className="ash-container pb-40 pt-8">
                <QuestOverview />
            </div>
        </BasicLayout>
    );
}
export default AshPoint;
