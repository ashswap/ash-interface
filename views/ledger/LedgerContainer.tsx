import { useGetAccountInfo, useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import ICBambooShootXL from "assets/svg/bamboo-shoot-xl.svg";
import ICSkewStep from "assets/svg/skew-step.svg";
import { LedgerLogin } from "components/Ledger/LedgerLogin";
import useMounted from "hooks/useMounted";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
function LedgerContainer() {
    const router = useRouter();
    const routerRef = useRef(router);
    const { ledgerAccount } = useGetAccountInfo();
    const { isLoggedIn, loginMethod } = useGetLoginInfo();
    const [isConfirm, setIsConfirm] = useState(false);
    const callbackUrl = useMemo(() => {
        return (router.query.callbackUrl as string) || "/";
    }, [router.query]);
    const isMounted = useMounted();
    useEffect(() => {
        setIsConfirm(!!ledgerAccount);
    }, [ledgerAccount]);
    useEffect(() => {
        routerRef.current = router;
    }, [router]);
    useEffect(() => {
        if (isLoggedIn) {
            routerRef.current.push(callbackUrl);
        }
    }, [isLoggedIn, callbackUrl]);
    return (
        <div className="ash-container py-10">
            <div className="sm:flex sm:space-x-7.5">
                <div className="w-full sm:w-5/12 relative">
                    <ICBambooShootXL className="absolute -z-10 top-14 max-w-full w-60 h-auto" />
                    <h1 className="font-bold text-2xl md:text-4xl lg:text-5xl text-white leading-tight mb-12 md:mb-24">
                        Ledger Connectors
                    </h1>
                    <div className="flex mb-6">
                        <ICSkewStep
                            className={`text-pink-600 ${
                                isConfirm
                                    ? ""
                                    : "colored-drop-shadow-xs colored-drop-shadow-pink-600"
                            }`}
                        />
                        <ICSkewStep
                            className={`${
                                isConfirm
                                    ? "text-pink-600 colored-drop-shadow-xs colored-drop-shadow-pink-600"
                                    : "text-ash-gray-600"
                            }`}
                        />
                    </div>
                    {!isConfirm ? (
                        <div className="font-bold md:text-lg lg:text-2xl text-ash-gray-500">
                            Choose 1 address to connect
                        </div>
                    ) : (
                        <div>
                            <div className="font-bold text-2xl text-white">
                                Confirm Address
                            </div>
                        </div>
                    )}
                </div>
                <div className="sm:w-7/12 mt-10 sm:mt-0 -mx-6 md:mx-0">
                    {isMounted && <LedgerLogin />}
                </div>
            </div>
        </div>
    );
}

export default LedgerContainer;
