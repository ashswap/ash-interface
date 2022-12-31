import { accIsLoggedInState } from "atoms/dappState";
import useIsAlready from "hooks/useIsAlready";
import useRouteModal from "hooks/useRouteModal";
import React, { Suspense, useEffect } from "react";
import { useRecoilValue } from "recoil";
import FarmWeightVotingModal from "./FarmWeightVotingModal";
const BoostCalcModal = React.lazy(() => import("./BoostCalcModal"));

const GlobalModals = () => {
    const boostCalcModal =
        useRouteModal("calc_boost");
    const farmWeightVotingModal =
        useRouteModal("farm_weight_voting");
    const isLoggin = useRecoilValue(accIsLoggedInState);
    const lazyBoostCalcModal = useIsAlready(boostCalcModal.showModal, true);
    const lazyFarmWeightVotingModal = useIsAlready(farmWeightVotingModal.showModal && isLoggin, true);
    useEffect(() => {
        console.log(farmWeightVotingModal);
    }, [farmWeightVotingModal])
    return (
        <>
            <Suspense fallback={<></>}>
                {lazyBoostCalcModal && (
                    <BoostCalcModal
                        isOpen={boostCalcModal.showModal}
                        onRequestClose={() => boostCalcModal.onCloseModal()}
                        farmAddress={boostCalcModal.modalParams?.farmAddress}
                    />
                )}
            </Suspense>
            <Suspense fallback={<></>}>
                {lazyFarmWeightVotingModal && (
                    <FarmWeightVotingModal
                        isOpen={farmWeightVotingModal.showModal}
                        onRequestClose={() => farmWeightVotingModal.onCloseModal()}
                        farmAddress={farmWeightVotingModal.modalParams?.farmAddress}
                    />
                )}
            </Suspense>
        </>
    );
};

export default GlobalModals;
