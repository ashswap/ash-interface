import BasicLayout from "components/Layout/Basic";
import type { NextPage } from "next";
import Swap from "views/swap/Swap";

const AggregatorPage: NextPage = () => {
    return (
        <BasicLayout>
            <Swap/>
        </BasicLayout>
    );
};

export default AggregatorPage;
