import { useRouter } from "next/router";
import AppBar from "components/AppBar";
import BackgroundEffect from "components/BackgroundEffect";

const BasicLayout = ({ children }: { children: any }) => {
    const router = useRouter();

    return (
        <>
            {router.route === "/swap" ? <div className="absolute z-[-1] w-full"><BackgroundEffect /></div> : null}
            <AppBar />
            {children}
        </>
    );
};

export default BasicLayout;
