import BasicLayout from "components/Layout/Basic";
import QuestOverview from "views/quest/QuestOverview";

function AshPoint() {
    return (
        <BasicLayout>
            <div className="ash-container pb-40 pt-8">
                <QuestOverview />
            </div>
        </BasicLayout>
    );
}
export default AshPoint;
