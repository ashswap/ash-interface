import { useEffect } from "react";
import { useRouter } from "next/router";
import BasicLayout from "components/Layout/Basic";
import { NextPageWithLayout } from "./_app";

const HomePage: NextPageWithLayout = () => {
    const router = useRouter();

    useEffect(() => {
        if (router.route === "/") {
            router.replace("/swap");
        }
    }, [router]);

    return <></>;
};

HomePage.getLayout = function getLayout(page) {
    return <BasicLayout>{page}</BasicLayout>;
};

export default HomePage;
