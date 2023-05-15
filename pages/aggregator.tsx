import BasicLayout from "components/Layout/Basic";
import type { NextPage } from "next";
import Aggregator from "views/swap/Aggregator";

const AggregatorPage: NextPage = () => {
    return (
        <BasicLayout>
            <Aggregator/>
        </BasicLayout>
    );
};

export default AggregatorPage;
