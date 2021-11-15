import { useRouter } from "next/router";
import AppBar from "components/AppBar";
import BackgroundEffect from "components/BackgroundEffect";

const BasicLayout = ({ children }: { children: any }) => {
    const router = useRouter();

    return (
        <>
            <AppBar />
            {router.route === "/swap" ? <BackgroundEffect /> : null}
            {children}
        </>
    );
};

export default BasicLayout;
