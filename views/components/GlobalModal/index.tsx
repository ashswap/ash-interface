import { openLegalModalAtom } from "atoms/ashswap";
import useIsAlready from "hooks/useIsAlready";
import useRouteModal from "hooks/useRouteModal";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";
import { useRecoilState } from "recoil";
const BoostCalcModal = React.lazy(() => import("./BoostCalcModal"));
const LegalModalLazy = dynamic(() => import("./LegalModal"), { ssr: false });
const GlobalModals = () => {
    const { encode, modalParams, showModal, onCloseModal } =
        useRouteModal("calc_boost");
    const lazyBoostCalcModal = useIsAlready(showModal, true);
    const [isOpenLegal, setIsOpenLegal] = useRecoilState(openLegalModalAtom);
    const lazyLegalModal = useIsAlready(isOpenLegal, true);
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
                        setIsOpenLegal(false);
                    }}
                />
            )}
        </>
    );
};

export default GlobalModals;
