import useIsAlready from "hooks/useIsAlready";
import useRouteModal from "hooks/useRouteModal";
import React, { Suspense } from "react";
const BoostCalcModal = React.lazy(() => import("./BoostCalcModal"));

const GlobalModals = () => {
    const { encode, modalParams, showModal, onCloseModal } =
        useRouteModal("calc_boost");
    const lazyBoostCalcModal = useIsAlready(showModal, true);
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
        </>
    );
};

export default GlobalModals;
