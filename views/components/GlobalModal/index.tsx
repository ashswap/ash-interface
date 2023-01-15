import { accIsLoggedInState } from "atoms/dappState";
import storage from "helper/storage";
import useIsAlready from "hooks/useIsAlready";
import useRouteModal from "hooks/useRouteModal";
import dynamic from "next/dynamic";
import React, { Suspense, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
const BoostCalcModal = React.lazy(() => import("./BoostCalcModal"));
const LegalModalLazy = dynamic(
    import("./LegalModal").then((m) => m.LegalModal),
    { ssr: false }
);
const GlobalModals = () => {
    const { encode, modalParams, showModal, onCloseModal } =
        useRouteModal("calc_boost");
    const lazyBoostCalcModal = useIsAlready(showModal, true);
    const isLoggedIn = useRecoilValue(accIsLoggedInState);
    const [isOpenLegal, setIsOpenLegal] = useState(false);
    const [isUserClose, setIsUserClose] = useState(false);
    const lazyLegalModal = useIsAlready(isOpenLegal, true);
    useEffect(() => {
        const isOpen =
            !isUserClose &&
            isLoggedIn &&
            !storage.local.getItem("acceptedLegal");
        const timeout = setTimeout(
            () => setIsOpenLegal(isOpen),
            isOpen ? 3000 : 0
        );
        return () => clearTimeout(timeout);
    }, [isLoggedIn, isUserClose]);
    return (
        <>
            <Suspense fallback={<></>}>
                {lazyBoostCalcModal && (
                    <BoostCalcModal
                        isOpen={showModal}
                        onRequestClose={() => onCloseModal()}
                        farmAddress={modalParams?.farmAddress}
                    />
                )}
            </Suspense>
            {lazyLegalModal && (
                <LegalModalLazy
                    isOpen={isOpenLegal}
                    onRequestClose={() => {
                        setIsUserClose(true);
                        setIsOpenLegal(false);
                    }}
                />
            )}
        </>
    );
};

export default GlobalModals;
