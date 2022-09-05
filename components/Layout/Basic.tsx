import { useRouter } from "next/router";
import AppBar from "components/AppBar";
import BackgroundEffect from "components/BackgroundEffect";
import { ENVIRONMENT } from "const/env";

const BasicLayout = ({ children }: { children: any }) => {
    const router = useRouter();

    return (
        <div className="pb-24 sm:pb-0">
            {router.route === "/swap" ? (
                <div className="absolute z-[-1] w-full">
                    <BackgroundEffect />
                </div>
            ) : null}
            <div className="h-8 flex justify-center items-center bg-ash-dark-600 text-2xs text-center text-stake-gray-500">
                <span>
                    Scam/Phishing verification:{" "}
                    <span className="text-pink-600">https://</span>{ENVIRONMENT.ASH_DOMAIN}
                </span>
            </div>
            <AppBar />
            {children}
        </div>
    );
};

export default BasicLayout;
