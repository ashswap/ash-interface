import { useRouter } from "next/router";
import AppBar from "components/AppBar";
import BackgroundEffect from "components/BackgroundEffect";

const BasicLayout = ({ children }: { children: any }) => {
    const router = useRouter();

    return (
        <div className="pb-24 sm:pb-0">
            {router.route === "/swap" ? <div className="absolute z-[-1] w-full"><BackgroundEffect /></div> : null}
            <AppBar />
            {children}
        </div>
    );
};

export default BasicLayout;
