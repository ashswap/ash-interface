import BackgroundEffect from "components/BackgroundEffect";
import MainHeader from "components/Header/MainHeader";
import { ENVIRONMENT } from "const/env";
// import { useScreenSize } from "hooks/useScreenSize";
// import dynamic from "next/dynamic";
import { useRouter } from "next/router";
// const NavMobileLazy = dynamic(
//     import("components/Nav/NavMobile").then((m) => m.default)
// );
const BasicLayout = ({ children }: { children: any }) => {
    const router = useRouter();
    // const { isMobile } = useScreenSize();
    return (
        <div className="pb-32 sm:pb-0">
            {router.route === "/swap" ? (
                <div className="absolute z-[-1] w-full">
                    <BackgroundEffect />
                </div>
            ) : null}
            <div className="h-8 flex justify-center items-center bg-ash-dark-600 text-2xs text-center text-stake-gray-500">
                <span>
                    Scam/Phishing verification:{" "}
                    <span className="text-pink-600">https://</span>
                    {ENVIRONMENT.ASH_DOMAIN}
                    {ENVIRONMENT.NETWORK === "devnet" &&
                        ENVIRONMENT.ENV === "beta" && (
                            <span>
                                &nbsp;- Claim devnet tokens{" "}
                                <a
                                    href="https://faucet-devnet.ashswap.io/"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <span className="text-ash-cyan-500 underline">
                                        Here
                                    </span>
                                </a>
                            </span>
                        )}
                </span>
            </div>
            {/* <AppBar /> */}
            <MainHeader />
            {/* {isMobile && <NavMobileLazy />} */}
            {children}
        </div>
    );
};

export default BasicLayout;
