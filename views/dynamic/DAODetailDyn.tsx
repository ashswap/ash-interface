import GovLayout from "components/Layout/Gov";
import DAODetailWrapper from "views/gov/dao/detail";

function DAODetailDyn({ proposalID }: { proposalID: number }) {
    return (
        <GovLayout>
            <div className="ash-container text-white">
                <DAODetailWrapper proposalID={proposalID} />
            </div>
        </GovLayout>
    );
}

export default DAODetailDyn;
